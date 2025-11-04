'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { stockStatus, categories } from '../_seed/data.filters'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { DynamicIcon } from '@/lib/icons'
import { ImageWithFallback } from '@/lib/image-with-fullback'
import type { ProductDto } from '@/domain/dto/product.dto'

export const columns: ColumnDef<ProductDto>[] = [
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
    accessorKey: 'sku',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue('sku')}</div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'imageUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => (
      <ImageWithFallback
        src={row.getValue('imageUrl') || '/placeholder.svg'}
        alt={row.original.name ?? 'Product Image'}
        className="h-10 w-10 rounded-md object-cover"
        width={80}
        height={80}
      />
    ),
    enableSorting: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[300px] truncate font-medium">
        {row.getValue('name')}
      </span>
    )
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = categories.find(
        (c) => c.value === row.getValue('category')
      )
      if (!category) return null

      return (
        <div className="flex items-center gap-2">
          {category.icon && (
            <DynamicIcon
              name={category.icon}
              className="text-muted-foreground size-4"
            />
          )}
          <span>{category.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Current Stock" />
    ),
    cell: ({ row }) => {
      const stock = row.getValue<number>('stock')
      const minStock = row.original.minStock || 10

      let status = 'in_stock'
      if (stock === 0) status = 'out_of_stock'
      else if (stock <= minStock) status = 'low_stock'

      const statusConfig = stockStatus.find((s) => s.value === status)

      return (
        <div className="flex items-center gap-2">
          {statusConfig?.icon && (
            <DynamicIcon
              name={statusConfig.icon}
              className={`size-4 ${
                status === 'out_of_stock'
                  ? 'text-red-600'
                  : status === 'low_stock'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}
            />
          )}
          <span className="font-medium">{stock}</span>
        </div>
      )
    }
  },
  {
    accessorKey: 'minStock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Min Stock" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue('minStock') || 10}
      </span>
    )
  },
  {
    accessorKey: 'maxStock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Max Stock" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue('maxStock') || 100}
      </span>
    )
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
]
