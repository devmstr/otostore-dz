import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import {
  AVAILABILITY_STATUS,
  CATEGORIES,
  PRICE_RANGES
} from '@/lib/constants/product'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data in correct order (respecting foreign keys)
  console.log('🗑️  Clearing existing data...')
  await prisma.debtPayment.deleteMany()
  await prisma.debt.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.stockMovement.deleteMany()
  await prisma.product.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('👤 Creating users...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'user_admin_001',
        email: 'admin@store.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      }
    }),
    prisma.user.create({
      data: {
        id: 'user_manager_001',
        email: 'manager@store.com',
        firstName: 'Manager',
        lastName: 'User',
        role: 'MANAGER'
      }
    }),
    prisma.user.create({
      data: {
        id: 'user_cashier_001',
        email: 'cashier@store.com',
        firstName: 'Cashier',
        lastName: 'User',
        role: 'CASHIER'
      }
    })
  ])
  console.log(`✅ Created ${users.length} users`)

  // Create suppliers
  console.log('🏭 Creating suppliers...')
  const supplierData = Array.from({ length: 15 }, () => ({
    name: faker.company.name(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    postalCode: faker.location.zipCode(),
    description: faker.company.catchPhrase()
  }))

  const suppliers = await Promise.all(
    supplierData.map((data) => prisma.supplier.create({ data }))
  )
  console.log(`✅ Created ${suppliers.length} suppliers`)

  // Create products
  console.log('📦 Creating products...')
  const productData = Array.from({ length: 150 }, () => {
    const cost = faker.number.float({ min: 3, max: 400, fractionDigits: 2 })
    const price = faker.number.float({
      min: cost * 1.2,
      max: cost * 2.5,
      fractionDigits: 2
    })
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      barcode: faker.string.numeric(13),
      category: faker.helpers.arrayElement(CATEGORIES),
      availability: faker.helpers.arrayElement(AVAILABILITY_STATUS),
      priceRange: faker.helpers.arrayElement(PRICE_RANGES),
      price: price,
      cost: cost,
      stock: faker.number.int({ min: 0, max: 200 }),
      minStock: faker.number.int({ min: 5, max: 20 }),
      maxStock: faker.number.int({ min: 100, max: 500 }),
      imageUrl: faker.image.urlLoremFlickr({ category: 'product' }),
      supplierId: faker.helpers.arrayElement(suppliers).id
    }
  })

  const products = await Promise.all(
    productData.map((data) => prisma.product.create({ data }))
  )
  console.log(`✅ Created ${products.length} products`)

  // Create customers
  console.log('👥 Creating customers...')
  const customerData = Array.from({ length: 80 }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    postalCode: faker.location.zipCode(),
    loyaltyPoints: faker.number.int({ min: 0, max: 1000 }),
    totalSpent: faker.number.float({ min: 0, max: 5000, fractionDigits: 2 })
  }))

  const customers = await Promise.all(
    customerData.map((data) => prisma.customer.create({ data }))
  )
  console.log(`✅ Created ${customers.length} customers`)

  // Create orders
  console.log('🛒 Creating orders...')
  const orderStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']
  const paymentStatuses = ['PENDING', 'PAID', 'FAILED']
  const paymentMethods = ['cash', 'card', 'mobile']

  const orders = []
  for (let i = 0; i < 200; i++) {
    const customer = faker.helpers.arrayElement(customers)
    const user = faker.helpers.arrayElement(users)
    const status = faker.helpers.arrayElement(orderStatuses)
    const paymentStatus =
      status === 'COMPLETED'
        ? 'PAID'
        : faker.helpers.arrayElement(paymentStatuses)

    // Create order items
    const itemCount = faker.number.int({ min: 1, max: 5 })
    const orderProducts = faker.helpers.arrayElements(products, itemCount)

    let subtotal = 0
    const items = orderProducts.map((product) => {
      const quantity = faker.number.int({ min: 1, max: 5 })
      const price = product.price
      const discount = faker.number.float({
        min: 0,
        max: price * 0.2,
        fractionDigits: 2
      })
      const itemSubtotal = Number.parseFloat(
        ((price - discount) * quantity).toFixed(2)
      )
      subtotal += itemSubtotal

      return {
        productId: product.id,
        quantity,
        price,
        discount,
        subtotal: itemSubtotal
      }
    })

    const tax = Number.parseFloat((subtotal * 0.1).toFixed(2))
    const discount = faker.number.float({
      min: 0,
      max: subtotal * 0.1,
      fractionDigits: 2
    })
    const total = Number.parseFloat((subtotal + tax - discount).toFixed(2))

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
        customerId: customer.id,
        userId: user.id,
        status: status as any,
        paymentMethod: faker.helpers.arrayElement(paymentMethods),
        paymentStatus: paymentStatus as any,
        subtotal,
        tax,
        discount,
        total,
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.3
        }),
        createdAt: faker.date.past({ years: 1 }),
        items: {
          create: items
        }
      }
    })
    orders.push(order)
  }
  console.log(`✅ Created ${orders.length} orders`)

  // Create stock movements
  console.log('📊 Creating stock movements...')
  const movementTypes = ['PURCHASE', 'SALE', 'ADJUSTMENT', 'RETURN', 'DAMAGE']
  const stockMovements = []

  for (let i = 0; i < 300; i++) {
    const product = faker.helpers.arrayElement(products)
    const type = faker.helpers.arrayElement(movementTypes)
    const quantity =
      type === 'SALE' || type === 'DAMAGE'
        ? -faker.number.int({ min: 1, max: 10 })
        : faker.number.int({ min: 1, max: 50 })

    const movement = await prisma.stockMovement.create({
      data: {
        productId: product.id,
        type: type as any,
        quantity,
        reason: faker.helpers.arrayElement([
          'Initial stock',
          'Restock from supplier',
          'Customer purchase',
          'Inventory adjustment',
          'Customer return',
          'Damaged in transit'
        ]),
        reference: faker.helpers.maybe(
          () => `REF-${faker.string.alphanumeric(6).toUpperCase()}`,
          { probability: 0.5 }
        ),
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.3
        }),
        createdAt: faker.date.past({ years: 1 })
      }
    })
    stockMovements.push(movement)
  }
  console.log(`✅ Created ${stockMovements.length} stock movements`)

  // Create debts
  console.log('💰 Creating debts...')
  const debtStatuses = ['PENDING', 'PARTIAL', 'PAID', 'OVERDUE']
  const debts = []

  // Customer debts
  for (let i = 0; i < 30; i++) {
    const customer = faker.helpers.arrayElement(customers)
    const amount = faker.number.float({ min: 50, max: 1000, fractionDigits: 2 })
    const paid = faker.helpers.arrayElement([
      0,
      Number.parseFloat((amount * 0.3).toFixed(2)),
      Number.parseFloat((amount * 0.5).toFixed(2)),
      amount
    ])
    const remaining = Number.parseFloat((amount - paid).toFixed(2))
    const status =
      remaining === 0 ? 'PAID' : remaining < amount ? 'PARTIAL' : 'PENDING'

    const debt = await prisma.debt.create({
      data: {
        type: 'CUSTOMER_DEBT',
        customerId: customer.id,
        amount,
        paid,
        remaining,
        status: status as any,
        dueDate: faker.date.future(),
        description: faker.helpers.arrayElement([
          'Outstanding order payment',
          'Credit purchase',
          'Partial payment pending'
        ]),
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.3
        })
      }
    })
    debts.push(debt)

    // Create payment records if partially paid
    if (paid > 0) {
      const paymentCount = faker.number.int({ min: 1, max: 3 })
      let remainingPayment = paid

      for (let j = 0; j < paymentCount && remainingPayment > 0; j++) {
        let paymentAmount: number

        // Use remainingPayment for the last payment or when remaining is too small
        if (j === paymentCount - 1 || remainingPayment <= 10) {
          paymentAmount = Number.parseFloat(remainingPayment.toFixed(2))
        } else {
          // remainingPayment > 10 here, safe to generate a random amount between 10 and remainingPayment
          paymentAmount = faker.number.float({
            min: 10,
            max: remainingPayment,
            fractionDigits: 2
          })
          paymentAmount = Number.parseFloat(paymentAmount.toFixed(2))

          // Clamp to remainingPayment to avoid tiny float overshoot
          if (paymentAmount > remainingPayment) {
            paymentAmount = Number.parseFloat(remainingPayment.toFixed(2))
          }
        }

        await prisma.debtPayment.create({
          data: {
            debtId: debt.id,
            amount: paymentAmount,
            method: faker.helpers.arrayElement([
              'cash',
              'card',
              'bank transfer'
            ]),
            reference: faker.string.alphanumeric(10).toUpperCase(),
            notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
              probability: 0.3
            }),
            createdAt: faker.date.recent({ days: 30 })
          }
        })

        remainingPayment = Number.parseFloat(
          (remainingPayment - paymentAmount).toFixed(2)
        )
      }
    }
  }

  // Supplier debts
  for (let i = 0; i < 20; i++) {
    const supplier = faker.helpers.arrayElement(suppliers)
    const amount = faker.number.float({
      min: 500,
      max: 5000,
      fractionDigits: 2
    })
    const paid = faker.helpers.arrayElement([
      0,
      Number.parseFloat((amount * 0.5).toFixed(2)),
      amount
    ])
    const remaining = Number.parseFloat((amount - paid).toFixed(2))
    const status =
      remaining === 0 ? 'PAID' : remaining < amount ? 'PARTIAL' : 'PENDING'

    const debt = await prisma.debt.create({
      data: {
        type: 'SUPPLIER_DEBT',
        supplierId: supplier.id,
        amount,
        paid,
        remaining,
        status: status as any,
        dueDate: faker.date.future(),
        description: faker.helpers.arrayElement([
          'Inventory purchase',
          'Bulk order payment',
          'Outstanding supplier invoice'
        ]),
        notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.3
        })
      }
    })
    debts.push(debt)
  }
  console.log(`✅ Created ${debts.length} debts`)

  // Create audit logs
  console.log('📝 Creating audit logs...')
  const actions = [
    'CREATE_PRODUCT',
    'UPDATE_PRODUCT',
    'DELETE_PRODUCT',
    'CREATE_ORDER',
    'UPDATE_ORDER',
    'CREATE_CUSTOMER',
    'UPDATE_CUSTOMER',
    'ADJUST_STOCK',
    'RECORD_PAYMENT'
  ]
  const entities = ['Product', 'Order', 'Customer', 'Stock', 'Debt']

  const auditLogs = []
  for (let i = 0; i < 100; i++) {
    const user = faker.helpers.arrayElement(users)
    const action = faker.helpers.arrayElement(actions)
    const entity = faker.helpers.arrayElement(entities)

    const log = await prisma.auditLog.create({
      data: {
        userId: user.id,
        action,
        entity,
        entityId: faker.string.numeric(5),
        details: {
          description: faker.lorem.sentence(),
          timestamp: faker.date.recent({ days: 30 }).toISOString()
        },
        createdAt: faker.date.past({ years: 1 })
      }
    })
    auditLogs.push(log)
  }
  console.log(`✅ Created ${auditLogs.length} audit logs`)

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - Users: ${users.length}`)
  console.log(`   - Suppliers: ${suppliers.length}`)
  console.log(`   - Products: ${products.length}`)
  console.log(`   - Customers: ${customers.length}`)
  console.log(`   - Orders: ${orders.length}`)
  console.log(`   - Stock Movements: ${stockMovements.length}`)
  console.log(`   - Debts: ${debts.length}`)
  console.log(`   - Audit Logs: ${auditLogs.length}`)
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
