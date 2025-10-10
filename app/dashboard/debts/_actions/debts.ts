"use server"

import { container } from "@/domain/di/container"
import { revalidatePath } from "next/cache"

export async function getDebtsAction(params: {
  page?: number
  pageSize?: number
  search?: string
  type?: string
  status?: string
}) {
  return container.debtService.getDebts(params)
}

export async function getDebtAction(id: string) {
  return container.debtService.getDebt(BigInt(id))
}

export async function createDebtAction(data: any) {
  const result = await container.debtService.createDebt(data)
  revalidatePath("/dashboard/debts")
  return result
}

export async function updateDebtAction(id: string, data: any) {
  const result = await container.debtService.updateDebt(BigInt(id), data)
  revalidatePath("/dashboard/debts")
  return result
}

export async function deleteDebtAction(id: string) {
  const result = await container.debtService.deleteDebt(BigInt(id))
  revalidatePath("/dashboard/debts")
  return result
}

export async function addPaymentAction(data: any) {
  const result = await container.debtService.addPayment(data)
  revalidatePath("/dashboard/debts")
  return result
}

export async function getOverdueDebtsAction() {
  return container.debtService.getOverdueDebts()
}
