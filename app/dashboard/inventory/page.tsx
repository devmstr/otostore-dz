import type { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { InventoryDialogsProvider } from "./_components/data-table-provider"
import { InventoryDialogs } from "./_components/data-table-dialogs"

export const metadata: Metadata = {
  title: "Inventory Management",
  description: "Track and manage product inventory levels",
}

export default async function InventoryPage() {
  return (
    <InventoryDialogsProvider>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Track stock levels and manage inventory</p>
        </div>
        <DataTable columns={columns} />
      </div>
      <InventoryDialogs />
    </InventoryDialogsProvider>
  )
}
