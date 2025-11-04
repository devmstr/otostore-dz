import { z } from 'zod'

export const DebtPaymentSchema = z.object({
  id: z.bigint().optional(),
  debtId: z.bigint(),
  amount: z.number().positive(),
  method: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional()
})

export const DebtSchema = z.object({
  id: z.bigint().optional(),
  type: z.enum(['CUSTOMER_DEBT', 'SUPPLIER_LOAN']),
  customerId: z.bigint().nullable().optional(),
  supplierId: z.bigint().nullable().optional(),
  orderId: z.bigint().nullable().optional(),
  amount: z.number().positive(),
  paid: z.number().nonnegative().default(0),
  remaining: z.number().nonnegative(),
  status: z.enum(['PENDING', 'PARTIAL', 'PAID', 'OVERDUE']),
  dueDate: z.date().nullable().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export const CreateDebtSchema = z.object({
  type: z.enum(['CUSTOMER_DEBT', 'SUPPLIER_LOAN']),
  customerId: z.bigint().nullable().optional(),
  supplierId: z.bigint().nullable().optional(),
  orderId: z.bigint().nullable().optional(),
  amount: z.number().positive(),
  dueDate: z.date().nullable().optional(),
  description: z.string().optional(),
  notes: z.string().optional()
})

export const CreateDebtPaymentSchema = z.object({
  debtId: z.bigint(),
  amount: z.number().positive(),
  method: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional()
})

export type DebtDto = z.infer<typeof DebtSchema>
export type DebtPaymentDto = z.infer<typeof DebtPaymentSchema>
export type CreateDebtDto = z.infer<typeof CreateDebtSchema>
export type CreateDebtPaymentDto = z.infer<typeof CreateDebtPaymentSchema>
