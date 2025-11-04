// domain/dto/zakat.dto.ts
import { z } from 'zod'

export const ZakatSettingsSchema = z.object({
  enabled: z.boolean(),
  rateBps: z.number().int().nonnegative(),
  nisabCents: z
    .number()
    .int()
    .nonnegative()
    .min(1000_000_00, {
      message: 'Nisab Should be more then 1000_000_00 (100 Million)'
    })
    .max(2000_000_00, {
      message: 'Nisab Should be less then 2000_000_00 (200 Millions)'
    }),
  rounding: z.enum(['up', 'down', 'nearest']),
  currency: z.string().min(1)
})

export const ZakatComputeSchema = z.object({
  baseAmountCents: z.number().int().nonnegative()
})

export const ZakatRecordInputSchema = ZakatComputeSchema.extend({
  userId: z.string().optional(),
  orderId: z
    .bigint()
    .optional()
    .transform((v) => (v === undefined ? undefined : Number(v))),
  note: z.string().optional()
})

// types
export type ZakatSettings = z.infer<typeof ZakatSettingsSchema>
export type ZakatComputeInput = z.infer<typeof ZakatComputeSchema>
export type ZakatRecordInput = z.infer<typeof ZakatRecordInputSchema>
