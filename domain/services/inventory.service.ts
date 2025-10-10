import type { InventoryRepository } from "../repositories/inventory.repository"
import { type StockAdjustmentDto, StockAdjustmentSchema } from "../dto/inventory.dto"

export class InventoryService {
  constructor(private readonly repository: InventoryRepository) {}

  async getLowStockProducts() {
    return this.repository.getLowStockProducts()
  }

  async getStockMovements(query?: {
    productId?: bigint
    type?: string
    startDate?: Date
    endDate?: Date
    page?: number
    pageSize?: number
  }) {
    return this.repository.getStockMovements(query)
  }

  async adjustStock(input: StockAdjustmentDto) {
    const validated = StockAdjustmentSchema.parse(input)
    return this.repository.adjustStock(validated)
  }

  async getInventoryStats() {
    return this.repository.getInventoryStats()
  }
}
