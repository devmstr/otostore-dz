"use server"

import { container } from "@/domain/di/container"
import { requireAuth, createAuditLog } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const getProductsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  availability: z.string().optional(),
  priceRange: z.enum(["budget", "standard", "premium"]).optional(),
})

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  cost: z.number().positive().optional(),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
  lowStockThreshold: z.number().int().nonnegative().optional(),
  imageUrl: z.string().url().optional(),
})

const updateProductSchema = createProductSchema.partial()

export async function getProductsAction(params: z.infer<typeof getProductsSchema>) {
  await requireAuth()
  const validated = getProductsSchema.parse(params)
  return container.productService.getProducts(validated)
}

export async function getProductAction(id: string) {
  await requireAuth()
  return container.productService.getProduct(BigInt(id))
}

export async function createProductAction(data: z.infer<typeof createProductSchema>) {
  const user = await requireAuth()
  const validated = createProductSchema.parse(data)

  const product = await container.productService.createProduct(validated)

  await createAuditLog("CREATE_PRODUCT", "Product", product.id.toString(), {
    name: product.name,
  })

  revalidatePath("/dashboard/products")
  return product
}

export async function updateProductAction(id: string, data: z.infer<typeof updateProductSchema>) {
  await requireAuth()
  const validated = updateProductSchema.parse(data)

  const product = await container.productService.updateProduct(BigInt(id), validated)

  await createAuditLog("UPDATE_PRODUCT", "Product", id)

  revalidatePath("/dashboard/products")
  return product
}

export async function deleteProductAction(id: string) {
  await requireAuth()

  await container.productService.deleteProduct(BigInt(id))

  await createAuditLog("DELETE_PRODUCT", "Product", id)

  revalidatePath("/dashboard/products")
}

export async function bulkDeleteProductsAction(ids: string[]) {
  await requireAuth()

  const bigIntIds = ids.map((id) => BigInt(id))
  await Promise.all(bigIntIds.map((id) => container.productService.deleteProduct(id)))

  await createAuditLog("BULK_DELETE_PRODUCTS", "Product", ids.join(","))

  revalidatePath("/dashboard/products")
}
