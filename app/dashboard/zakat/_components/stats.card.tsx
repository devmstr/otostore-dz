// components/StatCard.tsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { dynamicIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  icon: IconName
  value: string | number
  description: string
  primary?: boolean
}

export function StatCard({
  title,
  icon,
  value,
  description,
  className,
  primary = false
}: StatCardProps) {
  const Icon = dynamicIcon(icon)
  return (
    <Card
      className={cn(
        primary ? 'bg-primary text-primary-foreground' : '',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={cn(
            'text-sm font-medium',
            primary ? 'text-primary-foreground' : ''
          )}
        >
          {title}
        </CardTitle>
        <div className={`text-muted-foreground h-4 w-4 `}>
          <Icon />
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-2xl font-bold',
            primary ? 'text-primary-foreground' : ''
          )}
        >
          {value}
        </div>
        <p
          className={cn(
            'text-xs',
            primary ? 'text-primary-foreground' : 'text-muted-foreground'
          )}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
