import { Suspense } from "react"
import { InventoryOverview } from "./_components/inventory-overview"
import { LowStockAlert } from "./_components/low-stock-alert"
import { StockMovementsTable } from "./_components/stock-movements-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground mt-1">Track stock levels and manage inventory</p>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <InventoryOverview />
      </Suspense>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList>
          <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>
        <TabsContent value="alerts" className="mt-6">
          <Suspense fallback={<div>Loading alerts...</div>}>
            <LowStockAlert />
          </Suspense>
        </TabsContent>
        <TabsContent value="movements" className="mt-6">
          <Suspense fallback={<div>Loading movements...</div>}>
            <StockMovementsTable />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
