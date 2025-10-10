"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPOSOrder, getCustomers } from "../_actions/pos"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import type { CartItem } from "./pos-interface"

export function Checkout({
  items,
  total,
  onSuccess,
  onCancel,
}: {
  items: CartItem[]
  total: number
  onSuccess: () => void
  onCancel: () => void
}) {
  const [customerId, setCustomerId] = useState<string>("walk-in-customer")
  const [customers, setCustomers] = useState<Array<{ id: string; name: string }>>([])
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "MOBILE">("CASH")
  const [amountPaid, setAmountPaid] = useState(total.toString())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCustomers().then((result) => {
      if (result.success && result.data) {
        setCustomers(result.data as Array<{ id: string; name: string }>)
      }
    })
  }, [])

  const handleSubmit = async () => {
    const paid = Number.parseFloat(amountPaid)
    if (isNaN(paid) || paid < 0) {
      toast.error("Invalid amount paid")
      return
    }

    setLoading(true)
    const result = await createPOSOrder({
      customerId: customerId || undefined,
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      paymentMethod,
      amountPaid: paid,
    })

    setLoading(false)

    if (result.success) {
      toast.success("Order created successfully!")
      onSuccess()
    } else {
      toast.error(result.error || "Failed to create order")
    }
  }

  const change = Number.parseFloat(amountPaid) - total

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Checkout</h3>

      <div className="space-y-4">
        <div>
          <Label>Customer (Optional)</Label>
          <Select value={customerId} onValueChange={setCustomerId}>
            <SelectTrigger>
              <SelectValue placeholder="Walk-in customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="walk-in-customer">Walk-in customer</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Payment Method</Label>
          <Select
            value={paymentMethod}
            onValueChange={(value) => setPaymentMethod(value as "CASH" | "CARD" | "MOBILE")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
              <SelectItem value="MOBILE">Mobile Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Amount Paid</Label>
          <Input type="number" step="0.01" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} />
        </div>

        <div className="space-y-2 rounded-lg bg-muted p-4">
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount Paid:</span>
            <span className="font-bold">${Number.parseFloat(amountPaid).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span>Change:</span>
            <span className={`font-bold ${change < 0 ? "text-destructive" : "text-green-600"}`}>
              ${change.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || change < 0} className="flex-1">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Sale
          </Button>
        </div>
      </div>
    </Card>
  )
}
