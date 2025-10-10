'use client'

import { useState, useEffect, startTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, Plus } from 'lucide-react'
import { searchProducts } from '../_actions/pos'
import { useDebounce } from '@/hooks/use-debounce'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Product = {
  id: bigint
  name: string
  price: number
  stock: number
  sku?: string
}

export function ProductSearch({
  onAddToCart
}: {
  onAddToCart: (product: Product) => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const params = new URLSearchParams()
  const [query, setQuery] = useState(params.get('search') || '')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    setLoading(true)
    searchProducts(debouncedQuery)
      .then((result) => {
        if (result.success && result.data) {
          setProducts(result.data as Product[])
        }
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true)
      params.set('search', debouncedQuery)
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
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
        {loading && (
          <p className="text-center text-sm text-muted-foreground">
            Searching...
          </p>
        )}

        {!loading && products.length === 0 && query && (
          <p className="text-center text-sm text-muted-foreground">
            No products found
          </p>
        )}

        {!loading && products.length === 0 && !query && (
          <p className="text-center text-sm text-muted-foreground">
            Start typing to search for products
          </p>
        )}

        <div className="grid grid-cols-1 gap-2 text-left sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 pt-6">
          {products.map((product) => (
            <Button
              key={product.id.toString()}
              variant={'outline'}
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="group h-48 flex flex-col gap-2"
            >
              <h3 className="font-medium">{product.name}</h3>
              {product.sku && (
                <span className="text-muted-foreground">
                  SKU: {product.sku}
                </span>
              )}

              <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
              <span>Stock: {product.stock}</span>
              <Plus className="scale-0 group-hover:scale-110 mr-1 h-5 w-5 transition-transform" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
