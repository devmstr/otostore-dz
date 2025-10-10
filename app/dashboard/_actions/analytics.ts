"use server"

import { requireAuth } from "@/lib/auth"
import { prisma } from "@/domain/database/db-service"

export async function getDashboardStats() {
  await requireAuth()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // Current month stats
  const [currentMonthOrders, currentMonthRevenue, totalCustomers, lowStockCount] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: { gte: startOfMonth },
        status: "COMPLETED",
      },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        status: "COMPLETED",
      },
      _sum: { total: true },
    }),
    prisma.customer.count(),
    prisma.product.count({
      where: {
        stock: {
          lte: prisma.product.fields.minStock,
        },
      },
    }),
  ])

  // Last month stats for comparison
  const [lastMonthOrders, lastMonthRevenue] = await Promise.all([
    prisma.order.count({
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        status: "COMPLETED",
      },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        status: "COMPLETED",
      },
      _sum: { total: true },
    }),
  ])

  const revenue = Number(currentMonthRevenue._sum.total || 0)
  const lastRevenue = Number(lastMonthRevenue._sum.total || 0)
  const revenueChange = lastRevenue > 0 ? ((revenue - lastRevenue) / lastRevenue) * 100 : 0

  const ordersChange = lastMonthOrders > 0 ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 : 0

  return {
    revenue,
    revenueChange,
    orders: currentMonthOrders,
    ordersChange,
    customers: totalCustomers,
    lowStockAlerts: lowStockCount,
  }
}

export async function getRevenueChartData() {
  await requireAuth()

  const now = new Date()
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    return {
      month: date.toLocaleString("default", { month: "short" }),
      year: date.getFullYear(),
      startDate: date,
      endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    }
  })

  const revenueData = await Promise.all(
    last12Months.map(async ({ month, startDate, endDate }) => {
      const result = await prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate, lte: endDate },
          status: "COMPLETED",
        },
        _sum: { total: true },
      })
      return {
        month,
        revenue: Number(result._sum.total || 0),
      }
    }),
  )

  return revenueData
}

export async function getRecentOrders(limit = 5) {
  await requireAuth()

  return prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
    },
  })
}

export async function getTopProducts(limit = 5) {
  await requireAuth()

  const topProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: limit,
  })

  const productsWithDetails = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })
      return {
        ...product,
        totalSold: item._sum.quantity || 0,
      }
    }),
  )

  return productsWithDetails
}

export async function getCategoryDistribution() {
  await requireAuth()

  const categories = await prisma.product.groupBy({
    by: ["category"],
    _count: {
      category: true,
    },
  })

  return categories.map((cat) => ({
    category: cat.category,
    count: cat._count.category,
  }))
}
