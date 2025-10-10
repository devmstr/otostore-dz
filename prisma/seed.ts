import { PrismaClient } from "@prisma/client"
import { faker } from "@faker-js/faker"

const prisma = new PrismaClient()

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "food", label: "Food" },
  { value: "books", label: "Books" },
  { value: "toys", label: "Toys" },
]

const availability = [
  { value: "in_stock", label: "In Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
  { value: "pre_order", label: "Pre-order" },
]

const priceRanges = [
  { value: "budget", label: "Budget" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
]

interface ProductSeed {
  name: string
  description: string
  category: string
  availability: string
  priceRange: string
  price: number
  stock: number
  imageUrl: string
  sku: string
  barcode: string
  cost: number
  minStock: number
  maxStock: number
  supplierId: number
}

async function main() {
  console.log("🌱 Starting database seeding...")

  // Clear existing data
  console.log("🗑️  Clearing existing data...")
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.stockMovement.deleteMany()
  await prisma.product.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.supplier.deleteMany()

  console.log("🏭 Creating suppliers...")
  const suppliers = await prisma.supplier.createMany({
    data: Array.from({ length: 10 }, () => ({
      name: faker.company.name(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      description: faker.company.catchPhrase(),
    })),
  })
  console.log(`✅ Created ${suppliers.count} suppliers`)

  const supplierRecords = await prisma.supplier.findMany()

  // Create products
  console.log("📦 Creating products...")
  const products = Array.from({ length: 100 }, () => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    barcode: faker.string.numeric(13),
    category: faker.helpers.arrayElement(categories).value,
    availability: faker.helpers.arrayElement(availability).value,
    priceRange: faker.helpers.arrayElement(priceRanges).value,
    price: Number(faker.commerce.price({ min: 5, max: 500 })),
    cost: Number(faker.commerce.price({ min: 3, max: 400 })),
    stock: faker.number.int({ min: 0, max: 200 }),
    minStock: faker.number.int({ min: 5, max: 20 }),
    maxStock: faker.number.int({ min: 100, max: 500 }),
    imageUrl: faker.image.urlLoremFlickr({ category: "product" }),
    supplierId: faker.helpers.arrayElement(supplierRecords).id,
  }))

  const productResult = await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  })
  console.log(`✅ Created ${productResult.count} products`)

  console.log("👥 Creating customers...")
  const customers = await prisma.customer.createMany({
    data: Array.from({ length: 50 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      postalCode: faker.location.zipCode(),
      loyaltyPoints: faker.number.int({ min: 0, max: 1000 }),
      totalSpent: Number(faker.commerce.price({ min: 0, max: 5000 })),
    })),
  })
  console.log(`✅ Created ${customers.count} customers`)

  console.log("✅ Database seeding completed successfully!")
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
