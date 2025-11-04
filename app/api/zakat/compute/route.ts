// app/api/zakat/compute/route.ts
import { NextResponse } from 'next/server'
import { ZakatComputeSchema } from '@/domain/dto/zakat.dto'
import { container } from '@/domain/di/container'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = ZakatComputeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { baseAmountCents } = parsed.data
  const cents = await container.zakatService.computeZakatCentsFor(
    baseAmountCents
  )
  return NextResponse.json({ zakatCents: cents })
}
