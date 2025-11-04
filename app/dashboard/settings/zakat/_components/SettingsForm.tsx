'use client'

import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { toast } from 'sonner'

// --------------------
// Schema
// --------------------
const CombinedZakatSchema = z.object({
  // Settings
  enabled: z.boolean(),
  nisabCents: z
    .number()
    .int()
    .nonnegative()
    .min(1000_000_00, {
      message: 'Nisab Should be more then 1000_000_00 (100 Million)'
    })
    .max(2000_000_00, {
      message: 'Nisab Should be less then 2000_000_00 (200 Millions)'
    }),
  rounding: z.enum(['nearest', 'up', 'down']),

  // Asset inputs
  cash: z.number().min(0),
  savings: z.number().min(0),
  investments: z.number().min(0),
  moneyOwedToYou: z.number().min(0),
  moneyYouOwe: z.number().min(0),
  otherOutgoings: z.number().min(0)
})

type CombinedZakatForm = z.infer<typeof CombinedZakatSchema>

// --------------------
// Component
// --------------------
export function ZakatSettingsForm({
  initialSettings
}: {
  initialSettings: Pick<
    CombinedZakatForm,
    'enabled' | 'nisabCents' | 'rounding'
  >
}) {
  const form = useForm<CombinedZakatForm>({
    resolver: zodResolver(CombinedZakatSchema),
    defaultValues: {
      enabled: initialSettings.enabled ?? true,
      nisabCents: initialSettings.nisabCents ?? 1615_000_00,
      rounding: initialSettings.rounding ?? 'nearest',
      cash: 0,
      savings: 0,
      investments: 0,
      moneyOwedToYou: 0,
      moneyYouOwe: 0,
      otherOutgoings: 0
    }
  })

  const values = form.watch()

  const { netAssets, zakatDue } = useMemo(() => {
    const totalAssets =
      values.cash + values.savings + values.investments + values.moneyOwedToYou

    const totalLiabilities = values.moneyYouOwe + values.otherOutgoings
    const net = totalAssets - totalLiabilities

    let zakat = 0
    if (values.enabled && net > values.nisabCents) {
      const base = net * 0.025
      if (values.rounding === 'nearest') zakat = Math.round(base)
      if (values.rounding === 'up') zakat = Math.ceil(base)
      if (values.rounding === 'down') zakat = Math.floor(base)
    }

    return { netAssets: net, zakatDue: zakat }
  }, [values])

  async function onSubmit(data: CombinedZakatForm) {
    const res = await fetch('/api/admin/zakat/settings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        enabled: data.enabled,
        nisabCents: data.nisabCents,
        rounding: data.rounding
      })
    })

    if (res.ok) toast.success('Zakat settings saved successfully.')
    else toast.error('Failed to save settings.')
  }

  return (
    <Card className="max-w-3xl mx-auto p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Zakat Calculator & Settings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage your zakat calculation and settings in one place.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Settings Section */}
          <Section title="Settings">
            <div className="flex items-center justify-between border p-3 rounded-lg">
              <div>
                <Label>Enable Zakat</Label>
                <p className="text-xs text-muted-foreground">
                  Toggle zakat calculation system.
                </p>
              </div>
              <Switch
                checked={values.enabled}
                onCheckedChange={(v) => form.setValue('enabled', v)}
              />
            </div>

            <div>
              <Label>Rounding Method</Label>
              <Select
                value={values.rounding}
                onValueChange={(v) =>
                  form.setValue('rounding', v as CombinedZakatForm['rounding'])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rounding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nearest">Nearest</SelectItem>
                  <SelectItem value="up">Up</SelectItem>
                  <SelectItem value="down">Down</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Section>

          <Separator className="my-6" />

          {/* Assets Section */}
          <Section title="Assets">
            <FormField label="Cash at home & bank" name="cash" form={form} />
            <FormField label="Other savings" name="savings" form={form} />
            <FormField
              label="Investments & shares"
              name="investments"
              form={form}
            />
            <FormField
              label="Money owed to you"
              name="moneyOwedToYou"
              form={form}
            />
            <FormField label="Money you owe" name="moneyYouOwe" form={form} />
            <FormField
              label="Other outgoings"
              name="otherOutgoings"
              form={form}
            />
          </Section>

          <Separator className="my-6" />

          {/* Computed Values */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ReadOnlyField label="Net Assets" value={netAssets.toFixed(2)} />
            <ReadOnlyField
              label="Nisab Threshold"
              value={values.nisabCents.toFixed(2)}
            />
          </div>

          <ReadOnlyField
            label="Zakat Due (2.5%)"
            value={zakatDue.toFixed(2)}
            className="text-lg font-semibold text-primary"
          />
        </form>
      </CardContent>

      <CardFooter className="justify-end">
        <Button type="submit" form={form.getValues() ? undefined : undefined}>
          Save Settings
        </Button>
        <Button
          type="button"
          disabled={!values.enabled || zakatDue <= 0}
          className="ml-2"
          onClick={() => toast.info(`Your zakat due: ${zakatDue.toFixed(2)}`)}
        >
          Calculate Zakat
        </Button>
      </CardFooter>
    </Card>
  )
}

// --------------------
// Reusable Components
// --------------------
interface FormFieldProps {
  label: string
  name: keyof CombinedZakatForm
  form: ReturnType<typeof useForm<CombinedZakatForm>>
}

function FormField({ label, name, form }: FormFieldProps) {
  const { register, formState } = form
  const error = formState.errors[name]?.message as string | undefined

  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type="number"
        step="any"
        {...register(name, { valueAsNumber: true })}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function ReadOnlyField({
  label,
  value,
  className
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input value={value} readOnly className={className} />
    </div>
  )
}

function Section({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="grid gap-3">{children}</div>
    </div>
  )
}
