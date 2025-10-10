"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"
import { searchProducts } from "../_actions/pos"
import { useDebounce } from "@/hooks/use-debounce"

type Product = {
  id: string
  name: string
  price: number
  stock: number
  sku?: string
}

export function ProductSearch({
  onAddToCart,
}: {
  onAddToCart: (product: Product) => void
}) {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true)
      searchProducts(debouncedQuery)
        .then((result) => {
          if (result.success && result.data) {
            setProducts(result.data as Product[])
          }
        })
        .finally(() => setLoading(false))
    } else {
      setProducts([])
    }
  }, [debouncedQuery])

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products by name or SKU..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {loading && <p className="text-center text-sm text-muted-foreground">Searching...</p>}

        {!loading && products.length === 0 && query && (
          <p className="text-center text-sm text-muted-foreground">No products found</p>
        )}

        {!loading && products.length === 0 && !query && (
          <p className="text-center text-sm text-muted-foreground">Start typing to search for products</p>
        )}

        {products.map((product) => (
          <Card key={product.id} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <h3 className="font-medium">{product.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {product.sku && <span>SKU: {product.sku}</span>}
                <span>Stock: {product.stock}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              <Button size="sm" onClick={() => onAddToCart(product)} disabled={product.stock === 0}>
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
