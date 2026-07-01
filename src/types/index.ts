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
  tier?: 1 | 2 | 3
}

export interface CredibilityFactor {
  name: string
  score: number
  description: string
  impact: 'positive' | 'negative' | 'neutral'
}

export interface ScoreBreakdown {
  sourceReliability: number    // 0-100, weighted 35%
  evidenceAgreement: number    // 0-100, weighted 25%
  semanticMatch: number        // 0-100, weighted 20%
  linguisticRisk: number       // 0-100, weighted 10% (higher = safer)
  ruleEngine: number           // 0-100, weighted 10%
}

export interface LinguisticRiskFlag {
  label: string
  score: number        // 0-100, higher = more risky
  detected: boolean
  description: string
}

export interface ConsensusData {
  agreementRatio: number      // 0-1
  totalSources: number
  supportingCount: number
  contradictingCount: number
  tier1Count: number
  tier2Count: number
  tier3Count: number
  conflictDetected: boolean
  manualReviewFlag: boolean
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
  recommendation: string
  sources: Source[]
  credibilityFactors: CredibilityFactor[]
  scoreBreakdown: ScoreBreakdown
  linguisticRiskFlags: LinguisticRiskFlag[]
  consensusData: ConsensusData
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
