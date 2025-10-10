import { z } from "zod"

export const SupplierSchema = z.object({
  id: z.bigint().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const CreateSupplierSchema = SupplierSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type SupplierDto = z.infer<typeof SupplierSchema>
export type CreateSupplierDto = z.infer<typeof CreateSupplierSchema>
