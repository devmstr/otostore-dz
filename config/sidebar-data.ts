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
      title: 'General',
      items: [
        { title: 'Dashboard', url: '/dashboard', icon: 'LayoutDashboard' },
        { title: 'Products', url: '/dashboard/products', icon: 'Package' },
        { title: 'Customers', url: '/dashboard/customers', icon: 'Users' },
        { title: 'inventory', url: '/dashboard/inventory', icon: 'Boxes' },
        { title: 'Orders', url: '/dashboard/orders', icon: 'List' },
        { title: 'Users', url: '/dashboard/users', icon: 'Users' }
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
            }
          ]
        },
        { title: 'Help Center', url: '/help', icon: 'Headphones' }
      ]
    }
  ]
}
