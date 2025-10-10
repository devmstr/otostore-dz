import { z } from "zod"

export const PriceRangeEnum = z.enum(["budget", "standard", "premium"])

export const ProductSchema = z.object({
  id: z.bigint(),
  name: z.string().min(1, "Product name is required"),
  description: z.string().nullable(),
  sku: z.string().nullable(),
  barcode: z.string().nullable(),
  price: z.number().nonnegative("Price must be non-negative"),
  cost: z.number().nonnegative("Cost must be non-negative").nullable(),
  category: z.string().min(1, "Category is required"),
  availability: z.string().default("in_stock"),
  priceRange: PriceRangeEnum.nullable(),
  stock: z.number().int().nonnegative("Stock must be non-negative").default(0),
  minStock: z.number().int().nonnegative("Min stock must be non-negative").default(10),
  maxStock: z.number().int().nonnegative("Max stock must be non-negative").nullable(),
  imageUrl: z.string().nullable(),
  supplierId: z.bigint().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ProductDto = z.infer<typeof ProductSchema>

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type CreateProductDto = z.infer<typeof CreateProductSchema>

export const UpdateProductSchema = ProductSchema.partial().required({ id: true })

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>

export type PriceRange = z.infer<typeof PriceRangeEnum>
