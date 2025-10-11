"use server"

import { container } from "@/domain/di/container"
import { revalidatePath } from "next/cache"

export async function searchProducts(query: string) {
  try {
    const productService = container.productService
    const result = await productService.getAll({
      page: 1,
      limit: 20,
      search: query,
    })
    return { success: true, data: result.data }
  } catch (error) {
    return { success: false, error: "Failed to search products" }
  }
}

export async function getCustomers() {
  try {
    const customerService = container.customerService
    const result = await customerService.getAll({
      page: 1,
      limit: 100,
    })
    return { success: true, data: result.data }
  } catch (error) {
    return { success: false, error: "Failed to fetch customers" }
  }
}

export async function createPOSOrder(data: {
  customerId?: string
  items: Array<{ productId: string; quantity: number; price: number }>
  paymentMethod: "CASH" | "CARD" | "MOBILE"
  amountPaid: number
}) {
  try {
    const orderService = container.orderService

    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await orderService.create({
      customerId: data.customerId,
      items: data.items,
      total,
      paymentMethod: data.paymentMethod,
      amountPaid: data.amountPaid,
      status: "COMPLETED",
      paymentStatus: data.amountPaid >= total ? "PAID" : "PARTIAL",
    })

    revalidatePath("/dashboard/pos")
    revalidatePath("/dashboard/orders")

    return { success: true, data: order }
  } catch (error) {
    console.error("[v0] POS order creation error:", error)
    return { success: false, error: "Failed to create order" }
  }
}
