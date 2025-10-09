# Using Neon Database with Prisma

This guide explains how to use the Neon PostgreSQL database in your Next.js application.

## Prerequisites

1. Neon integration is connected (check in v0 sidebar → Connect)
2. Environment variables are set:
   - `DATABASE_URL` - Pooled connection (for Prisma Client)
   - `DATABASE_URL_UNPOOLED` - Direct connection (for migrations)

## Quick Start

### 1. Push Schema to Database

For development, use `db push` to sync your schema without creating migrations:

\`\`\`bash
pnpm db:push
\`\`\`

This will:
- Create the `products` table in your Neon database
- Generate the Prisma Client types

### 2. Seed the Database

Populate your database with sample data:

\`\`\`bash
pnpm db:seed
\`\`\`

This will create 100 sample products using Faker.js.

### 3. View Your Data

Open Prisma Studio to browse your data:

\`\`\`bash
pnpm db:studio
\`\`\`

Visit http://localhost:5555 to see your products.

## Database Commands

### Development Workflow

\`\`\`bash
# Push schema changes (no migrations)
pnpm db:push

# Generate Prisma Client after schema changes
pnpm db:generate

# Seed database with sample data
pnpm db:seed

# Open Prisma Studio
pnpm db:studio
\`\`\`

### Production Workflow (with migrations)

\`\`\`bash
# Create a new migration
pnpm db:migrate

# Deploy migrations to production
pnpm db:migrate:deploy

# Reset database (⚠️ deletes all data)
pnpm db:reset
\`\`\`

## Using the Database in Your Code

### In Server Components

\`\`\`typescript
import { prisma } from '@/domain/database/db-service'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
\`\`\`

### In Server Actions

\`\`\`typescript
'use server'

import { prisma } from '@/domain/database/db-service'
import { revalidatePath } from 'next/cache'

export async function createProduct(data: { name: string; price: number }) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      category: 'electronics',
      availability: 'in_stock',
      priceRange: 'standard',
      stock: 0,
      imageUrl: '/placeholder.svg'
    }
  })

  revalidatePath('/dashboard/products')
  return product
}
\`\`\`

### In API Routes

\`\`\`typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/domain/database/db-service'

export async function GET() {
  try {
    const products = await prisma.product.findMany()
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
\`\`\`

### Using the Repository Pattern (Recommended)

The project uses a repository pattern for better separation of concerns:

\`\`\`typescript
import { container } from '@/domain/di/container'

// In server components or server actions
const products = await container.productService.getProducts({
  page: 1,
  pageSize: 25,
  search: 'laptop'
})
\`\`\`

## Common Queries

### Find All Products

\`\`\`typescript
const products = await prisma.product.findMany()
\`\`\`

### Find with Filters

\`\`\`typescript
const products = await prisma.product.findMany({
  where: {
    category: 'electronics',
    availability: 'in_stock',
    price: { gte: 100, lte: 500 }
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0
})
\`\`\`

### Find One Product

\`\`\`typescript
const product = await prisma.product.findUnique({
  where: { id: 1n } // Note: BigInt requires 'n' suffix
})
\`\`\`

### Create Product

\`\`\`typescript
const product = await prisma.product.create({
  data: {
    name: 'New Product',
    description: 'Product description',
    price: 99.99,
    category: 'electronics',
    availability: 'in_stock',
    priceRange: 'standard',
    stock: 50,
    imageUrl: '/images/product.jpg'
  }
})
\`\`\`

### Update Product

\`\`\`typescript
const product = await prisma.product.update({
  where: { id: 1n },
  data: { price: 89.99, stock: 45 }
})
\`\`\`

### Delete Product

\`\`\`typescript
await prisma.product.delete({
  where: { id: 1n }
})
\`\`\`

## Troubleshooting

### Connection Issues

If you see connection errors:

1. Check environment variables in v0 sidebar → Vars
2. Verify Neon integration is connected in v0 sidebar → Connect
3. Ensure `DATABASE_URL` is set correctly

### Type Errors

If Prisma types are not recognized:

\`\`\`bash
pnpm db:generate
\`\`\`

### Schema Out of Sync

If your database schema doesn't match your Prisma schema:

\`\`\`bash
pnpm db:push
\`\`\`

## Best Practices

1. **Use the repository pattern** - Access data through services/repositories, not directly
2. **Handle BigInt properly** - Product IDs are BigInt, use `1n` syntax
3. **Use transactions** - For operations that modify multiple records
4. **Add indexes** - For frequently queried fields (already added in schema)
5. **Use connection pooling** - Neon's pooled connection is used by default
6. **Close connections** - Prisma handles this automatically in Next.js

## Next Steps

- Read the [Prisma documentation](https://www.prisma.io/docs)
- Learn about [Neon's features](https://neon.tech/docs)
- Explore the repository pattern in `domain/repositories/`
- Check out the service layer in `domain/services/`
