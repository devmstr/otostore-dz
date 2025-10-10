import { z } from 'zod'
import { PRICE_RANGES } from '@/lib/constants/product'

export const PriceRangeEnum = z.enum(PRICE_RANGES)

export const ProductSchema = z.object({
  id: z.bigint(),
  name: z.string().min(1, 'Product name is required'),
  description: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  price: z.number().nonnegative('Price must be non-negative'),
  cost: z
    .number()
    .nonnegative('Cost must be non-negative')
    .nullable()
    .optional(),
  category: z.string().min(1, 'Category is required').default('').optional(),
  availability: z.string().default('in_stock').optional(),
  priceRange: PriceRangeEnum.default('budget').nullable().optional(),
  stock: z
    .number()
    .int()
    .nonnegative('Stock must be non-negative')
    .default(0)
    .optional(),
  minStock: z
    .number()
    .int()
    .nonnegative('Min stock must be non-negative')
    .default(10)
    .optional(),
  maxStock: z
    .number()
    .int()
    .nonnegative('Max stock must be non-negative')
    .default(1000)
    .nullable()
    .optional(),
  imageUrl: z.string().nullable().optional(),
  supplierId: z.bigint().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
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
