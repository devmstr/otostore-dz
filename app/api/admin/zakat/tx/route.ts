// app/api/admin/zakat/tx/route.ts
import { NextResponse } from 'next/server'
import { ZakatRecordInputSchema } from '@/domain/dto/zakat.dto'
import { container } from '@/domain/di/container'

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = ZakatRecordInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const tx = await container.zakatService.recordTransaction(parsed.data)
  return NextResponse.json({ success: true, data: tx })
}
