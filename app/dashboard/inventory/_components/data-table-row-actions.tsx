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
import { useInventoryDialogs } from "./data-table-provider"
import type { ProductDto } from "@/domain/dto/product.dto"

interface DataTableRowActionsProps {
  row: Row<ProductDto>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useInventoryDialogs()

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
            setOpen("adjust")
          }}
        >
          Adjust Stock
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original)
            setOpen("history")
          }}
        >
          View History
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
