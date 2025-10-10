"use client"

import { useCustomerDialogs } from "./data-table-provider"
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
import { useTransition } from "react"
import { deleteCustomerAction } from "../_actions/customers"
import { toast } from "sonner"
import { LoaderCircle } from "lucide-react"

export function CustomerDeleteDialog() {
  const { open, setOpen, currentRow } = useCustomerDialogs()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!currentRow?.id) return

    startTransition(async () => {
      try {
        await deleteCustomerAction(String(currentRow.id))
        toast.success("Customer deleted successfully")
        setOpen(null)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An error occurred")
      }
    })
  }

  return (
    <AlertDialog open={open === "delete"} onOpenChange={() => setOpen(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{currentRow?.name}</strong> and all associated data. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700">
            {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
