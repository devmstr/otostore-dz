// sidebar-data.ts (server-safe)

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar:
      'https://lh3.googleusercontent.com/a/ACg8ocIcoMnbpu9TLBQc4uWFYTRUfgPrSaXQwHkvjVgRFUJkx9KSMMQS=s83-c-mo'
  },
  teams: [
    { name: 'Shadcn Admin', logo: 'Building', plan: 'Vite + ShadcnUI' },
    { name: 'Acme Inc', logo: 'GalleryVerticalEnd', plan: 'Enterprise' },
    { name: 'Acme Corp.', logo: 'AudioWaveform', plan: 'Startup' }
  ],
  navGroups: [
    {
      title: 'Général',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: 'LayoutDashboard'
        },
        {
          title: 'POS (Point Of Sales) ',
          url: '/dashboard/pos',
          icon: 'ShoppingCart'
        },
        { title: 'Orders', url: '/dashboard/orders', icon: 'List' },
        { title: 'Products', url: '/dashboard/products', icon: 'Package' },
        { title: 'inventory', url: '/dashboard/inventory', icon: 'Boxes' }
      ]
    },
    {
      title: 'People',
      items: [
        {
          title: 'Customers/Suppliers',
          url: '/dashboard/partners',
          icon: 'Users'
        },
        { title: 'Staff', url: '/dashboard/staff', icon: 'Workers' }
      ]
    },
    {
      title: 'Cashflow',
      items: [
        {
          title: 'Debts/Loans',
          url: '/dashboard/cashflow',
          icon: 'Money'
        },
        { title: 'Zakat', url: '/dashboard/zakat', icon: 'HandCoins' }
      ]
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: 'Settings',
          items: [
            { title: 'Profile', url: '/dashboard/settings', icon: 'UserCog' },
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
        },
        { title: 'Help Center', url: '/help', icon: 'Headphones' }
      ]
    }
  ]
}
