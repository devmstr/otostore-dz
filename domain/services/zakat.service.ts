// domain/services/zakat.service.ts
import { ZakatRepository } from '../repositories/zakat.repository'
import { calculateZakatCents } from '@/lib/zakat/calc'
import type { ZakatRecordInput } from '../dto/zakat.dto'

export class ZakatService {
  constructor(private readonly repo: ZakatRepository) {}

  async getSettings() {
    const s = await this.repo.getSettings()
    if (!s)
      return {
        enabled: false,
        rateBps: 250,
        nisabCents: 0,
        rounding: 'nearest',
        currency: 'DZD'
      }
    return s
  }

  async upsertSettings(
    input: Partial<{
      enabled: boolean
      rateBps: number
      nisabCents: number
      rounding: 'up' | 'down' | 'nearest'
      currency: string
    }>
  ) {
    return this.repo.upsertSettings(input)
  }

  async computeZakatCentsFor(baseCents: number) {
    const s = await this.getSettings()
    if (!s.enabled) return 0
    if (s.nisabCents > 0 && baseCents < s.nisabCents) return 0
    return calculateZakatCents(baseCents, s.rateBps, s.rounding as any)
  }

  async recordTransaction(input: ZakatRecordInput) {
    const s = await this.getSettings()
    if (!s.enabled) throw new Error('Zakat disabled')
    const amountCents = calculateZakatCents(
      input.baseAmountCents,
      s.rateBps,
      s.rounding as any
    )
    if (amountCents <= 0) throw new Error('No zakat due')
    return this.repo.createTransaction({
      userId: (input as any).userId ?? null,
      orderId:
        typeof (input as any).orderId === 'number'
          ? (input as any).orderId
          : null,
      baseAmountCents: input.baseAmountCents,
      amountCents,
      rateBps: s.rateBps,
      currency: s.currency,
      note: (input as any).note ?? null
    })
  }

  async listTransactions(opts?: { skip?: number; take?: number }) {
    return this.repo.listTransactions(opts)
  }
}
