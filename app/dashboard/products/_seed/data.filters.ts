import type { FilterItem } from '@/components/types'
import {
  PRICE_RANGES,
  CATEGORIES,
  AVAILABILITY_STATUS,
  PRICE_RANGE_LABELS,
  CATEGORY_LABELS,
  AVAILABILITY_LABELS
} from '@/lib/constants/product'

export const categories: FilterItem[] = CATEGORIES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
  icon: getIconForCategory(value)
}))

export const availability: FilterItem[] = AVAILABILITY_STATUS.map((value) => ({
  value,
  label: AVAILABILITY_LABELS[value],
  icon: getIconForAvailability(value)
}))

export const priceRanges: FilterItem[] = PRICE_RANGES.map((value) => ({
  value,
  label: PRICE_RANGE_LABELS[value],
  icon: getIconForPriceRange(value)
}))

// Helper functions for icons
function getIconForCategory(category: string): string {
  const iconMap: Record<string, string> = {
    electronics: 'Cpu',
    clothing: 'Shirt',
    books: 'BookOpen',
    furniture: 'Bed',
    sports: 'Dumbbell',
    toys: 'Puzzle'
  }
  return iconMap[category] || 'Package'
}

function getIconForAvailability(status: string): string {
  const iconMap: Record<string, string> = {
    'in-stock': 'Check',
    'out-of-stock': 'X',
    preorder: 'Clock'
  }
  return iconMap[status] || 'Package'
}

function getIconForPriceRange(range: string): string {
  const iconMap: Record<string, string> = {
    budget: 'HandCoins',
    standard: 'CreditCard',
    premium: 'Crown'
  }
  return iconMap[range] || 'DollarSign'
}
