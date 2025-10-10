import { z } from "zod"

export const productSchema = z.object({
  id: z.bigint(),
  name: z.string(),
  description: z.string().nullable(),
  sku: z.string().nullable(),
  barcode: z.string().nullable(),
  category: z.string().nullable(),
  price: z.number(),
  cost: z.number().nullable(),
  stock: z.number(),
  lowStockThreshold: z.number().nullable(),
  imageUrl: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Product = z.infer<typeof productSchema>
