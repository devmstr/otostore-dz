'use client'

import { useInventoryDialogs } from './data-table-provider'
import { StockAdjustmentDialog } from './stock-adjustment-dialog'
import { StockHistoryDialog } from './stock-history-dialog'

export function InventoryDialogs() {
  const { open } = useInventoryDialogs()

  return (
    <>
      {open === 'adjust' && (
        <StockAdjustmentDialog
          product={undefined}
          open={false}
          onOpenChange={function (open: boolean): void {
            throw new Error('Function not implemented.')
          }}
          onSuccess={function (): void {
            throw new Error('Function not implemented.')
          }}
        />
      )}
      {open === 'history' && <StockHistoryDialog />}
    </>
  )
}
