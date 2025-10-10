import type { PrismaClient } from "@prisma/client"
import type { CreateOrderDto } from "../dto/order.dto"

export class OrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(params?: {
    search?: string
    status?: string
    paymentStatus?: string
    customerId?: bigint
    startDate?: Date
    endDate?: Date
    page?: number
    pageSize?: number
  }): Promise<{ data: any[]; total: number }> {
    const { search, status, paymentStatus, customerId, startDate, endDate, page = 1, pageSize = 10 } = params ?? {}
    const skip = (page - 1) * pageSize

    const where = {
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: "insensitive" as const } },
          { customer: { name: { contains: search, mode: "insensitive" as const } } },
        ],
      }),
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
      ...(customerId && { customerId }),
      ...(startDate &&
        endDate && {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }),
    }

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          customer: true,
          user: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ])

    return { data, total }
  }

  async findById(id: bigint) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    })
  }

  async create(order: CreateOrderDto, userId: string) {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Get product prices and calculate totals
    const items = await Promise.all(
      order.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        })
        if (!product) throw new Error(`Product ${item.productId} not found`)
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`)
        }

        const price = Number(product.price)
        const subtotal = price * item.quantity - item.discount
        return {
          productId: item.productId,
          quantity: item.quantity,
          price,
          discount: item.discount,
          subtotal,
        }
      }),
    )

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax

    // Create order with items in a transaction
    return this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: order.customerId,
          userId,
          status: "PENDING",
          paymentMethod: order.paymentMethod,
          paymentStatus: "PENDING",
          subtotal,
          tax,
          discount: 0,
          total,
          notes: order.notes,
          items: {
            create: items,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
        },
      })

      // Update stock levels
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })

        // Record stock movement
        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: "SALE",
            quantity: -item.quantity,
            reference: orderNumber,
            reason: "Order sale",
          },
        })
      }

      // Update customer total spent
      if (order.customerId) {
        await tx.customer.update({
          where: { id: order.customerId },
          data: {
            totalSpent: { increment: total },
            loyaltyPoints: { increment: Math.floor(total / 10) },
          },
        })
      }

      return newOrder
    })
  }

  async updateStatus(id: bigint, status: string, paymentStatus?: string) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status,
        ...(paymentStatus && { paymentStatus }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
      },
    })
  }

  async cancel(id: bigint) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      })

      if (!order) throw new Error("Order not found")
      if (order.status === "COMPLETED") {
        throw new Error("Cannot cancel completed order")
      }

      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })

        await tx.stockMovement.create({
          data: {
            productId: item.productId,
            type: "RETURN",
            quantity: item.quantity,
            reference: order.orderNumber,
            reason: "Order cancelled",
          },
        })
      }

      // Update customer
      if (order.customerId) {
        await tx.customer.update({
          where: { id: order.customerId },
          data: {
            totalSpent: { decrement: Number(order.total) },
          },
        })
      }

      return tx.order.update({
        where: { id },
        data: { status: "CANCELLED" },
      })
    })
  }
}
