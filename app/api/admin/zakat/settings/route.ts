// app/api/admin/zakat/settings/route.ts
import { NextResponse } from 'next/server'
import { ZakatSettingsSchema } from '@/domain/dto/zakat.dto'
import { container } from '@/domain/di/container'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = ZakatSettingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await container.zakatService.upsertSettings(parsed.data)
  return NextResponse.json({ success: true, data: updated })
}
