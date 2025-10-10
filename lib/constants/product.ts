export const PRICE_RANGES = ['budget', 'standard', 'premium'] as const
export type PriceRange = (typeof PRICE_RANGES)[number]

export const CATEGORIES = [
  'electronics',
  'clothing',
  'books',
  'furniture',
  'sports',
  'toys',
  'all'
] as const
export type Category = (typeof CATEGORIES)[number]

export const AVAILABILITY_STATUS = [
  'in-stock',
  'out-of-stock',
  'preorder'
] as const
export type AvailabilityStatus = (typeof AVAILABILITY_STATUS)[number]

export const PRICE_RANGE_LABELS: Record<PriceRange, string> = {
  budget: 'Budget',
  standard: 'Standard',
  premium: 'Premium'
}

export const CATEGORY_LABELS: Record<Category, string> = {
  electronics: 'Electronics',
  clothing: 'Clothing',
  books: 'Books',
  furniture: 'Furniture',
  sports: 'Sports',
  toys: 'Toys',
  all: 'All'
}

export const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  'in-stock': 'In Stock',
  'out-of-stock': 'Out of Stock',
  preorder: 'Preorder'
}
