import { PrismaClient } from "@prisma/client"

/**
 * Prisma Singleton — ensures single instance across the app
 * Works perfectly in Next.js App Router, Edge-safe
 * Optimized for Neon PostgreSQL with connection pooling
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Neon-specific optimizations
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
