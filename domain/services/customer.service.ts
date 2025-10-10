import type { CustomerRepository } from "../repositories/customer.repository"
import { type CreateCustomerDto, CreateCustomerSchema, CustomerSchema } from "../dto/customer.dto"

export class CustomerService {
  constructor(private readonly repository: CustomerRepository) {}

  async getCustomers(query?: { search?: string; page?: number; pageSize?: number }) {
    return this.repository.findMany(query)
  }

  async getCustomer(id: bigint) {
    const customer = await this.repository.findById(id)
    if (!customer) throw new Error("Customer not found")
    return customer
  }

  async createCustomer(input: CreateCustomerDto) {
    const validated = CreateCustomerSchema.parse(input)
    return this.repository.create(validated)
  }

  async updateCustomer(id: bigint, input: Partial<CreateCustomerDto>) {
    const validated = CustomerSchema.partial().parse(input)
    return this.repository.update(id, validated)
  }

  async deleteCustomer(id: bigint) {
    await this.repository.delete(id)
    return { message: "Customer deleted successfully" }
  }

  async getTopCustomers(limit?: number) {
    return this.repository.getTopCustomers(limit)
  }
}
