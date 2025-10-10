"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllOrdersQueryOption } from "../_queries/queries"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { updateOrderStatusAction, cancelOrderAction } from "../_actions/orders"
import { toast } from "sonner"
import { useState } from "react"

const statusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  PROCESSING: "bg-blue-500/10 text-blue-500",
  COMPLETED: "bg-green-500/10 text-green-500",
  CANCELLED: "bg-red-500/10 text-red-500",
  REFUNDED: "bg-purple-500/10 text-purple-500",
}

const paymentStatusColors = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  PAID: "bg-green-500/10 text-green-500",
  FAILED: "bg-red-500/10 text-red-500",
  REFUNDED: "bg-purple-500/10 text-purple-500",
}

export function OrdersTable() {
  const [page, setPage] = useState(1)
  const { data, isLoading, refetch } = useQuery(getAllOrdersQueryOption({ page, pageSize: 20 }))

  const handleComplete = async (id: bigint) => {
    try {
      await updateOrderStatusAction(id, "COMPLETED", "PAID")
      toast.success("Order marked as completed")
      refetch()
    } catch (error) {
      toast.error("Failed to update order")
    }
  }

  const handleCancel = async (id: bigint) => {
    try {
      await cancelOrderAction(id)
      toast.success("Order cancelled successfully")
      refetch()
    } catch (error) {
      toast.error("Failed to cancel order")
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const orders = data?.data ?? []

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order: any) => (
            <TableRow key={order.id.toString()}>
              <TableCell className="font-mono text-sm">{order.orderNumber}</TableCell>
              <TableCell>{order.customer?.name || "Walk-in Customer"}</TableCell>
              <TableCell>{order.items.length} items</TableCell>
              <TableCell className="font-semibold">${Number(order.total).toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={statusColors[order.status as keyof typeof statusColors]}>{order.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}>
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  {order.status === "PENDING" && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => handleComplete(order.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleCancel(order.id)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
