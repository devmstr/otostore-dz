import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.bigint(),
  name: z.string().min(1, 'Product name is required').nullable(), // ← allow null
  description: z.string().nullable(),
  price: z.number().nonnegative().nullable(), // ← allow null
  category: z.string().nullable(),
  availability: z.string().nullable(),
  priceRange: z.string().nullable(),
  stock: z.number().int().nonnegative().nullable(),
  imageUrl: z.string().nullable(),
  createdAt: z.date().nullable()
})

export type ProductDto = z.infer<typeof ProductSchema>
