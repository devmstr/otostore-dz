"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { adjustStockAction } from "../_actions/inventory"
import { toast } from "sonner"

interface StockAdjustmentDialogProps {
  product: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function StockAdjustmentDialog({ product, open, onOpenChange, onSuccess }: StockAdjustmentDialogProps) {
  const [quantity, setQuantity] = useState(0)
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await adjustStockAction({
        productId: product.id,
        quantity,
        reason,
        notes,
      })
      toast.success("Stock adjusted successfully")
      onSuccess()
    } catch (error) {
      toast.error("Failed to adjust stock")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock: {product.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Current Stock</Label>
            <Input value={product.stock} disabled />
          </div>
          <div>
            <Label>Quantity Change</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
              placeholder="Enter positive or negative number"
              required
            />
            <p className="text-muted-foreground mt-1 text-sm">New stock will be: {product.stock + quantity}</p>
          </div>
          <div>
            <Label>Reason</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Restock from supplier"
              required
            />
          </div>
          <div>
            <Label>Notes (Optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adjusting..." : "Adjust Stock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
