"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useInventoryDialogs } from "./data-table-provider"
import { useQuery } from "@tanstack/react-query"
import { getStockMovementsAction } from "../_actions/inventory"
import { LoaderCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export function StockHistoryDialog() {
  const { open, setOpen, currentRow } = useInventoryDialogs()

  const { data, isLoading } = useQuery({
    queryKey: ["stock-movements", currentRow?.id],
    queryFn: () => getStockMovementsAction({ productId: currentRow?.id || "" }),
    enabled: !!currentRow?.id,
  })

  return (
    <Dialog open={open === "history"} onOpenChange={() => setOpen(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Stock Movement History - {currentRow?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="space-y-2">
              {data.data.map((movement: any) => (
                <div key={movement.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          movement.type === "IN" ? "default" : movement.type === "OUT" ? "destructive" : "secondary"
                        }
                      >
                        {movement.type}
                      </Badge>
                      <span className="font-medium">
                        {movement.quantity > 0 ? "+" : ""}
                        {movement.quantity}
                      </span>
                    </div>
                    {movement.reason && <p className="text-sm text-muted-foreground mt-1">{movement.reason}</p>}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {format(new Date(movement.createdAt), "PPp")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No stock movements found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
