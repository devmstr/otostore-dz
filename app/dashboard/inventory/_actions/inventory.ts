"use server"

import { container } from "@/domain/di/container"
import { requireAuth, requireRole, createAuditLog } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getInventoryAction(params?: {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  stockStatus?: string
}) {
  await requireAuth()
  return container.productService.getProducts({
    search: params?.search,
    category: params?.category,
    page: params?.page,
    pageSize: params?.pageSize,
  })
}

export async function getLowStockProductsAction() {
  await requireAuth()
  return container.inventoryService.getLowStockProducts()
}

export async function getStockMovementsAction(params?: {
  productId?: bigint
  type?: string
  startDate?: Date
  endDate?: Date
  page?: number
  pageSize?: number
}) {
  await requireAuth()
  return container.inventoryService.getStockMovements(params)
}

export async function adjustStockAction(data: {
  productId: bigint
  quantity: number
  reason: string
  notes?: string
}) {
  await requireRole(["ADMIN", "MANAGER"])

  const product = await container.inventoryService.adjustStock(data)

  await createAuditLog("ADJUST_STOCK", "Product", data.productId.toString(), {
    quantity: data.quantity,
    reason: data.reason,
  })

  revalidatePath("/dashboard/inventory")
  return product
}

export async function getInventoryStatsAction() {
  await requireAuth()
  return container.inventoryService.getInventoryStats()
}
