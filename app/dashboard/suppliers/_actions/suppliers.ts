"use server"

import { container } from "@/domain/di/container"
import { revalidatePath } from "next/cache"

export async function getSuppliersAction(params: {
  page?: number
  pageSize?: number
  search?: string
  city?: string
}) {
  return container.supplierService.getSuppliers(params)
}

export async function getSupplierAction(id: string) {
  return container.supplierService.getSupplier(BigInt(id))
}

export async function createSupplierAction(data: any) {
  const result = await container.supplierService.createSupplier(data)
  revalidatePath("/dashboard/suppliers")
  return result
}

export async function updateSupplierAction(id: string, data: any) {
  const result = await container.supplierService.updateSupplier(BigInt(id), data)
  revalidatePath("/dashboard/suppliers")
  return result
}

export async function deleteSupplierAction(id: string) {
  const result = await container.supplierService.deleteSupplier(BigInt(id))
  revalidatePath("/dashboard/suppliers")
  return result
}
