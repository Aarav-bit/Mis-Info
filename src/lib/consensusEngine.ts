/**
 * Consensus Engine
 *
 * Aggregates evidence from multiple sources and determines whether
 * they agree, conflict, or are insufficient to reach a conclusion.
 *
 * If Government + Reuters + BBC + Wikipedia all say the same thing
 * → confidence goes up significantly.
 *
 * If sources directly contradict each other
 * → flag for manual review, lower confidence.
 */

import { Source } from '../types'

export type ConsensusVerdict = 'high' | 'moderate' | 'mixed' | 'conflict' | 'insufficient'

export interface ConsensusResult {
  verdict: ConsensusVerdict
  agreement: number           // 0–100 (percentage of sources that agree)
  confidenceBoost: number     // -20 to +25 points added to trust score
  flagForReview: boolean
  explanation: string
  sourceTiers: SourceTier[]
}

export interface SourceTier {
  name: string
  tier: 'tier1' | 'tier2' | 'tier3'
  reliability: number
  supportsClaim: boolean
}

// Source reliability tiers based on domain/category
const TIER1_SOURCES = new Set([
  // Government & Official
  'pib.gov.in', 'isro.gov.in', 'who.int', 'cdc.gov', 'nasa.gov',
  'eci.gov.in', 'rbi.org.in', 'sebi.gov.in',
  // Top wire services
  'reuters.com', 'apnews.com', 'afp.com', 'pti.in',
  // Major international broadcasters
  'bbc.com', 'bbc.co.uk', 'dw.com', 'aljazeera.com',
])

const TIER2_SOURCES = new Set([
  'thehindu.com', 'ndtv.com', 'indianexpress.com', 'timesofindia.indiatimes.com',
  'hindustantimes.com', 'theguardian.com', 'nytimes.com', 'washingtonpost.com',
  'bloomberg.com', 'ft.com', 'economist.com', 'wsj.com',
  // Fact checkers
  'factcheck.org', 'politifact.com', 'snopes.com', 'boomlive.in', 'altnews.in',
  // Encyclopedic
  'wikipedia.org', 'britannica.com',
  // Wikidata
  'wikidata.org',
])

function getSourceTier(source: Source): SourceTier {
  const domain = (() => {
    try {
      return new URL(source.url).hostname.replace('www.', '')
    } catch {
      return source.url.toLowerCase()
    }
  })()

  const tier = TIER1_SOURCES.has(domain) ? 'tier1' :
               TIER2_SOURCES.has(domain) ? 'tier2' : 'tier3'

  return {
    name: source.name,
    tier,
    reliability: source.reliability,
    supportsClaim: source.supportsClaim,
  }
}

/**
 * Analyzes consensus across all retrieved sources.
 * Returns a ConsensusResult with agreement score and confidence adjustment.
 */
export function analyzeConsensus(sources: Source[]): ConsensusResult {
  if (sources.length === 0) {
    return {
      verdict: 'insufficient',
      agreement: 0,
      confidenceBoost: -10,
      flagForReview: false,
      explanation: 'No external sources found. Verdict based on linguistic analysis only.',
      sourceTiers: [],
    }
  }

  const tiers = sources.map(getSourceTier)
  const supportingSources = tiers.filter((t) => t.supportsClaim)
  const opposingSources = tiers.filter((t) => !t.supportsClaim)

  // Weighted agreement: tier1 sources count more
  const tierWeight = { tier1: 3, tier2: 2, tier3: 1 }

  const supportWeight = supportingSources.reduce((sum, t) => sum + tierWeight[t.tier], 0)
  const opposeWeight = opposingSources.reduce((sum, t) => sum + tierWeight[t.tier], 0)
  const totalWeight = supportWeight + opposeWeight

  const agreement = totalWeight === 0 ? 50 : Math.round((supportWeight / totalWeight) * 100)

  // Tier 1 consensus boosts confidence significantly
  const tier1Supporting = supportingSources.filter((t) => t.tier === 'tier1').length
  const tier1Opposing = opposingSources.filter((t) => t.tier === 'tier1').length
  const tier2Supporting = supportingSources.filter((t) => t.tier === 'tier2').length

  let confidenceBoost = 0
  let verdict: ConsensusVerdict
  let flagForReview = false

  if (tier1Supporting >= 2 && tier1Opposing === 0) {
    // Multiple top-tier sources agree — very high consensus
    verdict = 'high'
    confidenceBoost = 20
  } else if (tier1Supporting >= 1 && tier2Supporting >= 1 && tier1Opposing === 0) {
    // Mixed tier1 + tier2 agreement
    verdict = 'high'
    confidenceBoost = 15
  } else if (agreement >= 75) {
    verdict = 'moderate'
    confidenceBoost = 8
  } else if (tier1Supporting >= 1 && tier1Opposing >= 1) {
    // Tier 1 sources directly conflict — serious issue
    verdict = 'conflict'
    confidenceBoost = -20
    flagForReview = true
  } else if (agreement >= 50) {
    verdict = 'mixed'
    confidenceBoost = 0
  } else {
    verdict = 'conflict'
    confidenceBoost = -15
    flagForReview = true
  }

  // Cap boost
  confidenceBoost = Math.max(-20, Math.min(25, confidenceBoost))

  const explanation = (() => {
    if (verdict === 'high') {
      const names = supportingSources.slice(0, 3).map((t) => t.name).join(', ')
      return `Strong consensus: ${names} all support the claim. High confidence.`
    }
    if (verdict === 'moderate') {
      return `${agreement}% of sources support the claim with moderate consistency.`
    }
    if (verdict === 'mixed') {
      return `Mixed signals: ${supportingSources.length} source(s) support, ${opposingSources.length} oppose or are neutral.`
    }
    if (verdict === 'conflict') {
      return `⚠️ Source conflict detected. ${tier1Opposing > 0 ? 'Top-tier sources disagree.' : 'Significant disagreement across sources.'} Manual review recommended.`
    }
    return 'Insufficient sources to determine consensus.'
  })()

  return {
    verdict,
    agreement,
    confidenceBoost,
    flagForReview,
    explanation,
    sourceTiers: tiers,
  }
}
