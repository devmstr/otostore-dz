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
}

const createProduct = (): ProductSeed => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  category: faker.helpers.arrayElement(categories).value,
  availability: faker.helpers.arrayElement(availability).value,
  priceRange: faker.helpers.arrayElement(priceRanges).value,
  price: Number(faker.commerce.price({ min: 5, max: 500 })),
  stock: faker.number.int({ min: 0, max: 200 }),
  imageUrl: faker.image.urlLoremFlickr({ category: "product" }),
})

async function main() {
  console.log("🌱 Starting database seeding...")

  // Clear existing data
  console.log("🗑️  Clearing existing products...")
  await prisma.product.deleteMany()

  // Create products
  console.log("📦 Creating products...")
  const products = Array.from({ length: 100 }, createProduct)

  const result = await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  })

  console.log(`✅ Successfully seeded ${result.count} products.`)
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
