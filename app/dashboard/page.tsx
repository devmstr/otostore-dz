import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Main } from "@/components/main"
import { DashboardStats } from "./_components/dashboard-stats"
import { RevenueChart } from "./_components/revenue-chart"
import { RecentOrders } from "./_components/recent-orders"
import { TopProducts } from "./_components/top-products"
import { Suspense } from "react"

export default function Dashboard() {
  return (
    <Main>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <Tabs orientation="vertical" defaultValue="overview" className="space-y-4">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<div>Loading stats...</div>}>
            <DashboardStats />
          </Suspense>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading chart...</div>}>
                  <RevenueChart />
                </Suspense>
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading orders...</div>}>
                  <RecentOrders />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products by quantity sold</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading products...</div>}>
                <TopProducts />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  )
}
