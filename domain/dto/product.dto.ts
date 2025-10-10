import { z } from 'zod'

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
  category: z.string().default('all').nullable().optional(),
  availability: z.string().default('in-stock').nullable().optional(),
  priceRange: z.string().nullable().optional(),
  stock: z
    .number()
    .int()
    .nonnegative('Stock must be non-negative')
    .default(0)
    .nullable()
    .optional(),
  minStock: z
    .number()
    .int()
    .nonnegative('Min stock must be non-negative')
    .default(10)
    .nullable()
    .optional(),
  maxStock: z
    .number()
    .int()
    .nonnegative('Max stock must be non-negative')
    .nullable()
    .optional(),
  imageUrl: z.string().nullable().optional(),
  supplierId: z.bigint().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional()
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

