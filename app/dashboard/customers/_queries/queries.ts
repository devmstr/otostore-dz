import { queryOptions } from "@tanstack/react-query"
import { getCustomersAction } from "../_actions/customers"

export const getAllCustomersQueryOption = (params: URLSearchParams) => {
  const page = Number(params.get("page")) || 1
  const pageSize = Number(params.get("pageSize")) || 25
  const search = params.get("search") || undefined
  const city = params.get("city") || undefined
  const tier = params.get("tier") || undefined

  return queryOptions({
    queryKey: ["customers", { page, pageSize, search, city, tier }],
    queryFn: () =>
      getCustomersAction({
        page,
        pageSize,
        search,
        city,
        tier,
      }),
  })
}
