import type { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { CustomerDialogsProvider } from "./_components/data-table-provider"
import { CustomerDialogs } from "./_components/data-table-dialogs"

export const metadata: Metadata = {
  title: "Customers",
  description: "Manage customer profiles and loyalty",
}

export default async function CustomersPage() {
  return (
    <CustomerDialogsProvider>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage customer profiles and loyalty</p>
        </div>
        <DataTable columns={columns} />
      </div>
      <CustomerDialogs />
    </CustomerDialogsProvider>
  )
}
