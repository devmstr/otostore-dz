"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import type { SupplierDto } from "@/domain/dto/supplier.dto"
import { format } from "date-fns"

export const columns: ColumnDef<SupplierDto>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="font-mono text-sm">#{String(row.getValue("id"))}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="max-w-[200px] truncate font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <span className="max-w-[200px] truncate text-muted-foreground">{row.getValue("email") || "—"}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("phone") || "—"}</span>,
  },
  {
    accessorKey: "city",
    header: ({ column }) => <DataTableColumnHeader column={column} title="City" />,
    cell: ({ row }) => <span>{row.getValue("city") || "—"}</span>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => (
      <span className="max-w-[300px] truncate text-sm text-muted-foreground">{row.getValue("description") || "—"}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Added" />,
    cell: ({ row }) => {
      const date = row.getValue<Date>("createdAt")
      return <span className="text-sm text-muted-foreground">{date ? format(new Date(date), "PP") : "—"}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
