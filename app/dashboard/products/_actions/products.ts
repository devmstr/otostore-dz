'use server'

import { container } from '@/domain/di/container'
import { requireAuth, createAuditLog } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  AVAILABILITY_LABELS,
  CATEGORIES,
  PRICE_RANGES
} from '@/lib/constants/product'
import { CreateProductSchema } from '@/domain/dto/product.dto'

const getProductsSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  availability: z.string().optional(),
  price: z.string().optional()
})

const UpdateProductSchema = CreateProductSchema.partial()

export async function getProductsAction(
  params: z.infer<typeof getProductsSchema>
) {
  await requireAuth()
  const validated = getProductsSchema.parse(params)
  return container.productService.getProducts({
    ...validated,
    priceRange: validated.price // convert the param name to
  })
}

export async function getProductAction(id: string) {
  await requireAuth()
  return container.productService.getProduct(BigInt(id))
}

export async function createProductAction(
  data: z.infer<typeof UpdateProductSchema>
) {
  const user = await requireAuth()
  const validated = CreateProductSchema.parse(data)

  const product = await container.productService.createProduct(validated)

  await createAuditLog('CREATE_PRODUCT', 'Product', product.id.toString(), {
    name: product.name
  })

  revalidatePath('/dashboard/products')
  return product
}

export async function updateProductAction(
  id: string,
  data: z.infer<typeof UpdateProductSchema>
) {
  await requireAuth()
  const validated = UpdateProductSchema.parse(data)

  const product = await container.productService.updateProduct(
    BigInt(id),
    validated
  )

  await createAuditLog('UPDATE_PRODUCT', 'Product', id)

  revalidatePath('/dashboard/products')
  return product
}

export async function deleteProductAction(id: string) {
  await requireAuth()

  await container.productService.deleteProduct(BigInt(id))

  await createAuditLog('DELETE_PRODUCT', 'Product', id)

  revalidatePath('/dashboard/products')
}

export async function bulkDeleteProductsAction(ids: string[]) {
  await requireAuth()

  const bigIntIds = ids.map((id) => BigInt(id))
  await Promise.all(
    bigIntIds.map((id) => container.productService.deleteProduct(id))
  )

  await createAuditLog('BULK_DELETE_PRODUCTS', 'Product', ids.join(','))

  revalidatePath('/dashboard/products')
}
