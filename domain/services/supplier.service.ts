import type { SupplierRepository } from "../repositories/supplier.repository"
import { type CreateSupplierDto, CreateSupplierSchema, SupplierSchema } from "../dto/supplier.dto"

export class SupplierService {
  constructor(private readonly repository: SupplierRepository) {}

  async getSuppliers(query?: { search?: string; page?: number; pageSize?: number; city?: string }) {
    return this.repository.findMany(query)
  }

  async getSupplier(id: bigint) {
    const supplier = await this.repository.findById(id)
    if (!supplier) throw new Error("Supplier not found")
    return supplier
  }

  async createSupplier(input: CreateSupplierDto) {
    const validated = CreateSupplierSchema.parse(input)
    return this.repository.create(validated)
  }

  async updateSupplier(id: bigint, input: Partial<CreateSupplierDto>) {
    const validated = SupplierSchema.partial().parse(input)
    return this.repository.update(id, validated)
  }

  async deleteSupplier(id: bigint) {
    await this.repository.delete(id)
    return { message: "Supplier deleted successfully" }
  }
}
