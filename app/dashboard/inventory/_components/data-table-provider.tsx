"use client"
import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import type { ProductDto } from "@/domain/dto/product.dto"

type InventoryDialogType = "adjust" | "history"

type InventoryDialogsContextType = {
  open: InventoryDialogType | null
  setOpen: (str: InventoryDialogType | null) => void
  currentRow: ProductDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ProductDto | null>>
}

const InventoryDialogsContext = React.createContext<InventoryDialogsContextType | null>(null)

export function InventoryDialogsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<InventoryDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ProductDto | null>(null)

  return (
    <InventoryDialogsContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</InventoryDialogsContext>
  )
}

export const useInventoryDialogs = () => {
  const inventoryDialogsContext = React.useContext(InventoryDialogsContext)

  if (!inventoryDialogsContext) {
    throw new Error("useInventoryDialogs has to be used within <InventoryDialogsProvider>")
  }

  return inventoryDialogsContext
}
