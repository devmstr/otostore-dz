// app/dashboard/zakat/page.tsx
import { ScrollArea } from '@/components/ui/scroll-area'

import { StatsCards } from './_components/StatsCards'
import ZakatCalculator from './_components/ZakatCalculatorForm'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { DebtDialogsProvider } from './_components/data-table-provider'
import { DebtDialogs } from './_components/data-table-dialogs'

export default async function ZakatPage() {
  // In the future, you’ll hydrate these values:
  // const settings = await container.zakatService.getSettings()
  // const txs = await container.zakatService.listTransactions({ take: 50 })

  return (
    <ScrollArea className="h-full w-full p-4">
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            Zakat (Calculator)
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Overview of zakat-eligible assets and recent transactions.
          </p>
        </header>

        {/* stats cards */}
        <StatsCards />
        {/* zakat table */}
        <DebtDialogsProvider>
          <DataTable columns={columns} />
          <DebtDialogs />
        </DebtDialogsProvider>
      </div>
    </ScrollArea>
  )
}
