import { z } from "zod"

export const CustomerSchema = z.object({
  id: z.bigint().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  loyaltyPoints: z.number().int().nonnegative().default(0),
  totalSpent: z.number().nonnegative().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  loyaltyPoints: true,
  totalSpent: true,
  createdAt: true,
  updatedAt: true,
})

export type CustomerDto = z.infer<typeof CustomerSchema>
export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>
