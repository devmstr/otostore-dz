"use client"

import * as React from "react"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable, type VisibilityState } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { LoaderCircle } from "lucide-react"
import { useTableUrlParamsState } from "@/hooks/use-table-url-params-state"
import { useQuery } from "@tanstack/react-query"
import { getAllCustomersQueryOption } from "../_queries/queries"
import type { CustomerDto } from "@/domain/dto/customer.dto"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<CustomerDto, any>[]
}

export function DataTable<TData, TValue>({ columns }: DataTableProps<TData, TValue>) {
  const { columnFilters, getSearchParams, pagination, setColumnFilters, setPagination, setSorting, sorting } =
    useTableUrlParamsState({
      defaultPageSize: 10,
      filterableColumns: [
        { id: "city", type: "multi-select" },
        { id: "name", type: "search", paramName: "search" },
      ],
    })

  // Query data from server
  const { data, isLoading, isError, error } = useQuery(getAllCustomersQueryOption(getSearchParams()))
  const customers = data?.data ?? []
  const totalCount = data?.total ?? 0
  const totalPages = typeof data?.total === "number" && data.total > 0 ? Math.ceil(data.total / pagination.pageSize) : 1

  // Table local state
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data: customers,
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: totalPages,
    rowCount: totalCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar table={table} />

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <LoaderCircle className="text-muted-foreground w-5 h-5 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-red-500">
                  Error: {String(error)}
                </TableCell>
              </TableRow>
            ) : customers.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
