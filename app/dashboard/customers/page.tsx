import { Suspense } from "react"
import { CustomersTable } from "./_components/customers-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateCustomerDialog } from "./_components/create-customer-dialog"

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage customer profiles and loyalty</p>
        </div>
        <CreateCustomerDialog>
          <Button>
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </CreateCustomerDialog>
      </div>

      <Suspense fallback={<div>Loading customers...</div>}>
        <CustomersTable />
      </Suspense>
    </div>
  )
}
