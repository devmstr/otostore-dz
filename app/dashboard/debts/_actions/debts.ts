"use server"

import { container } from "@/domain/di/container"
import { requireAuth, createAuditLog } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const getDebtsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  type: z.enum(["CUSTOMER", "SUPPLIER"]).optional(),
  status: z.enum(["PENDING", "PARTIAL", "PAID", "OVERDUE"]).optional(),
})

const createDebtSchema = z.object({
  type: z.enum(["CUSTOMER", "SUPPLIER"]),
  customerId: z.bigint().optional(),
  supplierId: z.bigint().optional(),
  amount: z.number().positive("Amount must be positive"),
  description: z.string().optional(),
  dueDate: z.date().optional(),
})

const recordPaymentSchema = z.object({
  debtId: z.bigint(),
  amount: z.number().positive("Amount must be positive"),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
})

export type GetDebtsParams = z.infer<typeof getDebtsSchema>

export async function getDebtsAction(params: GetDebtsParams) {
  await requireAuth()
  const validated = getDebtsSchema.parse(params)
  return container.debtService.getDebts(validated)
}

export async function getDebtAction(id: string) {
  await requireAuth()
  return container.debtService.getDebt(BigInt(id))
}

export async function createDebtAction(data: z.infer<typeof createDebtSchema>) {
  await requireAuth()
  const validated = createDebtSchema.parse(data)

  const debt = await container.debtService.createDebt(validated)

  await createAuditLog("CREATE_DEBT", "Debt", debt.id.toString(), {
    type: debt.type,
    amount: debt.amount,
  })

  revalidatePath("/dashboard/debts")
  return debt
}

export async function updateDebtAction(id: string, data: Partial<z.infer<typeof createDebtSchema>>) {
  await requireAuth()

  const debt = await container.debtService.updateDebt(BigInt(id), data)

  await createAuditLog("UPDATE_DEBT", "Debt", id)

  revalidatePath("/dashboard/debts")
  return debt
}

export async function deleteDebtAction(id: string) {
  await requireAuth()

  await container.debtService.deleteDebt(BigInt(id))

  await createAuditLog("DELETE_DEBT", "Debt", id)

  revalidatePath("/dashboard/debts")
}

export async function recordPaymentAction(data: z.infer<typeof recordPaymentSchema>) {
  await requireAuth()
  const validated = recordPaymentSchema.parse(data)

  const payment = await container.debtService.addPayment(validated)

  await createAuditLog("RECORD_PAYMENT", "DebtPayment", payment.id.toString(), {
    debtId: validated.debtId.toString(),
    amount: validated.amount,
  })

  revalidatePath("/dashboard/debts")
  return payment
}

export async function getOverdueDebtsAction() {
  await requireAuth()
  return container.debtService.getOverdueDebts()
}
