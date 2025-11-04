"use server"

import { container } from "@/domain/di/container"
import { requireAuth, createAuditLog } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getCustomersAction(params?: { search?: string; page?: number; pageSize?: number }) {
  await requireAuth()
  return container.customerService.getCustomers(params)
}

export async function getCustomerAction(id: bigint) {
  await requireAuth()
  return container.customerService.getCustomer(id)
}

export async function createCustomerAction(data: {
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
}) {
  await requireAuth()

  const customer = await container.customerService.createCustomer(data)

  await createAuditLog("CREATE_CUSTOMER", "Customer", customer.id.toString(), {
    name: customer.name,
  })

  revalidatePath("/dashboard/customers")
  return customer
}

export async function updateCustomerAction(
  id: bigint,
  data: {
    name?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    postalCode?: string
  },
) {
  await requireAuth()

  const customer = await container.customerService.updateCustomer(id, data)

  await createAuditLog("UPDATE_CUSTOMER", "Customer", id.toString())

  revalidatePath("/dashboard/customers")
  revalidatePath(`/dashboard/customers/${id}`)
  return customer
}

export async function deleteCustomerAction(id: bigint) {
  await requireAuth()

  await container.customerService.deleteCustomer(id)

  await createAuditLog("DELETE_CUSTOMER", "Customer", id.toString())

  revalidatePath("/dashboard/customers")
}

export async function getTopCustomersAction(limit?: number) {
  await requireAuth()
  return container.customerService.getTopCustomers(limit)
}
