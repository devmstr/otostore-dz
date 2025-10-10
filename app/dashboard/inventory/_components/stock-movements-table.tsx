"use client"

import { useQuery } from "@tanstack/react-query"
import { getStockMovementsAction } from "../_actions/inventory"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const movementTypeColors = {
  PURCHASE: "bg-green-500/10 text-green-500",
  SALE: "bg-blue-500/10 text-blue-500",
  ADJUSTMENT: "bg-purple-500/10 text-purple-500",
  RETURN: "bg-yellow-500/10 text-yellow-500",
  DAMAGE: "bg-red-500/10 text-red-500",
  TRANSFER: "bg-gray-500/10 text-gray-500",
}

export function StockMovementsTable() {
  const { data } = useQuery({
    queryKey: ["stock-movements"],
    queryFn: () => getStockMovementsAction({ pageSize: 50 }),
  })

  const movements = data?.data ?? []

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement: any) => (
            <TableRow key={movement.id.toString()}>
              <TableCell className="font-medium">{movement.product.name}</TableCell>
              <TableCell>
                <Badge className={movementTypeColors[movement.type as keyof typeof movementTypeColors]}>
                  {movement.type}
                </Badge>
              </TableCell>
              <TableCell>
                <span className={movement.quantity > 0 ? "text-green-500" : "text-red-500"}>
                  {movement.quantity > 0 ? "+" : ""}
                  {movement.quantity}
                </span>
              </TableCell>
              <TableCell>{movement.reason || "—"}</TableCell>
              <TableCell className="font-mono text-sm">{movement.reference || "—"}</TableCell>
              <TableCell>{new Date(movement.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
