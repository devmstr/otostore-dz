import { queryOptions } from '@tanstack/react-query'
import { getSuppliersAction } from '../../_actions/suppliers/suppliers'

export const getAllSuppliersQueryOption = (params: URLSearchParams) => {
  const page = Number(params.get('page')) || 1
  const pageSize = Number(params.get('pageSize')) || 25
  const search = params.get('search') || undefined
  const city = params.get('city') || undefined

  return queryOptions({
    queryKey: ['suppliers', { page, pageSize, search, city }],
    queryFn: () =>
      getSuppliersAction({
        page,
        pageSize,
        search,
        city
      })
  })
}
