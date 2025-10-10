import { queryOptions } from "@tanstack/react-query"
import { getOrdersAction, getOrderAction } from "../_actions/orders"

export const getAllOrdersQueryOption = (params?: {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  paymentStatus?: string
}) =>
  queryOptions({
    queryKey: ["orders", params],
    queryFn: () => getOrdersAction(params || {}),
  })

export const getOrderQueryOption = (id: bigint) =>
  queryOptions({
    queryKey: ["order", id],
    queryFn: () => getOrderAction(id),
  })
