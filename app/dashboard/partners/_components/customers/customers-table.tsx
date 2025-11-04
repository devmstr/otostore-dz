'use client'

import { useQuery } from '@tanstack/react-query'
import { getCustomersAction } from '../../_actions/customers/customers'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Input } from '@/components/ui/input'

export function CustomersTable() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['customers', { page, search }],
    queryFn: () => getCustomersAction({ page, pageSize: 20, search })
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  const customers = data?.data ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Loyalty Points</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer: any) => (
              <TableRow key={customer.id.toString()}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email || '—'}</TableCell>
                <TableCell>{customer.phone || '—'}</TableCell>
                <TableCell>{customer._count.orders}</TableCell>
                <TableCell className="font-semibold">
                  ${Number(customer.totalSpent).toFixed(2)}
                </TableCell>
                <TableCell>{customer.loyaltyPoints}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/customers/${customer.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
