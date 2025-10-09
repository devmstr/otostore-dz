// app/actions/product-actions.ts
'use server'

import { container } from '@/domain/di/container'

export async function getProductsAction(params: {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  availability?: string
  priceRange?: 'budget' | 'standard' | 'premium'
}) {
  return container.productService.getProducts(params)
}
