// features/products/queries.ts
import { queryOptions } from '@tanstack/react-query'
import { getProductsAction } from '@/app/dashboard/products/_actions/products'

export const getAllProductQueryOption = (params: URLSearchParams) => {
  const page = Number(params.get('page')) || 1
  const pageSize = Number(params.get('pageSize')) || 25
  const search = params.get('search') || undefined
  const category = params.get('category') || undefined
  const availability = params.get('availability') || undefined
  const price = params.get('price') as
    | 'budget'
    | 'standard'
    | 'premium'
    | undefined

  return queryOptions({
    queryKey: [
      'products',
      { page, pageSize, search, category, availability, price }
    ],
    queryFn: () =>
      getProductsAction({
        page,
        pageSize,
        search,
        category,
        availability,
        priceRange: price
      })
  })
}
