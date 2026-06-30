import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-green-500'
  if (score >= 50) return 'text-yellow-500'
  return 'text-red-500'
}

export function getScoreBg(score: number): string {
  if (score >= 75) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function getScoreStatus(score: number): string {
  if (score >= 80) return 'Verified'
  if (score >= 65) return 'Likely Credible'
  if (score >= 40) return 'Needs Verification'
  return 'Likely False'
}

export function getScoreStatusColor(score: number): string {
  if (score >= 80) return 'green'
  if (score >= 65) return 'blue'
  if (score >= 40) return 'yellow'
  return 'red'
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}
