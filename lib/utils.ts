import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price % 1 === 0) {
    return `Rs. ${price.toLocaleString('en-PK')}`
  }
  return `Rs. ${price.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const CURRENCY_SYMBOL = 'Rs.'
