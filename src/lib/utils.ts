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

// ⚡ Bolt Performance Optimization:
// Why: The application was calculating consensus and tier counts using sequential `.filter(...).length` statements over the sources array, resulting in O(5n) iteration complexity on every analysis.
// What: Implemented a reusable `computeConsensusCounts` utility that computes all necessary metrics (supporting, contradicting, tier 1/2/3) in a single O(n) pass.
// Impact: Reduces the number of array traversals from 5 to 1, significantly lowering CPU overhead during the consensus evaluation step, especially for claims with large numbers of evidence sources.
// Measurement: Measure execution time of consensus calculation phase; expect a proportional decrease relative to the number of retrieved sources.
export function computeConsensusCounts(sources: { supportsClaim: boolean; reliability: number }[]) {
  let supportingCount = 0
  let contradictingCount = 0
  let tier1Count = 0
  let tier2Count = 0
  let tier3Count = 0

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i]
    if (s.supportsClaim) supportingCount++
    else contradictingCount++

    if (s.reliability >= 90) tier1Count++
    else if (s.reliability >= 70) tier2Count++
    else tier3Count++
  }

  return {
    supportingCount,
    contradictingCount,
    tier1Count,
    tier2Count,
    tier3Count,
    agreementRatio: sources.length > 0 ? supportingCount / sources.length : 0,
    totalSources: sources.length,
  }
}
