"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useOrderDialogs } from "./data-table-provider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function OrderDetailsDialog() {
  const { open, setOpen, currentRow } = useOrderDialogs()

  if (!currentRow) return null

  return (
    <Dialog open={open === "view"} onOpenChange={() => setOpen(null)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details - {currentRow.orderNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge>{currentRow.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Badge>{currentRow.paymentStatus}</Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${currentRow.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${currentRow.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span>-${currentRow.discount.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${currentRow.total.toFixed(2)}</span>
            </div>
          </div>

          {currentRow.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{currentRow.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
