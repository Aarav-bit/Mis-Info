export type VerificationStatus = 'Verified' | 'Likely Credible' | 'Needs Verification' | 'Likely False'

export interface Source {
  id: string
  name: string
  url: string
  reliability: number
  supportsClaim: boolean
  publishedAt: string
  category: string
  excerpt: string
}

export interface CredibilityFactor {
  name: string
  score: number
  description: string
  impact: 'positive' | 'negative' | 'neutral'
}

export interface VerificationReport {
  id: string
  claim: string
  inputType: 'text' | 'url' | 'screenshot'
  trustScore: number
  status: VerificationStatus
  confidence: number
  summary: string
  claimExtracted: string
  evidenceSummary: string
  reasoning: string
  sources: Source[]
  credibilityFactors: CredibilityFactor[]
  createdAt: string
  bookmarked: boolean
  topic: string
}

export interface AnalyticsStat {
  label: string
  value: number | string
  change: number
  icon: string
}

export interface DailyVerification {
  date: string
  count: number
  verified: number
  false: number
  uncertain: number
}

export interface TopicStat {
  topic: string
  count: number
  avgScore: number
}
