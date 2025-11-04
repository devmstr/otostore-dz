import { Monitor, Bell, Palette, Wrench, UserCog } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/header'
import { Main } from '@/components/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SidebarNav } from './_components/sidebar-nav'

const sidebarNavItems: NavLink[] = [
  {
    title: 'Profile',
    url: '/dashboard/settings',
    icon: 'UserCog'
  },
  {
    title: 'Account',
    url: '/dashboard/settings/account',
    icon: 'Wrench'
  },
  {
    title: 'Appearance',
    url: '/dashboard/settings/appearance',
    icon: 'Palette'
  },
  {
    title: 'Notifications',
    url: '/dashboard/settings/notifications',
    icon: 'Bell'
  },
  {
    title: 'Display',
    url: '/dashboard/settings/display',
    icon: 'Monitor'
  },
  {
    title: 'Zakat',
    url: '/dashboard/settings/zakat',
    icon: 'HandCoins'
  }
]

interface Props {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Main fixed>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-4 lg:my-6" />
        <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
          <aside className="top-0 lg:sticky lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex w-full overflow-y-hidden p-1">{children}</div>
        </div>
      </Main>
    </>
  )
}
