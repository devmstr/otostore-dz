// app/dashboard/zakat/_test/calc.test.ts
import { describe, it, expect } from 'vitest'
import { calculateZakatCents } from '@/lib/zakat/calc'

describe('calculateZakatCents', () => {
  it('calculates 2.5% nearest for 100000 cents => 2500 cents', () => {
    expect(calculateZakatCents(100000, 250, 'nearest')).toBe(2500)
  })
  it('rounds up when requested', () => {
    expect(calculateZakatCents(12345, 250, 'up')).toBe(
      Math.ceil((12345 * 250) / 10000)
    )
  })
})
