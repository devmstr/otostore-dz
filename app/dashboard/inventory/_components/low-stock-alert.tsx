"use client"

import { useQuery } from "@tanstack/react-query"
import { getLowStockProductsAction } from "../_actions/inventory"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StockAdjustmentDialog } from "./stock-adjustment-dialog"
import { useState } from "react"

export function LowStockAlert() {
  const { data: products, refetch } = useQuery({
    queryKey: ["low-stock-products"],
    queryFn: () => getLowStockProductsAction(),
  })

  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  if (!products || products.length === 0) {
    return (
      <div className="text-muted-foreground rounded-lg border p-8 text-center">
        <p>No low stock alerts. All products are well stocked!</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Min Stock</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product: any) => (
              <TableRow key={product.id.toString()}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell>
                  <span className={product.stock === 0 ? "text-red-500 font-semibold" : ""}>{product.stock}</span>
                </TableCell>
                <TableCell>{product.minStock}</TableCell>
                <TableCell>{product.supplier?.name || "N/A"}</TableCell>
                <TableCell>
                  {product.stock === 0 ? (
                    <Badge className="bg-red-500/10 text-red-500">Out of Stock</Badge>
                  ) : (
                    <Badge className="bg-yellow-500/10 text-yellow-500">Low Stock</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                    <Plus className="h-4 w-4" />
                    Restock
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedProduct && (
        <StockAdjustmentDialog
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          onSuccess={() => {
            refetch()
            setSelectedProduct(null)
          }}
        />
      )}
    </>
  )
}
