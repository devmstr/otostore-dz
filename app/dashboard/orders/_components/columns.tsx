'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import type { OrderDto } from '@/domain/dto/order.dto'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { DynamicIcon } from '@/lib/icons'
import { orderStatuses, paymentStatuses } from '../_seed/data.filters'

export const columns: ColumnDef<OrderDto>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
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
    enableHiding: false
  },
  {
    accessorKey: 'orderNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order #" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm font-medium">
        {row.getValue('orderNumber')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'customerId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const customerId = row.getValue<bigint | null>('customerId')
      return (
        <span className="text-muted-foreground">
          {customerId ? `#${String(customerId)}` : 'Walk-in'}
        </span>
      )
    }
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = orderStatuses.find(
        (s) => s.value === row.getValue('status')
      )
      if (!status) return null

      return (
        <div className="flex items-center gap-2">
          {status.icon && (
            <DynamicIcon
              name={status.icon}
              className="text-muted-foreground size-4"
            />
          )}
          <Badge
            variant={
              status.value === 'COMPLETED'
                ? 'default'
                : status.value === 'CANCELLED' || status.value === 'REFUNDED'
                ? 'destructive'
                : 'secondary'
            }
          >
            {status.label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'paymentStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment" />
    ),
    cell: ({ row }) => {
      const paymentStatus = paymentStatuses.find(
        (s) => s.value === row.getValue('paymentStatus')
      )
      if (!paymentStatus) return null

      return (
        <div className="flex items-center gap-2">
          {paymentStatus.icon && (
            <DynamicIcon
              name={paymentStatus.icon}
              className="text-muted-foreground size-4"
            />
          )}
          <Badge
            variant={
              paymentStatus.value === 'PAID'
                ? 'default'
                : paymentStatus.value === 'FAILED' ||
                  paymentStatus.value === 'REFUNDED'
                ? 'destructive'
                : 'secondary'
            }
          >
            {paymentStatus.label}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'paymentMethod',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Method" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue('paymentMethod') || '—'}
      </span>
    )
  },
  {
    accessorKey: 'total',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue<number>('total')
      return <span className="font-medium">${amount.toFixed(2)}</span>
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue<Date>('createdAt')
      return (
        <span className="text-sm text-muted-foreground">
          {date ? format(new Date(date), 'PP p') : '—'}
        </span>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]
