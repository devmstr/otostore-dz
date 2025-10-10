import type { Metadata } from "next"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { DebtDialogsProvider } from "./_components/data-table-provider"
import { DebtDialogs } from "./_components/data-table-dialogs"

export const metadata: Metadata = {
  title: "Loans & Debts",
  description: "Track loans and debts for customers and suppliers",
}

export default async function DebtsPage() {
  return (
    <DebtDialogsProvider>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loans & Debts</h1>
          <p className="text-muted-foreground mt-1">Track loans and debts for customers and suppliers</p>
        </div>
        <DataTable columns={columns} />
      </div>
      <DebtDialogs />
    </DebtDialogsProvider>
  )
}
