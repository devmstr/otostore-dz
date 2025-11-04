import type { Metadata } from 'next'
import { columns as customersColumns } from './_components/customers/columns'
import { columns as suppliersColumns } from './_components/suppliers/columns'
import { DataTable as CustomersTable } from './_components/customers/data-table'
import { DataTable as SuppliersTable } from './_components/suppliers/data-table'
import { CustomerDialogsProvider } from './_components/customers/data-table-provider'
import { CustomerDialogs } from './_components/customers/data-table-dialogs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SupplierDialogsProvider } from './_components/suppliers/data-table-provider'
import { SupplierDialogs } from './_components/suppliers/data-table-dialogs'
import { DynamicIcon } from '@/lib/icons'

export const metadata: Metadata = {
  title: 'Customers',
  description: 'Manage customer profiles and loyalty'
}

export default async function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
        <p className="text-muted-foreground mt-1">
          Manage customer and supplier profiles and loyalty programs.
        </p>
      </div>

      {/* tabs */}
      <Tabs
        orientation="vertical"
        defaultValue="customers"
        className="space-y-4"
      >
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="customers">
              <DynamicIcon name="User" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="suppliers">
              <DynamicIcon name="Truck" />
              Suppliers
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="customers" className="space-y-4">
          <CustomerDialogsProvider>
            <CustomersTable columns={customersColumns} />
            <CustomerDialogs />
          </CustomerDialogsProvider>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <SupplierDialogsProvider>
            <SuppliersTable columns={suppliersColumns} />
            <SupplierDialogs />
          </SupplierDialogsProvider>
        </TabsContent>
      </Tabs>
    </div>
  )
}
