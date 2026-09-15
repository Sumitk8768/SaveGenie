import clsx from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function currency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}