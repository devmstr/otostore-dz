"use server"

import { container } from "@/domain/di/container"
import { requireAuth, createAuditLog } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getOrdersAction(params: {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  paymentStatus?: string
  customerId?: bigint
  startDate?: Date
  endDate?: Date
}) {
  await requireAuth()
  return container.orderService.getOrders(params)
}

export async function getOrderAction(id: bigint) {
  await requireAuth()
  return container.orderService.getOrder(id)
}

export async function createOrderAction(data: {
  customerId?: bigint
  paymentMethod?: string
  notes?: string
  items: Array<{
    productId: bigint
    quantity: number
    discount?: number
  }>
}) {
  const user = await requireAuth()

  const order = await container.orderService.createOrder(data, user.id)

  await createAuditLog("CREATE_ORDER", "Order", order.id.toString(), {
    orderNumber: order.orderNumber,
    total: order.total,
  })

  revalidatePath("/dashboard/orders")
  return order
}

export async function updateOrderStatusAction(
  id: bigint,
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "REFUNDED",
  paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED",
) {
  await requireAuth()

  const order = await container.orderService.updateOrderStatus(id, status, paymentStatus)

  await createAuditLog("UPDATE_ORDER_STATUS", "Order", id.toString(), {
    status,
    paymentStatus,
  })

  revalidatePath("/dashboard/orders")
  return order
}

export async function cancelOrderAction(id: bigint) {
  await requireAuth()

  const order = await container.orderService.cancelOrder(id)

  await createAuditLog("CANCEL_ORDER", "Order", id.toString())

  revalidatePath("/dashboard/orders")
  return order
}
