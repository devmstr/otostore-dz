"use client"

import { useQuery } from "@tanstack/react-query"
import { getRecentOrders } from "../_actions/analytics"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentOrders() {
  const { data: orders } = useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => getRecentOrders(5),
  })

  if (!orders) return null

  return (
    <div className="space-y-4">
      {orders.map((order: any) => (
        <div key={order.id.toString()} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{order.customer?.name?.[0] || "W"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{order.customer?.name || "Walk-in Customer"}</p>
            <p className="text-muted-foreground text-sm">{order.orderNumber}</p>
          </div>
          <div className="font-medium">+${Number(order.total).toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
