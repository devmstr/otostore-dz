import { queryOptions } from "@tanstack/react-query"
import { getInventoryAction } from "../_actions/inventory"

export const getAllInventoryQueryOption = (params: URLSearchParams) => {
  const page = Number(params.get("page")) || 1
  const pageSize = Number(params.get("pageSize")) || 25
  const search = params.get("search") || undefined
  const category = params.get("category") || undefined
  const stockStatus = params.get("stockStatus") || undefined

  return queryOptions({
    queryKey: ["inventory", { page, pageSize, search, category, stockStatus }],
    queryFn: () =>
      getInventoryAction({
        page,
        pageSize,
        search,
        category,
        stockStatus,
      }),
  })
}
