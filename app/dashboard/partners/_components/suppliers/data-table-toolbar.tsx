'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { cities } from '../../_seed/suppliers/data.filters'
import { useSupplierDialogs } from './data-table-provider'
import { Plus } from 'lucide-react'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const { setOpen } = useSupplierDialogs()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search suppliers..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('city') && (
          <DataTableFacetedFilter
            column={table.getColumn('city')}
            title="City"
            options={cities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" className="h-8" onClick={() => setOpen('create')}>
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
