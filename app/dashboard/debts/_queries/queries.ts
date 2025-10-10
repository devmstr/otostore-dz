import { queryOptions } from '@tanstack/react-query'
import { getDebtsAction } from '../_actions/debts'
import type { GetDebtsParams } from '../_actions/debts'

export const getDebtsQueryOptions = (params: URLSearchParams) => {
  const page = Number(params.get('page')) || 1
  const pageSize = Number(params.get('pageSize')) || 25
  const search = params.get('search') as 'CUSTOMER' | 'SUPPLIER' | undefined
  const status = params.get('status') as
    | 'PENDING'
    | 'PARTIAL'
    | 'PAID'
    | 'OVERDUE'
    | undefined
  const type = params.get('status') as 'CUSTOMER' | 'SUPPLIER' | undefined
  return queryOptions({
    queryKey: ['debts', params],
    queryFn: () =>
      getDebtsAction({
        page,
        pageSize,
        search,
        status,
        type
      })
  })
}
