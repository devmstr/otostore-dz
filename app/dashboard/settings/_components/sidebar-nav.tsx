'use client'

import { useState, type JSX, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { dynamicIcon } from '@/lib/icons'

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: NavLink[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [val, setVal] = useState<string>('')

  useEffect(() => {
    setVal(pathname ?? items[0]?.url ?? '/')
  }, [pathname, items])

  const handleSelect = (e: string) => {
    setVal(e)
    router.push(e)
  }

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="p-1 md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder="Select page" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => {
              const Icon = dynamicIcon(item.icon)
              return (
                <SelectItem
                  key={item.url.toString()}
                  value={item.url.toString()}
                >
                  <div className="flex gap-x-4 px-2 py-1">
                    {item.icon && <Icon className="scale-125" />}
                    <span className="text-md">{item.title}</span>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Sidebar */}
      <ScrollArea
        type="always"
        className="bg-background hidden w-full min-w-40 px-1 py-2 md:block"
      >
        <nav
          className={cn(
            'flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0',
            className
          )}
          {...props}
        >
          {items.map((item) => {
            const isActive = pathname === item.url
            const Icon = dynamicIcon(item.icon)
            return (
              <Link
                key={item.url.toString()}
                href={item.url}
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  isActive
                    ? 'bg-muted hover:bg-accent'
                    : 'hover:bg-accent hover:underline',
                  'justify-start'
                )}
              >
                <Icon className="me-2" />
                {item.title}
              </Link>
            )
          })}
        </nav>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}
