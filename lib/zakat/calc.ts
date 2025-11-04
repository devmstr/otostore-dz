export type Rounding = 'up' | 'down' | 'nearest'

/** Deterministic zakat calculation - returns cents */
export function calculateZakatCents(
  baseCents: number,
  rateBps: number,
  rounding: Rounding = 'nearest'
): number {
  if (!Number.isFinite(baseCents) || baseCents <= 0) return 0
  if (!Number.isFinite(rateBps) || rateBps <= 0) return 0

  const raw = (baseCents * rateBps) / 10000 // bps -> decimal
  switch (rounding) {
    case 'up':
      return Math.ceil(raw)
    case 'down':
      return Math.floor(raw)
    default:
      return Math.round(raw)
  }
}
