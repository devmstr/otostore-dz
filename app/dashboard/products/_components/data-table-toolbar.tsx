'use client'

import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { debounce } from 'lodash'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { useProductDialogs } from './data-table-provider'

import { categories, availability, priceRanges } from '../_seed/data.filters'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table
}: DataTableToolbarProps<TData>) {
  const { setOpen } = useProductDialogs()

  // --- State
  const [searchValue, setSearchValue] = React.useState(
    (table.getColumn('name')?.getFilterValue() as string) ?? ''
  )

  const isFiltered = table.getState().columnFilters.length > 0

  // --- Debounce logic (fires only after user stops typing)
  const debouncedSetFilter = React.useMemo(
    () =>
      debounce((val: string) => {
        table.getColumn('name')?.setFilterValue(val || undefined)
      }, 500),
    [table]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    debouncedSetFilter(value)
  }

  // Clean up debounce on unmount
  React.useEffect(() => {
    return () => {
      debouncedSetFilter.cancel()
    }
  }, [debouncedSetFilter])

  // --- UI
  return (
    <div className="flex flex-wrap space-y-2 items-center justify-between">
      {/* Left Section: Filters */}
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search products..."
          value={searchValue}
          onChange={handleSearchChange}
          className="h-8 w-[150px] lg:w-[250px]"
          aria-label="Search products"
        />

        {table.getColumn('category') && (
          <DataTableFacetedFilter
            column={table.getColumn('category')}
            title="Category"
            options={categories}
          />
        )}

        {table.getColumn('availability') && (
          <DataTableFacetedFilter
            column={table.getColumn('availability')}
            title="Stock"
            options={availability}
          />
        )}

        {table.getColumn('priceRange') && (
          <DataTableFacetedFilter
            column={table.getColumn('priceRange')}
            title="Type"
            options={priceRanges}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              table.resetColumnFilters()
              setSearchValue('')
            }}
            className="gap-1"
          >
            Reset
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Right Section: View options and actions */}
      <div className="flex flex-wrap items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button variant="outline" onClick={() => setOpen('import')} size="sm">
          Import
        </Button>
        <Button onClick={() => setOpen('create')} size="sm">
          Add Product
        </Button>
      </div>
    </div>
  )
}
