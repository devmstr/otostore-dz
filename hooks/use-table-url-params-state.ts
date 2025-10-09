'use client'

import { useCallback, useMemo, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState
} from '@tanstack/react-table'

/**
 * Configuration for filterable columns
 */
export type FilterableColumn = {
  id: string
  type: 'multi-select' | 'search'
  paramName?: string // Optional custom URL parameter name
}

/**
 * Options for the useTableUrlState hook
 */
export interface UseTableUrlParamsStateOptions {
  defaultPageSize?: number
  filterableColumns?: FilterableColumn[]
}

/**
 * Return type for the useTableUrlState hook
 */
export interface TableUrlParamsState {
  // Current state derived from URL
  pagination: PaginationState
  sorting: SortingState
  columnFilters: ColumnFiltersState

  // Handlers to update URL (and thus state)
  setPagination: (
    updater: PaginationState | ((old: PaginationState) => PaginationState)
  ) => void
  setSorting: (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => void
  setColumnFilters: (
    updater:
      | ColumnFiltersState
      | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => void

  // Utility to get current state as URL search params
  getSearchParams: () => URLSearchParams

  // Indicates if URL update is in progress
  isPending: boolean
}

/**
 * A React hook that manages table state (pagination, sorting, filtering)
 * exclusively through URL search parameters.
 *
 * This hook does NOT fetch data - it only manages the synchronization between
 * URL parameters and table state. Data fetching should be handled separately
 * using the returned state values.
 *
 * @example
 * \`\`\`tsx
 * const tableState = useTableUrlState({
 *   defaultPageSize: 25,
 *   filterableColumns: [
 *     { id: 'status', type: 'multi-select' },
 *     { id: 'name', type: 'search' }
 *   ]
 * })
 *
 * // Use tableState.pagination, tableState.sorting, etc. to fetch data
 * const { data, isLoading } = useQuery({
 *   queryKey: ['products', tableState.pagination, tableState.sorting, tableState.columnFilters],
 *   queryFn: () => fetchProducts(tableState.getSearchParams())
 * })
 * \`\`\`
 */
export function useTableUrlParamsState({
  defaultPageSize = 25,
  filterableColumns = []
}: UseTableUrlParamsStateOptions = {}): TableUrlParamsState {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const pagination = useMemo((): PaginationState => {
    const page = searchParams.get('page')
    const pageSize = searchParams.get('pageSize')

    return {
      pageIndex: Math.max(0, Number(page || 1) - 1),
      pageSize: Number(pageSize || defaultPageSize)
    }
  }, [searchParams, defaultPageSize])

  const sorting = useMemo((): SortingState => {
    const sortBy = searchParams.get('sortBy')
    const sortOrder = searchParams.get('sortOrder')

    if (!sortBy) return []

    return [{ id: sortBy, desc: sortOrder === 'desc' }]
  }, [searchParams])

  const columnFilters = useMemo((): ColumnFiltersState => {
    const filters: ColumnFiltersState = []

    filterableColumns.forEach(({ id, type, paramName }) => {
      const paramKey = paramName ?? id
      const value = searchParams.get(paramKey)

      if (!value) return

      if (type === 'multi-select') {
        filters.push({ id, value: value.split(',') })
      } else if (type === 'search') {
        filters.push({ id, value })
      }
    })

    return filters
  }, [searchParams, filterableColumns])

  const buildSearchParams = useCallback(
    (
      paginationState: PaginationState,
      sortingState: SortingState,
      filtersState: ColumnFiltersState
    ): URLSearchParams => {
      const params = new URLSearchParams()

      // Add pagination parameters
      params.set('page', String(paginationState.pageIndex + 1))
      params.set('pageSize', String(paginationState.pageSize))

      // Add filter parameters
      filtersState.forEach((filter) => {
        const config = filterableColumns.find((c) => c.id === filter.id)
        if (!config || !filter.value) return

        const paramKey = config.paramName ?? config.id

        if (
          config.type === 'multi-select' &&
          Array.isArray(filter.value) &&
          filter.value.length > 0
        ) {
          params.set(paramKey, filter.value.join(','))
        }

        if (config.type === 'search' && !Array.isArray(filter.value)) {
          params.set(paramKey, String(filter.value))
        }
      })

      // Add sorting parameters
      if (sortingState.length > 0) {
        params.set('sortBy', sortingState[0].id)
        params.set('sortOrder', sortingState[0].desc ? 'desc' : 'asc')
      }

      return params
    },
    [filterableColumns]
  )

  const updateUrl = useCallback(
    (
      newPagination: PaginationState,
      newSorting: SortingState,
      newFilters: ColumnFiltersState
    ) => {
      const params = buildSearchParams(newPagination, newSorting, newFilters)

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [pathname, router, buildSearchParams]
  )

  const setPagination = useCallback(
    (
      updater: PaginationState | ((old: PaginationState) => PaginationState)
    ) => {
      // Read current state from searchParams at call time
      const currentPagination = {
        pageIndex: Math.max(0, Number(searchParams.get('page') || 1) - 1),
        pageSize: Number(searchParams.get('pageSize') || defaultPageSize)
      }
      const currentSorting = sorting
      const currentFilters = columnFilters

      const newPagination =
        typeof updater === 'function' ? updater(currentPagination) : updater
      updateUrl(newPagination, currentSorting, currentFilters)
    },
    [searchParams, defaultPageSize, sorting, columnFilters, updateUrl]
  )

  const setSorting = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const currentPagination = pagination
      const currentSorting = sorting
      const currentFilters = columnFilters

      const newSorting =
        typeof updater === 'function' ? updater(currentSorting) : updater
      updateUrl(currentPagination, newSorting, currentFilters)
    },
    [pagination, sorting, columnFilters, updateUrl]
  )

  const setColumnFilters = useCallback(
    (
      updater:
        | ColumnFiltersState
        | ((old: ColumnFiltersState) => ColumnFiltersState)
    ) => {
      const currentPagination = pagination
      const currentSorting = sorting
      const currentFilters = columnFilters

      const newFilters =
        typeof updater === 'function' ? updater(currentFilters) : updater
      // Reset to page 1 when filters change
      const resetPagination = { ...currentPagination, pageIndex: 0 }
      updateUrl(resetPagination, currentSorting, newFilters)
    },
    [pagination, sorting, columnFilters, updateUrl]
  )

  const getSearchParams = useCallback(
    () => buildSearchParams(pagination, sorting, columnFilters),
    [pagination, sorting, columnFilters, buildSearchParams]
  )

  return {
    pagination,
    sorting,
    columnFilters,
    setPagination,
    setSorting,
    setColumnFilters,
    getSearchParams,
    isPending
  }
}
