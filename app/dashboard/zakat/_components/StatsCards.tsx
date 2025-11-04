'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { StatCard } from './stats.card'
import { getCookie, setCookie } from '@/lib/cookies'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface Props {}

const stats = {
  zakatDue: 405_000_00,
  paidZakat: 100_000_00,
  businessAssets: 12_000_000_00,
  loans: 130_000_00,
  bankAndHome: 3_200_000_00,
  otherCash: 900_000_00,
  productsCount: 255
}

export const StatsCards: React.FC<Props> = () => {
  const [useAlgerianConvention, setUseAlgerianConvention] = useState(false)

  useEffect(() => {
    const cookieValue = getCookie('use_algerian_convention')
    if (cookieValue === 'true') setUseAlgerianConvention(true)
  }, [])

  function handleConventionToggle(value: boolean) {
    setUseAlgerianConvention(value)
    setCookie('use_algerian_convention', value.toString(), 60 * 60 * 24 * 365)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground">
            Use Algerian “Million” Convention (10 000 DZD = 1 Million)
          </Label>
          <Switch
            checked={useAlgerianConvention}
            onCheckedChange={handleConventionToggle}
          />
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Zakat Due"
          icon="HandCoins"
          value={formatDZD(stats.zakatDue, {
            useAlgerianConvention
          })}
          description={`You paid ${formatDZD(stats.paidZakat, {
            useAlgerianConvention,
            displaySuffix: false
          })} / ${formatDZD(stats.zakatDue, {
            useAlgerianConvention,
            displaySuffix: false
          })} in ${new Date().getFullYear()}`}
          primary
        />

        <StatCard
          title="Business Assets"
          icon="CashIn"
          value={formatDZD(stats.businessAssets, { useAlgerianConvention })}
          description={`${stats.productsCount} products generating revenue`}
        />

        <StatCard
          title="Bank & Home & Loans"
          icon="Landmark"
          value={formatDZD(stats.bankAndHome + stats.loans, {
            useAlgerianConvention
          })}
          description="Cash, bank, and receivables."
        />

        <StatCard
          title="Other Cash"
          icon="Coins"
          value={formatDZD(stats.otherCash, { useAlgerianConvention })}
          description="Savings and investments."
        />
      </section>
    </div>
  )
}

/* --------------------- */
/* Helper Components */
/* --------------------- */

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  )
}

/* --------------------- */
/* Helper Function */
/* --------------------- */

export function formatDZD(
  value: number,
  {
    useAlgerianConvention: useConvention = false,
    displaySuffix = true
  }: {
    useAlgerianConvention?: boolean
    displaySuffix?: boolean
  } = {}
): string {
  const dinars = value / 100
  const formatNumber = (num: number) =>
    num.toLocaleString('fr-DZ', { minimumFractionDigits: 0 })

  if (useConvention) {
    const millions = dinars / 10_000
    if (millions >= 1_000)
      return `${(millions / 1_000).toFixed(1)} ${
        displaySuffix ? 'Milliard' : ''
      } `
    if (millions >= 1)
      return `${millions.toFixed(1)} ${displaySuffix ? 'Million' : ''} `
    return `${formatNumber(dinars)} `
  }

  if (dinars >= 1_000_000_000)
    return `${(dinars / 1_000_000_000).toFixed(1)} ${
      displaySuffix ? 'Milliard' : ''
    } `
  if (dinars >= 1_000_000)
    return `${(dinars / 1_000_000).toFixed(1)} ${
      displaySuffix ? 'Million' : ''
    } `
  return `${formatNumber(dinars)}`
}
