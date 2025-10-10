import type { DebtRepository } from "../repositories/debt.repository"
import {
  type CreateDebtDto,
  CreateDebtSchema,
  type CreateDebtPaymentDto,
  CreateDebtPaymentSchema,
} from "../dto/debt.dto"

export class DebtService {
  constructor(private readonly repository: DebtRepository) {}

  async getDebts(query?: { search?: string; page?: number; pageSize?: number; type?: string; status?: string }) {
    return this.repository.findMany(query)
  }

  async getDebt(id: bigint) {
    const debt = await this.repository.findById(id)
    if (!debt) throw new Error("Debt not found")
    return debt
  }

  async createDebt(input: CreateDebtDto) {
    const validated = CreateDebtSchema.parse(input)
    return this.repository.create(validated)
  }

  async updateDebt(id: bigint, input: Partial<CreateDebtDto>) {
    return this.repository.update(id, input)
  }

  async deleteDebt(id: bigint) {
    await this.repository.delete(id)
    return { message: "Debt deleted successfully" }
  }

  async addPayment(input: CreateDebtPaymentDto) {
    const validated = CreateDebtPaymentSchema.parse(input)
    return this.repository.addPayment(validated)
  }

  async getOverdueDebts() {
    return this.repository.getOverdueDebts()
  }
}
