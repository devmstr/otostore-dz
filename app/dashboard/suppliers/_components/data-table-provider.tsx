"use client"
import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import type { SupplierDto } from "@/domain/dto/supplier.dto"

type SupplierDialogType = "create" | "update" | "delete"

type SupplierDialogsContextType = {
  open: SupplierDialogType | null
  setOpen: (str: SupplierDialogType | null) => void
  currentRow: SupplierDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<SupplierDto | null>>
}

const SupplierDialogsContext = React.createContext<SupplierDialogsContextType | null>(null)

export function SupplierDialogsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SupplierDialogType>(null)
  const [currentRow, setCurrentRow] = useState<SupplierDto | null>(null)

  return (
    <SupplierDialogsContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</SupplierDialogsContext>
  )
}

export const useSupplierDialogs = () => {
  const supplierDialogsContext = React.useContext(SupplierDialogsContext)

  if (!supplierDialogsContext) {
    throw new Error("useSupplierDialogs has to be used within <SupplierDialogsProvider>")
  }

  return supplierDialogsContext
}
