import type { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { OrderDialogsProvider } from "./_components/data-table-provider"
import { OrderDialogs } from "./_components/data-table-dialogs"

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage customer orders and track sales",
}

export default async function OrdersPage() {
  return (
    <OrderDialogsProvider>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage customer orders and track sales</p>
        </div>
        <DataTable columns={columns} />
      </div>
      <OrderDialogs />
    </OrderDialogsProvider>
  )
}
