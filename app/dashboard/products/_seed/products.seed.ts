import { faker } from '@faker-js/faker'
import { prisma } from '@/domain/database/db-service'
import { categories, availability, priceRanges } from './data.filters'
import { ProductDto } from '@/domain/dto/product.dto'

const createProduct = (): ProductDto => ({
  id: BigInt(`613${faker.number.int({ min: 100000000, max: 999999999 })}`),
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  category: faker.helpers.arrayElement(categories).value,
  availability: faker.helpers.arrayElement(availability).value,
  priceRange: faker.helpers.arrayElement(priceRanges).value,
  price: Number(faker.commerce.price({ min: 5, max: 500 })),
  stock: faker.number.int({ min: 0, max: 200 }),
  imageUrl: faker.image.urlLoremFlickr({ category: 'product' })
})

async function main() {
  console.log('🌱 Starting product seeding...')

  const products = Array.from({ length: 100 }, createProduct)

  try {
    // Optional: clear existing data
    await prisma.product.deleteMany()

    const result = await prisma.product.createMany({
      data: products,
      skipDuplicates: true
    })

    console.log(`✅ Successfully seeded ${result.count} products.`)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
