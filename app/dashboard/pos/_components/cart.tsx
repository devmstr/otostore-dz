'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import type { CartItem } from './pos-interface'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Cart({
  items,
  total,
  onUpdateQuantity,
  onRemove,
  onCheckout
}: {
  items: CartItem[]
  total: number
  onUpdateQuantity: (id: bigint, quantity: number) => void
  onRemove: (id: bigint) => void
  onCheckout: () => void
}) {
  return (
    <Card className="flex flex-col p-6">
      <div className="mb-4 flex items-center gap-2">
        <ShoppingCart className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Cart ({items.length})</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {items.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Cart is empty
          </p>
        )}
        <ScrollArea className="max-h-[calc(100vh-24rem)] w-full  ">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-start gap-4 rounded-lg border p-3 my-2"
            >
              <div className="flex-1 flex justify-between w-full gap-2 items-center ">
                <div className="flex gap-2">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => onRemove(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex w-full items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    onUpdateQuantity(
                      item.id,
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                  className="h-8 w-16 text-center"
                  min="1"
                  max={item.stock}
                />

                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-right flex w-full items-center gap-1">
                <span className="text-muted-foreground">
                  {`${item.quantity} x pieces: `}{' '}
                </span>
                <p className="font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="mt-4 space-y-3 border-t pt-4">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          Checkout
        </Button>
      </div>
    </Card>
  )
}
