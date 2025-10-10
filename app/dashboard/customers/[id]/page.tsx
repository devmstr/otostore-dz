import { Suspense } from "react"
import { CustomerDetails } from "../_components/customer-details"

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading customer details...</div>}>
      <CustomerDetails customerId={BigInt(params.id)} />
    </Suspense>
  )
}
