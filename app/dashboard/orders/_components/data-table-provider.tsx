"use client"
import React, { useState } from "react"
import useDialogState from "@/hooks/use-dialog-state"
import type { OrderDto } from "@/domain/dto/order.dto"

type OrderDialogType = "view" | "cancel" | "refund"

type OrderDialogsContextType = {
  open: OrderDialogType | null
  setOpen: (str: OrderDialogType | null) => void
  currentRow: OrderDto | null
  setCurrentRow: React.Dispatch<React.SetStateAction<OrderDto | null>>
}

const OrderDialogsContext = React.createContext<OrderDialogsContextType | null>(null)

export function OrderDialogsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<OrderDialogType>(null)
  const [currentRow, setCurrentRow] = useState<OrderDto | null>(null)

  return <OrderDialogsContext value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</OrderDialogsContext>
}

export const useOrderDialogs = () => {
  const orderDialogsContext = React.useContext(OrderDialogsContext)

  if (!orderDialogsContext) {
    throw new Error("useOrderDialogs has to be used within <OrderDialogsProvider>")
  }

  return orderDialogsContext
}
