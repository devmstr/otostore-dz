import { queryOptions } from "@tanstack/react-query"
import { getDebtsAction } from "../_actions/debts"
import type { GetDebtsParams } from "../_actions/debts"

export const getDebtsQueryOptions = (params: GetDebtsParams) => {
  return queryOptions({
    queryKey: ["debts", params],
    queryFn: () => getDebtsAction(params),
  })
}

export const useDebtsQuery = (params: GetDebtsParams) => {
  return getDebtsQueryOptions(params)
}
