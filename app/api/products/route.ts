// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { container } from '@/domain/di/container'

type PriceRange = 'budget' | 'standard' | 'premium'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const params = {
    page: Number(searchParams.get('page')) || 1,
    pageSize: Number(searchParams.get('pageSize')) || 25,
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    availability: searchParams.get('availability') || undefined,
    priceRange: (searchParams.get('price') as PriceRange) || undefined
  }

  const products = await container.productService.getProducts(params)
  return NextResponse.json(products)
}
