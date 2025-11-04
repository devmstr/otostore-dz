export const orderStatuses: FilterItem[] = [
  { label: 'Pending', value: 'PENDING', icon: 'Clock' },
  { label: 'Processing', value: 'PROCESSING', icon: 'Loader' },
  { label: 'Completed', value: 'COMPLETED', icon: 'CheckCircle' },
  { label: 'Cancelled', value: 'CANCELLED', icon: 'XCircle' },
  { label: 'Refunded', value: 'REFUNDED', icon: 'RotateCcw' }
]

export const paymentStatuses: FilterItem[] = [
  { label: 'Pending', value: 'PENDING', icon: 'Clock' },
  { label: 'Paid', value: 'PAID', icon: 'CheckCircle' },
  { label: 'Failed', value: 'FAILED', icon: 'XCircle' },
  { label: 'Refunded', value: 'REFUNDED', icon: 'RotateCcw' }
]

export const paymentMethods: FilterItem[] = [
  { label: 'Cash', value: 'CASH', icon: 'Banknote' },
  { label: 'Card', value: 'CARD', icon: 'CreditCard' },
  { label: 'Bank Transfer', value: 'BANK_TRANSFER', icon: 'Building' },
  { label: 'Mobile Payment', value: 'MOBILE', icon: 'Smartphone' }
]
