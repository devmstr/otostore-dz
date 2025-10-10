"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import type { DebtDto } from "@/domain/dto/debt.dto"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { DynamicIcon } from "@/lib/lucide-icons.resolver"
import { debtTypes, debtStatuses } from "../_seed/data.filters"

export const columns: ColumnDef<DebtDto>[] = [
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
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => {
      const type = debtTypes.find((t) => t.value === row.getValue("type"))
      if (!type) return null

      return (
        <div className="flex items-center gap-2">
          {type.icon && <DynamicIcon name={type.icon} className="text-muted-foreground size-4" />}
          <Badge variant={type.value === "CUSTOMER_DEBT" ? "default" : "secondary"}>{type.label}</Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => <span className="max-w-[200px] truncate">{row.getValue("description") || "—"}</span>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      const amount = row.getValue<number>("amount")
      return <span className="font-medium">${amount.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "paid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Paid" />,
    cell: ({ row }) => {
      const paid = row.getValue<number>("paid")
      return <span className="text-green-600 font-medium">${paid.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "remaining",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Remaining" />,
    cell: ({ row }) => {
      const remaining = row.getValue<number>("remaining")
      return <span className="text-red-600 font-medium">${remaining.toFixed(2)}</span>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = debtStatuses.find((s) => s.value === row.getValue("status"))
      if (!status) return null

      return (
        <div className="flex items-center gap-2">
          {status.icon && <DynamicIcon name={status.icon} className="text-muted-foreground size-4" />}
          <Badge
            variant={status.value === "PAID" ? "default" : status.value === "OVERDUE" ? "destructive" : "secondary"}
          >
            {status.label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
    cell: ({ row }) => {
      const date = row.getValue<Date | null>("dueDate")
      return <span className="text-sm text-muted-foreground">{date ? format(new Date(date), "PP") : "—"}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
