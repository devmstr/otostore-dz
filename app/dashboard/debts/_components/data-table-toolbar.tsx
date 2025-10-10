"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { debtTypes, debtStatuses } from "../_seed/data.filters"
import { useDebtDialogs } from "./data-table-provider"
import { PlusIcon } from "lucide-react"
import type { DebtDto } from "@/domain/dto/debt.dto"

interface DataTableToolbarProps {
  table: Table<DebtDto>
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0
  const { setOpen } = useDebtDialogs()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search by entity name..."
          value={(table.getColumn("entityName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("entityName")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter column={table.getColumn("type")} title="Type" options={debtTypes} />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={debtStatuses} />
        )}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button size="sm" onClick={() => setOpen("create")} className="h-8">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Debt/Loan
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
