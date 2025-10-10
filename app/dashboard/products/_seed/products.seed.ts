import { faker } from "@faker-js/faker"
import { prisma } from "@/domain/database/db-service"
import { categories, availability, priceRanges } from "./data.filters"

const createProduct = () => {
  const cost = faker.number.float({ min: 5, max: 300, fractionDigits: 2 })
  const price = faker.number.float({ min: cost * 1.2, max: cost * 2.5, fractionDigits: 2 })

  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    sku: faker.string.alphanumeric(8).toUpperCase(),
    barcode: faker.string.numeric(13),
    category: faker.helpers.arrayElement(categories).value,
    availability: faker.helpers.arrayElement(availability).value,
    priceRange: faker.helpers.arrayElement(priceRanges).value,
    price: price,
    cost: cost,
    stock: faker.number.int({ min: 0, max: 200 }),
    minStock: faker.number.int({ min: 5, max: 20 }),
    maxStock: faker.number.int({ min: 100, max: 500 }),
    imageUrl: faker.image.urlLoremFlickr({ category: "product" }),
  }
}

async function main() {
  console.log("🌱 Starting product seeding...")

  const products = Array.from({ length: 100 }, createProduct)

  try {
    // Optional: clear existing data
    await prisma.product.deleteMany()

    const result = await prisma.product.createMany({
      data: products,
      skipDuplicates: true,
    })

    console.log(`✅ Successfully seeded ${result.count} products.`)
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
