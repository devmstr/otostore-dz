"use client"

import { useInventoryDialogs } from "./data-table-provider"
import { StockAdjustmentDialog } from "./stock-adjustment-dialog"
import { StockHistoryDialog } from "./stock-history-dialog"

export function InventoryDialogs() {
  const { open } = useInventoryDialogs()

  return (
    <>
      {open === "adjust" && <StockAdjustmentDialog />}
      {open === "history" && <StockHistoryDialog />}
    </>
  )
}
