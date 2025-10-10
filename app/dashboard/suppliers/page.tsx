import type { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { SupplierDialogsProvider } from "./_components/data-table-provider"
import { SupplierDialogs } from "./_components/data-table-dialogs"

export const metadata: Metadata = {
  title: "Suppliers",
  description: "Manage suppliers and vendor relationships",
}

export default async function SuppliersPage() {
  return (
    <SupplierDialogsProvider>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
          <p className="text-muted-foreground mt-1">Manage suppliers and vendor relationships</p>
        </div>
        <DataTable columns={columns} />
      </div>
      <SupplierDialogs />
    </SupplierDialogsProvider>
  )
}
