"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type { Row } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useOrderDialogs } from "./data-table-provider"
import type { OrderDto } from "@/domain/dto/order.dto"
import { useRouter } from "next/navigation"

interface DataTableRowActionsProps {
  row: Row<OrderDto>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useOrderDialogs()
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen("view")
          }}
        >
          View Details
        </DropdownMenuItem>
        {row.original.status === "PENDING" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen("cancel")
              }}
              className="text-red-600"
            >
              Cancel Order
            </DropdownMenuItem>
          </>
        )}
        {row.original.status === "COMPLETED" && row.original.paymentStatus === "PAID" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCurrentRow(row.original)
                setOpen("refund")
              }}
            >
              Process Refund
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
