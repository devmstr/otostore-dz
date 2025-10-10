"use client"

import { useQuery } from "@tanstack/react-query"
import { getTopProducts } from "../_actions/analytics"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function TopProducts() {
  const { data: products } = useQuery({
    queryKey: ["top-products"],
    queryFn: () => getTopProducts(10),
  })

  if (!products) return null

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="text-right">Total Sold</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product: any) => (
          <TableRow key={product.id.toString()}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{product.category}</Badge>
            </TableCell>
            <TableCell>${Number(product.price).toFixed(2)}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell className="text-right font-semibold">{product.totalSold}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
