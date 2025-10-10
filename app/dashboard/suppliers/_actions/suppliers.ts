"use server"

import { container } from "@/domain/di/container"
import { requireAuth, createAuditLog } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const getSuppliersSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  city: z.string().optional(),
})

const createSupplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  taxId: z.string().optional(),
})

const updateSupplierSchema = createSupplierSchema.partial()

export async function getSuppliersAction(params: z.infer<typeof getSuppliersSchema>) {
  await requireAuth()
  const validated = getSuppliersSchema.parse(params)
  return container.supplierService.getSuppliers(validated)
}

export async function getSupplierAction(id: string) {
  await requireAuth()
  return container.supplierService.getSupplier(BigInt(id))
}

export async function createSupplierAction(data: z.infer<typeof createSupplierSchema>) {
  await requireAuth()
  const validated = createSupplierSchema.parse(data)

  const supplier = await container.supplierService.createSupplier(validated)

  await createAuditLog("CREATE_SUPPLIER", "Supplier", supplier.id.toString(), {
    name: supplier.name,
  })

  revalidatePath("/dashboard/suppliers")
  return supplier
}

export async function updateSupplierAction(id: string, data: z.infer<typeof updateSupplierSchema>) {
  await requireAuth()
  const validated = updateSupplierSchema.parse(data)

  const supplier = await container.supplierService.updateSupplier(BigInt(id), validated)

  await createAuditLog("UPDATE_SUPPLIER", "Supplier", id)

  revalidatePath("/dashboard/suppliers")
  return supplier
}

export async function deleteSupplierAction(id: string) {
  await requireAuth()

  await container.supplierService.deleteSupplier(BigInt(id))

  await createAuditLog("DELETE_SUPPLIER", "Supplier", id)

  revalidatePath("/dashboard/suppliers")
}
