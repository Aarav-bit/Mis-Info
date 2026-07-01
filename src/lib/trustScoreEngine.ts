/**
 * Trust Score Engine
 *
 * Computes an explainable, weighted trust score from all pipeline inputs.
 * Every score is traceable to a formula so it can be explained to judges.
 *
 * Formula:
 *   Trust Score =
 *     (sourceReliability × 0.35)  +
 *     (evidenceAgreement × 0.25)  +
 *     (semanticMatch     × 0.20)  +
 *     (linguisticRisk    × 0.10)  +   ← inverted (safe = high)
 *     (ruleEngine        × 0.10)
 */

import { ScoreBreakdown, CredibilityFactor } from '../types'
import { getScoreStatus } from './utils'

export interface TrustScoreInput {
  /** 0–100: average reliability of sources found (0 if none found) */
  sourceReliability: number
  /** 0–100: how much the sources agree with each other (consensus) */
  evidenceAgreement: number
  /** 0–100: semantic/token similarity between claim and evidence */
  semanticMatch: number
  /** 0–100: linguistic safety score (higher = less manipulative) */
  linguisticRisk: number
  /** 0–100: score from the keyword rule engine */
  ruleEngine: number
}

export interface TrustScoreOutput {
  trustScore: number
  confidence: number
  status: string
  breakdown: ScoreBreakdown
  breakdownFactors: CredibilityFactor[]
  explanation: string
}

const WEIGHTS = {
  sourceReliability: 0.35,
  evidenceAgreement: 0.25,
  semanticMatch: 0.20,
  linguisticRisk: 0.10,
  ruleEngine: 0.10,
} as const

/**
 * Computes the final trust score and generates a human-readable explanation.
 */
export function computeTrustScore(input: TrustScoreInput): TrustScoreOutput {
  const {
    sourceReliability,
    evidenceAgreement,
    semanticMatch,
    linguisticRisk,
    ruleEngine,
  } = input

  const trustScore = Math.max(5, Math.min(98, Math.round(
    sourceReliability * WEIGHTS.sourceReliability +
    evidenceAgreement * WEIGHTS.evidenceAgreement +
    semanticMatch     * WEIGHTS.semanticMatch +
    linguisticRisk    * WEIGHTS.linguisticRisk +
    ruleEngine        * WEIGHTS.ruleEngine
  )))

  // Confidence is higher when more signals are non-zero
  const nonZeroSignals = Object.values(input).filter((v) => v > 0).length
  const confidence = Math.min(95, 35 + nonZeroSignals * 12)

  const status = getScoreStatus(trustScore)

  const breakdown: ScoreBreakdown = {
    sourceReliability,
    evidenceAgreement,
    semanticMatch,
    linguisticRisk,
    ruleEngine,
  }

  const breakdownFactors: CredibilityFactor[] = [
    {
      name: 'Source Reliability (35%)',
      score: sourceReliability,
      description: sourceReliability >= 80
        ? 'High-reliability sources (fact-checkers, government, encyclopedias) found.'
        : sourceReliability >= 50
          ? 'Medium-reliability sources found. Cross-check recommended.'
          : 'No or low-reliability sources found.',
      impact: sourceReliability >= 70 ? 'positive' : sourceReliability >= 40 ? 'neutral' : 'negative',
    },
    {
      name: 'Evidence Agreement (25%)',
      score: evidenceAgreement,
      description: evidenceAgreement >= 75
        ? 'Multiple sources agree on the same conclusion — high consensus.'
        : evidenceAgreement >= 40
          ? 'Partial agreement across sources. Some conflicting signals.'
          : 'Sources disagree or insufficient evidence to establish consensus.',
      impact: evidenceAgreement >= 70 ? 'positive' : evidenceAgreement >= 40 ? 'neutral' : 'negative',
    },
    {
      name: 'Semantic Match (20%)',
      score: semanticMatch,
      description: semanticMatch >= 70
        ? 'Strong contextual overlap between claim and retrieved evidence.'
        : semanticMatch >= 35
          ? 'Moderate contextual overlap. Evidence is partially relevant.'
          : 'Low contextual overlap. Evidence may not directly address this claim.',
      impact: semanticMatch >= 60 ? 'positive' : semanticMatch >= 30 ? 'neutral' : 'negative',
    },
    {
      name: 'Linguistic Risk (10%)',
      score: linguisticRisk,
      description: linguisticRisk >= 75
        ? 'Text uses calm, neutral language. Low manipulation risk.'
        : linguisticRisk >= 50
          ? 'Some emotional or sensational language detected.'
          : 'High manipulation signals: urgency, scam patterns, or conspiracy framing detected.',
      impact: linguisticRisk >= 70 ? 'positive' : linguisticRisk >= 45 ? 'neutral' : 'negative',
    },
    {
      name: 'Rule Engine (10%)',
      score: ruleEngine,
      description: ruleEngine >= 70
        ? 'Matches a known credible pattern in the rules database.'
        : ruleEngine >= 40
          ? 'Partial match to known misinformation patterns.'
          : 'No strong rule match found — defaulting to neutral.',
      impact: ruleEngine >= 65 ? 'positive' : ruleEngine >= 35 ? 'neutral' : 'negative',
    },
  ]

  const topFactor = Object.entries(input).sort(
    ([, a], [, b]) => b * WEIGHTS[b as keyof typeof WEIGHTS] - a * WEIGHTS[a as keyof typeof WEIGHTS]
  )[0][0]

  const explanation =
    `Trust Score: ${trustScore}/100. ` +
    `Formula: (${sourceReliability}×35% Source) + (${evidenceAgreement}×25% Consensus) + ` +
    `(${semanticMatch}×20% Semantic) + (${linguisticRisk}×10% Linguistic) + (${ruleEngine}×10% Rules) = ${trustScore}. ` +
    `${status === 'Verified' || status === 'Likely Credible'
        ? 'The claim is supported by reliable evidence.'
        : status === 'Needs Verification'
          ? 'Insufficient evidence to make a confident determination.'
          : 'This claim shows strong signals of misinformation.'
    }`

  return { trustScore, confidence, status, breakdown, breakdownFactors, explanation }
}
