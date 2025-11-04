/* AUTO-GENERATED (or curated) */
// src/icons/index.tsx
import {
  Activity,
  Airplay,
  AlertTriangle,
  AudioWaveform,
  Banknote,
  BedDouble,
  Bell,
  BookOpen,
  Boxes,
  Building,
  Check,
  CheckCircle,
  CircleDashed,
  CircleSlash2,
  Clock,
  Coins,
  Cpu,
  CreditCard,
  Crown,
  DollarSign,
  Dumbbell,
  GalleryVerticalEnd,
  HandCoins,
  Headphones,
  Landmark,
  LayoutDashboard,
  List,
  Loader,
  Monitor,
  Package,
  Palette,
  Puzzle,
  RotateCcw,
  Settings,
  Shirt,
  ShoppingBag,
  Smartphone,
  Truck,
  TruckIcon,
  UserCog,
  UserMinus,
  UserPlus,
  UserRound,
  Wrench,
  X,
  XCircle
} from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { GoPeople } from 'react-icons/go'
import { LuShieldQuestion } from 'react-icons/lu'
import { MdOutlineBadge } from 'react-icons/md'
import { TbCashBanknote } from 'react-icons/tb'

import { cn } from './utils'

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export const icons = {
  Unknown: LuShieldQuestion,
  Money: TbCashBanknote,
  Building,
  User: UserRound,
  UserPlus,
  XCircle,
  Loader,
  RotateCcw,
  Smartphone,
  Banknote,
  Landmark,
  CircleDashed,
  CheckCircle,
  AlertTriangle,
  UserMinus,
  TruckIcon,
  Coins,
  Cpu,
  Shirt,
  BookOpen,
  BedDouble,
  Dumbbell,
  Puzzle,
  CircleSlash2,
  Check,
  X,
  Clock,
  CreditCard,
  Crown,
  DollarSign,
  Activity,
  Airplay,
  GalleryVerticalEnd,
  AudioWaveform,
  LayoutDashboard,
  ShoppingCart: ShoppingBag,
  List,
  Package,
  Boxes,
  Truck,
  HandCoins,
  Settings,
  UserCog,
  Wrench,
  Palette,
  Bell,
  Monitor,
  Users: (props: SVGProps<SVGSVGElement>) => (
    <GoPeople {...props} className={cn('stroke-[0.5]', props.className)} />
  ),
  Workers: (props: SVGProps<SVGSVGElement>) => (
    <MdOutlineBadge
      {...props}
      className={cn('scale-110 -translate-y-[2px]', props.className)}
    />
  ),
  Headphones,
  CashIn: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        'lucide lucide-banknote-arrow-down-icon lucide-banknote-arrow-down'
      }
      {...props}
    >
      <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
      <path d="m16 19 3 3 3-3" />
      <path d="M18 12h.01" />
      <path d="M19 16v6" />
      <path d="M6 12h.01" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  CashOut: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-banknote-arrow-up-icon lucide-banknote-arrow-up"
      {...props}
    >
      <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
      <path d="M18 12h.01" />
      <path d="M19 22v-6" />
      <path d="m22 19-3-3-3 3" />
      <path d="M6 12h.01" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
} satisfies Record<string, IconComponent>

export type IconName = keyof typeof icons

export function dynamicIcon(name?: IconName): IconComponent {
  return icons[name ?? 'Unknown'] ?? icons.Unknown
}

export function DynamicIcon({
  name = 'Unknown',
  ...props
}: { name?: IconName } & SVGProps<SVGSVGElement>) {
  const Icon = dynamicIcon(name)
  return <Icon {...props} />
}
