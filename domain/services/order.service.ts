import type { OrderRepository } from "../repositories/order.repository"
import { type CreateOrderDto, CreateOrderSchema } from "../dto/order.dto"

export class OrderService {
  constructor(private readonly repository: OrderRepository) {}

  async getOrders(query?: {
    search?: string
    status?: string
    paymentStatus?: string
    customerId?: bigint
    startDate?: Date
    endDate?: Date
    page?: number
    pageSize?: number
  }) {
    return this.repository.findMany(query)
  }

  async getOrder(id: bigint) {
    const order = await this.repository.findById(id)
    if (!order) throw new Error("Order not found")
    return order
  }

  async createOrder(input: CreateOrderDto, userId: string) {
    const validated = CreateOrderSchema.parse(input)
    return this.repository.create(validated, userId)
  }

  async updateOrderStatus(
    id: bigint,
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED",
    paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED",
  ) {
    return this.repository.updateStatus(id, status, paymentStatus)
  }

  async cancelOrder(id: bigint) {
    return this.repository.cancel(id)
  }
}
