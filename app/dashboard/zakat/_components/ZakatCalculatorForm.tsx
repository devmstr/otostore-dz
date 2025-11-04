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

// ---------------
// Schema & Types
// ---------------
export const zakatSchema = z.object({
  cash: z.number().min(0, 'Required'),
  savings: z.number().min(0, 'Required'),
  investments: z.number().min(0, 'Required'),
  moneyOwedToYou: z.number().min(0, 'Required'),
  moneyYouOwe: z.number().min(0, 'Required'),
  otherOutgoings: z.number().min(0, 'Required')
})

type ZakatFormValues = z.infer<typeof zakatSchema>

// Nisab value (based on silver or gold)
const NISAB_VALUE = 1615_000_00

export default function ZakatCalculator() {
  const form = useForm<ZakatFormValues>({
    resolver: zodResolver(zakatSchema),
    defaultValues: {
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
    const incoming =
      values.cash + values.savings + values.investments + values.moneyOwedToYou

    const outgoing = values.moneyYouOwe + values.otherOutgoings
    const net = incoming - outgoing
    const zakat = net > NISAB_VALUE ? net * 0.025 : 0

    return {
      netAssets: net,
      zakatDue: zakat
    }
  }, [values])

  return (
    <Card className="max-w-3xl mx-auto p-4">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Zakat Calculator
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Enter all assets that have been in your possession over a lunar year.
          The calculator will compute your total zakat owed.
        </p>
      </CardHeader>

      <CardContent>
        <form className="space-y-8">
          {/* Money */}
          <Section title="Money">
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
          </Section>

          <Separator className="my-6" />

          {/* Totals */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ReadOnlyField label="Net Assets" value={netAssets.toFixed(2)} />
            <ReadOnlyField
              label="Nisab Threshold"
              value={NISAB_VALUE.toFixed(2)}
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
        <Button
          type="button"
          disabled={zakatDue <= 0}
          onClick={() => alert(`Your zakat due: ${zakatDue.toFixed(2)}`)}
        >
          Update Zakat Due
        </Button>
      </CardFooter>
    </Card>
  )
}

// ---------------
// Reusable Fields
// ---------------
interface FormFieldProps {
  label: string
  name: keyof ZakatFormValues
  form: ReturnType<typeof useForm<ZakatFormValues>>
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
