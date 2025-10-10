"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteDebtAction } from "../_actions/debts"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import type { DebtDto } from "@/domain/dto/debt.dto"

interface DebtDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  debt: DebtDto | null
}

export function DebtDeleteDialog({ open, onOpenChange, debt }: DebtDeleteDialogProps) {
  const queryClient = useQueryClient()

  async function handleDelete() {
    if (!debt) return

    try {
      await deleteDebtAction(debt.id)
      toast.success("Debt/Loan deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["debts"] })
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to delete debt/loan")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this debt/loan record. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
