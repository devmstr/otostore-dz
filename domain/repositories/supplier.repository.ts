import type { DatabaseService } from "../database/db-service"
import type { CreateSupplierDto } from "../dto/supplier.dto"

export class SupplierRepository {
  constructor(private readonly db: DatabaseService) {}

  async findMany(query?: { search?: string; page?: number; pageSize?: number; city?: string }) {
    const page = query?.page || 1
    const pageSize = query?.pageSize || 25
    const skip = (page - 1) * pageSize

    const where: any = {}

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ]
    }

    if (query?.city) {
      where.city = { in: query.city.split(",") }
    }

    const [data, total] = await Promise.all([
      this.db.supplier.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      this.db.supplier.count({ where }),
    ])

    return { data, total, page, pageSize }
  }

  async findById(id: bigint) {
    return this.db.supplier.findUnique({ where: { id } })
  }

  async create(data: CreateSupplierDto) {
    return this.db.supplier.create({ data })
  }

  async update(id: bigint, data: Partial<CreateSupplierDto>) {
    return this.db.supplier.update({ where: { id }, data })
  }

  async delete(id: bigint) {
    return this.db.supplier.delete({ where: { id } })
  }
}
