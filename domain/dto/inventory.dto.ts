import { z } from "zod"

export const StockMovementSchema = z.object({
  id: z.bigint().optional(),
  productId: z.bigint(),
  type: z.enum(["PURCHASE", "SALE", "ADJUSTMENT", "RETURN", "DAMAGE", "TRANSFER"]),
  quantity: z.number().int(),
  reason: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
})

export const CreateStockMovementSchema = z.object({
  productId: z.bigint(),
  type: z.enum(["PURCHASE", "SALE", "ADJUSTMENT", "RETURN", "DAMAGE", "TRANSFER"]),
  quantity: z.number().int(),
  reason: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
})

export const StockAdjustmentSchema = z.object({
  productId: z.bigint(),
  quantity: z.number().int(),
  reason: z.string().min(1, "Reason is required"),
  notes: z.string().optional(),
})

export type StockMovementDto = z.infer<typeof StockMovementSchema>
export type CreateStockMovementDto = z.infer<typeof CreateStockMovementSchema>
export type StockAdjustmentDto = z.infer<typeof StockAdjustmentSchema>
