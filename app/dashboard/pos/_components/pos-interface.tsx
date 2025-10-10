"use client"

import { useState } from "react"
import { ProductSearch } from "./product-search"
import { Cart } from "./cart"
import { Checkout } from "./checkout"
import { Card } from "@/components/ui/card"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  stock: number
}

export function POSInterface() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCheckout, setShowCheckout] = useState(false)

  const addToCart = (product: {
    id: string
    name: string
    price: number
    stock: number
  }) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) {
          return prev
        }
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
      return
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
    setShowCheckout(false)
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="grid h-full gap-4 lg:grid-cols-[1fr_400px]">
      <Card className="flex flex-col p-6">
        <h2 className="mb-4 text-2xl font-bold">Point of Sale</h2>
        <ProductSearch onAddToCart={addToCart} />
      </Card>

      <div className="flex flex-col gap-4">
        <Cart
          items={cart}
          total={total}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={() => setShowCheckout(true)}
        />

        {showCheckout && (
          <Checkout items={cart} total={total} onSuccess={clearCart} onCancel={() => setShowCheckout(false)} />
        )}
      </div>
    </div>
  )
}
