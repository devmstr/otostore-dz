"use client"

import { useDebtDialogs } from "./data-table-provider"
import { DebtMutateDrawer } from "./debt-mutate-drawer"
import { DebtDeleteDialog } from "./debt-delete-dialog"
import { PaymentDialog } from "./payment-dialog"

export function DebtDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDebtDialogs()

  return (
    <>
      <DebtMutateDrawer
        open={open === "create"}
        onOpenChange={(isOpen) => {
          setOpen(isOpen ? "create" : null)
          if (!isOpen) setCurrentRow(null)
        }}
        debt={currentRow}
      />
      <PaymentDialog
        open={open === "payment"}
        onOpenChange={(isOpen) => {
          setOpen(isOpen ? "payment" : null)
          if (!isOpen) setCurrentRow(null)
        }}
        debt={currentRow}
      />
      <DebtDeleteDialog
        open={open === "delete"}
        onOpenChange={(isOpen) => {
          setOpen(isOpen ? "delete" : null)
          if (!isOpen) setCurrentRow(null)
        }}
        debt={currentRow}
      />
    </>
  )
}
