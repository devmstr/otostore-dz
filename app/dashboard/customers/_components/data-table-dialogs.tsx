"use client"

import { useCustomerDialogs } from "./data-table-provider"
import { CustomerMutateDrawer } from "./customer-mutate-drawer"
import { CustomerDeleteDialog } from "./customer-delete-dialog"

export function CustomerDialogs() {
  const { open } = useCustomerDialogs()

  return (
    <>
      {(open === "create" || open === "update") && <CustomerMutateDrawer />}
      {open === "delete" && <CustomerDeleteDialog />}
    </>
  )
}
