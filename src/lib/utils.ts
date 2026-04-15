import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatArrayValue(
  arr: string[] | null | undefined,
  delimiter: string = ', '
): string {
  if (arr == null) return ''
  if (arr.length === 1) return arr[0]
  return arr.join(delimiter)
}

export function truncate(str: unknown, length: number): string {
  if (str && typeof str === 'object' && '@id' in str) return ''
  const s = String(str)
  return s.length <= length ? s : s.substring(0, length) + '...'
}

export function convert2arr(value: unknown): string[] {
  if (!Array.isArray(value)) return [value as string]
  return value
}
