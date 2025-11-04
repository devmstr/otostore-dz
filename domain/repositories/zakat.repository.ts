// domain/repositories/zakat.repository.ts
import type { PrismaClient } from '@prisma/client'

export class ZakatRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async getSettings() {
    return this.prisma.zakatSettings.findFirst()
  }

  async upsertSettings(data: {
    enabled?: boolean
    rateBps?: number
    nisabCents?: number
    rounding?: 'up' | 'down' | 'nearest'
    currency?: string
  }) {
    const existing = await this.prisma.zakatSettings.findFirst()
    if (!existing) {
      return this.prisma.zakatSettings.create({ data })
    }
    return this.prisma.zakatSettings.update({
      where: { id: existing.id },
      data
    })
  }

  async createTransaction(tx: {
    userId?: string | null
    orderId?: number | null
    baseAmountCents: number
    amountCents: number
    rateBps: number
    currency: string
    note?: string | null
  }) {
    return this.prisma.zakatTransaction.create({
      data: {
        userId: tx.userId ?? null,
        orderId: tx.orderId ?? null,
        baseAmountCents: tx.baseAmountCents,
        amountCents: tx.amountCents,
        rateBps: tx.rateBps,
        currency: tx.currency,
        note: tx.note ?? null
      }
    })
  }

  async listTransactions({ skip = 0, take = 50 } = {}) {
    return this.prisma.zakatTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take
    })
  }
}
