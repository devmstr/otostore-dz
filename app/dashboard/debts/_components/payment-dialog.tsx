"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { recordPaymentAction } from "../_actions/debts"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import type { DebtDto } from "@/domain/dto/debt.dto"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  debt: DebtDto | null
}

export function PaymentDialog({ open, onOpenChange, debt }: PaymentDialogProps) {
  const queryClient = useQueryClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!debt) return

    const formData = new FormData(e.currentTarget)
    formData.append("debtId", debt.id)

    try {
      await recordPaymentAction(formData)
      toast.success("Payment recorded successfully")
      queryClient.invalidateQueries({ queryKey: ["debts"] })
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to record payment")
    }
  }

  if (!debt) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment for {debt.entityName}. Remaining amount: ${debt.remainingAmount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                max={debt.remainingAmount}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Record Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
