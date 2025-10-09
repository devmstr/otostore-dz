import { PrismaClient } from '@prisma/client'

/**
 * Prisma Singleton — ensures single instance across the app
 * Works perfectly in Next.js App Router, Edge-safe
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ['query', 'error', 'warn'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
