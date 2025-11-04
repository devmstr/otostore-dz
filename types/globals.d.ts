import { icons } from '@/lib/icons'
import { type LinkProps } from 'next/link'

export {} // ensures this file is treated as a module for merging globals

declare
global {
  type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

  type IconName = keyof typeof icons | undefined

  type FilterItem = {
    label: string
    value: string
    icon: IconName
  }

  type User = {
    name: string
    email: string
    avatar: string
  }

  type Team = {
    name: string
    logo: IconName
    plan: string
  }

  type BaseNavItem = {
    title: string
    badge?: string
    icon?: IconName
  }

  type NavLink = BaseNavItem & {
    url: LinkProps['href'] | (string & {})
    items?: never
  }

  type NavCollapsible = BaseNavItem & {
    items: (BaseNavItem & { url: LinkProps['href'] | (string & {}) })[]
    url?: never
  }

  type NavItem = NavCollapsible | NavLink

  type NavGroup = {
    title: string
    items: NavItem[]
  }

  type SidebarData = {
    user: User
    teams: Team[]
    navGroups: NavGroup[]
  }
}
