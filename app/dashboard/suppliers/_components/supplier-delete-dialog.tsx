"use client"

import { useSupplierDialogs } from "./data-table-provider"
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
import { deleteSupplierAction } from "../_actions/suppliers"
import { toast } from "sonner"
import { LoaderCircle } from "lucide-react"

export function SupplierDeleteDialog() {
  const { open, setOpen, currentRow } = useSupplierDialogs()
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!currentRow?.id) return

    startTransition(async () => {
      try {
        await deleteSupplierAction(String(currentRow.id))
        toast.success("Supplier deleted successfully")
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
