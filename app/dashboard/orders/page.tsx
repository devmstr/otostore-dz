import { Suspense } from 'react'
import { OrdersTable } from './_components/orders-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage customer orders and track sales
          </p>
        </div>
        <Link href="/dashboard/orders/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </Link>
      </div>

      <OrdersTable />
    </div>
  )
}
