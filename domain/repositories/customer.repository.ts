import type { PrismaClient } from "@prisma/client"
import type { CustomerDto, CreateCustomerDto } from "../dto/customer.dto"

export class CustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(params?: {
    search?: string
    page?: number
    pageSize?: number
  }): Promise<{ data: any[]; total: number }> {
    const { search, page = 1, pageSize = 20 } = params ?? {}
    const skip = (page - 1) * pageSize

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    }

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { orders: true },
          },
        },
      }),
      this.prisma.customer.count({ where }),
    ])

    return { data, total }
  }

  async findById(id: bigint) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        _count: {
          select: { orders: true },
        },
      },
    })
  }

  async create(customer: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: customer,
    })
  }

  async update(id: bigint, customer: Partial<CustomerDto>) {
    return this.prisma.customer.update({
      where: { id },
      data: customer,
    })
  }

  async delete(id: bigint) {
    await this.prisma.customer.delete({ where: { id } })
  }

  async getTopCustomers(limit = 10) {
    return this.prisma.customer.findMany({
      orderBy: { totalSpent: "desc" },
      take: limit,
      include: {
        _count: {
          select: { orders: true },
        },
      },
    })
  }
}
