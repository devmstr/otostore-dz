"use client"

import { useSupplierDialogs } from "./data-table-provider"
import { SupplierMutateDrawer } from "./supplier-mutate-drawer"
import { SupplierDeleteDialog } from "./supplier-delete-dialog"

export function SupplierDialogs() {
  const { open } = useSupplierDialogs()

  return (
    <>
      {(open === "create" || open === "update") && <SupplierMutateDrawer />}
      {open === "delete" && <SupplierDeleteDialog />}
    </>
  )
}
