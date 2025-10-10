"use client"
import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import type { CustomerDto } from "@/domain/dto/customer.dto"

type CustomerDialogType = "create" | "update" | "delete" | "view"

type CustomerDialogsContextType = {
  open: CustomerDialogType | null
  setOpen: (str: CustomerDialogType | null) => void
  currentRow: CustomerDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<CustomerDto | null>>
}

const CustomerDialogsContext = React.createContext<CustomerDialogsContextType | null>(null)

export function CustomerDialogsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<CustomerDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CustomerDto | null>(null)

  return (
    <CustomerDialogsContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</CustomerDialogsContext>
  )
}

export const useCustomerDialogs = () => {
  const customerDialogsContext = React.useContext(CustomerDialogsContext)

  if (!customerDialogsContext) {
    throw new Error("useCustomerDialogs has to be used within <CustomerDialogsProvider>")
  }

  return customerDialogsContext
}
