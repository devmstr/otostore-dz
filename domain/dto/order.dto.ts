import { z } from "zod"

export const OrderItemSchema = z.object({
  id: z.bigint().optional(),
  productId: z.bigint(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  subtotal: z.number().nonnegative(),
})

export const OrderSchema = z.object({
  id: z.bigint().optional(),
  orderNumber: z.string(),
  customerId: z.bigint().nullable().optional(),
  userId: z.string(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "CANCELLED", "REFUNDED"]),
  paymentMethod: z.string().nullable().optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
  notes: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const CreateOrderSchema = z.object({
  customerId: z.bigint().nullable().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.bigint(),
        quantity: z.number().int().positive(),
        discount: z.number().nonnegative().default(0),
      }),
    )
    .min(1, "Order must have at least one item"),
})

export type OrderDto = z.infer<typeof OrderSchema>
export type OrderItemDto = z.infer<typeof OrderItemSchema>
export type CreateOrderDto = z.infer<typeof CreateOrderSchema>
