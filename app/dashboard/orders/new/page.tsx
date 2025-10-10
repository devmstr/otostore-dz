import { NewOrderForm } from "../_components/new-order-form"

export default function NewOrderPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Order</h1>
        <p className="text-muted-foreground mt-1">Add products and complete the sale</p>
      </div>
      <NewOrderForm />
    </div>
  )
}
