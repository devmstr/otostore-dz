import {
  AVAILABILITY_STATUS,
  CATEGORIES,
  PRICE_RANGES
} from '@/lib/constants/product'
import { z } from 'zod'

export const PriceRangeEnum = z.enum(PRICE_RANGES)
export const CategoryEnum = z.enum(CATEGORIES)
export const AvailabilityEnum = z.enum(AVAILABILITY_STATUS)

export const ProductSchema = z.object({
  id: z.bigint(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().nullable(),
  price: z.number().nonnegative().nullable(), // ← allow null
  category: CategoryEnum.default('all').nullable(),
  availability: AvailabilityEnum.default('in-stock').nullable(),
  priceRange: PriceRangeEnum.default('budget').nullable(),
  stock: z.number().int().nonnegative().nullable(),
  imageUrl: z.string().nullable(),
  supplierId: z.bigint().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type ProductDto = z.infer<typeof ProductSchema>

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export type CreateProductDto = z.infer<typeof CreateProductSchema>

export const UpdateProductSchema = ProductSchema.partial().required({
  id: true
})

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>

export type PriceRange = z.infer<typeof PriceRangeEnum>
