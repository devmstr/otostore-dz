import { queryOptions } from "@tanstack/react-query"
import { getDebtsAction } from "../_actions/debts"

export const getAllDebtsQueryOption = (params: URLSearchParams) => {
  const page = Number(params.get("page")) || 1
  const pageSize = Number(params.get("pageSize")) || 25
  const search = params.get("search") || undefined
  const type = params.get("type") || undefined
  const status = params.get("status") || undefined

  return queryOptions({
    queryKey: ["debts", { page, pageSize, search, type, status }],
    queryFn: () =>
      getDebtsAction({
        page,
        pageSize,
        search,
        type,
        status,
      }),
  })
}
