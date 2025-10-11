import { PrismaClient } from '@prisma/client'
import { ProductDto } from '../dto/product.dto'

export class ProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(params?: {
    search?: string
    category?: string
    availability?: string
    priceRange?: string
    page?: number
    pageSize?: number
  }): Promise<{ data: ProductDto[]; total: number }> {
    const {
      search,
      category,
      availability,
      priceRange,
      page = 1,
      pageSize = 10
    } = params ?? {}
    const skip = (page - 1) * pageSize

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } }
        ]
      }),
      ...(category && { category }),
      ...(availability && { availability }),
      ...(priceRange && { priceRange })
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.product.count({ where })
    ])

    return { data, total }
  }

  async findById(id: bigint): Promise<ProductDto | null> {
    return this.prisma.product.findUnique({ where: { id } })
  }

  async create(product: ProductDto): Promise<ProductDto> {
    return this.prisma.product.create({ data: product })
  }

  async update(id: bigint, product: Partial<ProductDto>): Promise<ProductDto> {
    return this.prisma.product.update({ where: { id }, data: product })
  }

  async delete(id: bigint): Promise<void> {
    await this.prisma.product.delete({ where: { id } })
  }
}
