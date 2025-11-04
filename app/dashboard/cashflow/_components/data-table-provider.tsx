"use client"
import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import type { DebtDto } from "@/domain/dto/debt.dto"

type DebtDialogType = "create" | "payment" | "delete"

type DebtDialogsContextType = {
  open: DebtDialogType | null
  setOpen: (str: DebtDialogType | null) => void
  currentRow: DebtDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<DebtDto | null>>
}

const DebtDialogsContext = React.createContext<DebtDialogsContextType | null>(null)

export function DebtDialogsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<DebtDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DebtDto | null>(null)

  return <DebtDialogsContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</DebtDialogsContext>
}

export const useDebtDialogs = () => {
  const debtDialogsContext = React.useContext(DebtDialogsContext)

  if (!debtDialogsContext) {
    throw new Error("useDebtDialogs has to be used within <DebtDialogsProvider>")
  }

  return debtDialogsContext
}
