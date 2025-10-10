"use client"

import { useOrderDialogs } from "./data-table-provider"
import { OrderDetailsDialog } from "./order-details-dialog"

export function OrderDialogs() {
  const { open } = useOrderDialogs()

  return <>{open === "view" && <OrderDetailsDialog />}</>
}
