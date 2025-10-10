import type { PrismaClient } from "@prisma/client"
import type { CreateStockMovementDto, StockAdjustmentDto } from "../dto/inventory.dto"

export class InventoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getLowStockProducts() {
    return this.prisma.product.findMany({
      where: {
        stock: {
          lte: this.prisma.product.fields.minStock,
        },
      },
      include: {
        supplier: true,
      },
      orderBy: {
        stock: "asc",
      },
    })
  }

  async getStockMovements(params?: {
    productId?: bigint
    type?: string
    startDate?: Date
    endDate?: Date
    page?: number
    pageSize?: number
  }) {
    const { productId, type, startDate, endDate, page = 1, pageSize = 50 } = params ?? {}
    const skip = (page - 1) * pageSize

    const where = {
      ...(productId && { productId }),
      ...(type && { type }),
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
    }

    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          product: true,
        },
      }),
      this.prisma.stockMovement.count({ where }),
    ])

    return { data, total }
  }

  async createStockMovement(movement: CreateStockMovementDto) {
    return this.prisma.stockMovement.create({
      data: movement,
      include: {
        product: true,
      },
    })
  }

  async adjustStock(adjustment: StockAdjustmentDto) {
    return this.prisma.$transaction(async (tx) => {
      // Get current product
      const product = await tx.product.findUnique({
        where: { id: adjustment.productId },
      })

      if (!product) throw new Error("Product not found")

      // Update stock
      const updatedProduct = await tx.product.update({
        where: { id: adjustment.productId },
        data: {
          stock: { increment: adjustment.quantity },
        },
      })

      // Record movement
      await tx.stockMovement.create({
        data: {
          productId: adjustment.productId,
          type: "ADJUSTMENT",
          quantity: adjustment.quantity,
          reason: adjustment.reason,
          notes: adjustment.notes,
        },
      })

      return updatedProduct
    })
  }

  async getInventoryStats() {
    const [totalProducts, lowStockCount, outOfStockCount, totalValue] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({
        where: {
          stock: {
            lte: this.prisma.product.fields.minStock,
          },
        },
      }),
      this.prisma.product.count({
        where: {
          stock: 0,
        },
      }),
      this.prisma.product.aggregate({
        _sum: {
          stock: true,
        },
      }),
    ])

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      totalStock: totalValue._sum.stock || 0,
    }
  }
}
