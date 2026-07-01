/**
 * Linguistic Risk Analysis Module
 *
 * Analyzes text for linguistic signals of misinformation, manipulation,
 * and low-credibility content. This is NOT grammar checking — it detects
 * psychological manipulation patterns used in viral misinformation.
 *
 * Returns a linguisticSafetyScore (0–100):
 *   - High score (80–100) → text is calm, neutral, sourced
 *   - Low score  (0–40)   → text shows high manipulation risk
 */

export interface LinguisticRiskResult {
  safetyScore: number      // 0–100, higher = safer / less manipulative
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  signals: LinguisticSignal[]
}

export interface LinguisticSignal {
  type: string
  description: string
  penalty: number
  matched: string[]
}

// ── Urgency Signals ──────────────────────────────────────────────────────────
const URGENCY_TERMS = [
  'forward immediately', 'share now', 'must share', 'share with everyone',
  'act now', 'time is running out', 'last chance', 'do not ignore',
  'urgent', 'breaking', 'emergency alert', 'must read', 'read before deleted',
]

// ── Emotional Manipulation ───────────────────────────────────────────────────
const EMOTIONAL_TERMS = [
  'shocking', 'mind blowing', 'unbelievable', 'you wont believe',
  'incredible', 'jaw dropping', 'outrageous', 'heartbreaking',
  'terrifying', 'must see', 'going viral', 'everyone is talking about',
]

// ── Conspiracy / Distrust Signals ────────────────────────────────────────────
const CONSPIRACY_TERMS = [
  'they dont want you to know', 'mainstream media wont', 'what they are hiding',
  'wake up', 'big pharma', 'deep state', 'new world order', 'hidden truth',
  'suppressed by', 'banned information', 'shadow ban', 'censored truth',
  'secret agenda', 'they are lying',
]

// ── Scam Patterns ────────────────────────────────────────────────────────────
const SCAM_TERMS = [
  'free money', 'free cash', 'you have won', 'lottery winner',
  'claim your prize', 'click the link', 'limited time offer', 'act fast',
  'send your details', 'bank account', 'otp', 'gift voucher',
  '100% free', '100% genuine', 'guaranteed income',
]

// ── Excessive Certainty ──────────────────────────────────────────────────────
const CERTAINTY_TERMS = [
  '100% proven', '100% confirmed', 'scientifically proven', 'doctors confirmed',
  'officially confirmed', 'absolutely true', 'undeniable proof', 'irrefutable',
  'no doubt', 'without question',
]

// ── Clickbait Patterns ───────────────────────────────────────────────────────
const CLICKBAIT_TERMS = [
  'you wont believe', 'what happened next', 'this is why', 'the reason will shock',
  'number 5 will surprise', 'doctors hate', 'one weird trick', 'they tried to hide',
]

// ── Trust-Building Signals (reduce risk) ─────────────────────────────────────
const CITATION_TERMS = [
  'according to', 'published in', 'study found', 'research shows',
  'data indicates', 'peer reviewed', 'sourced from', 'confirmed by',
  'as per', 'reported by', 'official statement', 'government data',
]

function matchTerms(text: string, terms: string[]): string[] {
  const lower = text.toLowerCase()
  return terms.filter(t => lower.includes(t))
}

/**
 * Analyzes the linguistic risk of a text.
 * Input should be the cleaned/normalized text from claimExtractor.
 */
export function analyzeLinguisticRisk(text: string): LinguisticRiskResult {
  const signals: LinguisticSignal[] = []
  let penalty = 0

  // ── Urgency ────────────────────────────────────────────────────────────────
  const urgencyMatches = matchTerms(text, URGENCY_TERMS)
  if (urgencyMatches.length > 0) {
    const p = Math.min(20, urgencyMatches.length * 7)
    penalty += p
    signals.push({
      type: 'Urgency Language',
      description: 'Text uses urgency tactics to pressure immediate sharing.',
      penalty: p,
      matched: urgencyMatches,
    })
  }

  // ── Emotional Manipulation ─────────────────────────────────────────────────
  const emotionalMatches = matchTerms(text, EMOTIONAL_TERMS)
  if (emotionalMatches.length > 0) {
    const p = Math.min(15, emotionalMatches.length * 5)
    penalty += p
    signals.push({
      type: 'Emotional Manipulation',
      description: 'Sensational language designed to trigger emotional reactions.',
      penalty: p,
      matched: emotionalMatches,
    })
  }

  // ── Conspiracy Signals ─────────────────────────────────────────────────────
  const conspiracyMatches = matchTerms(text, CONSPIRACY_TERMS)
  if (conspiracyMatches.length > 0) {
    const p = Math.min(25, conspiracyMatches.length * 10)
    penalty += p
    signals.push({
      type: 'Conspiracy Framing',
      description: 'Text uses "hidden truth" framing common in disinformation.',
      penalty: p,
      matched: conspiracyMatches,
    })
  }

  // ── Scam Patterns ─────────────────────────────────────────────────────────
  const scamMatches = matchTerms(text, SCAM_TERMS)
  if (scamMatches.length > 0) {
    const p = Math.min(30, scamMatches.length * 12)
    penalty += p
    signals.push({
      type: 'Scam Indicators',
      description: 'Patterns consistent with financial scams or phishing attempts.',
      penalty: p,
      matched: scamMatches,
    })
  }

  // ── Excessive Certainty ────────────────────────────────────────────────────
  const certaintyMatches = matchTerms(text, CERTAINTY_TERMS)
  if (certaintyMatches.length > 0) {
    const p = Math.min(10, certaintyMatches.length * 5)
    penalty += p
    signals.push({
      type: 'Excessive Certainty',
      description: 'Overclaims of proof or confirmation without cited sources.',
      penalty: p,
      matched: certaintyMatches,
    })
  }

  // ── Clickbait ──────────────────────────────────────────────────────────────
  const clickbaitMatches = matchTerms(text, CLICKBAIT_TERMS)
  if (clickbaitMatches.length > 0) {
    const p = Math.min(10, clickbaitMatches.length * 5)
    penalty += p
    signals.push({
      type: 'Clickbait Framing',
      description: 'Headline-style language designed to maximize engagement over accuracy.',
      penalty: p,
      matched: clickbaitMatches,
    })
  }

  // ── Capitalization ─────────────────────────────────────────────────────────
  const letters = text.replace(/[^A-Za-z]/g, '')
  const upperRatio = letters.length > 0 ? text.replace(/[^A-Z]/g, '').length / letters.length : 0
  if (upperRatio > 0.35) {
    const p = 8
    penalty += p
    signals.push({
      type: 'Excessive Capitalization',
      description: `${Math.round(upperRatio * 100)}% of letters are uppercase — a common signal of alarmist content.`,
      penalty: p,
      matched: [],
    })
  }

  // ── Punctuation Abuse ──────────────────────────────────────────────────────
  const exclamationCount = (text.match(/!/g) || []).length
  if (exclamationCount >= 3) {
    const p = Math.min(8, exclamationCount * 2)
    penalty += p
    signals.push({
      type: 'Punctuation Abuse',
      description: `${exclamationCount} exclamation marks detected — common in sensational content.`,
      penalty: p,
      matched: [],
    })
  }

  // ── Trust Bonuses (reduce net penalty) ────────────────────────────────────
  const citationMatches = matchTerms(text, CITATION_TERMS)
  const bonus = Math.min(20, citationMatches.length * 7)
  if (citationMatches.length > 0) {
    signals.push({
      type: 'Source Citations Present',
      description: 'Text references authoritative sources or institutions.',
      penalty: -bonus,  // Negative = bonus
      matched: citationMatches,
    })
  }

  const netPenalty = Math.max(0, penalty - bonus)
  const safetyScore = Math.max(0, Math.min(100, 100 - netPenalty))

  let riskLevel: LinguisticRiskResult['riskLevel']
  if (safetyScore >= 75) riskLevel = 'low'
  else if (safetyScore >= 50) riskLevel = 'medium'
  else if (safetyScore >= 25) riskLevel = 'high'
  else riskLevel = 'critical'

  return { safetyScore, riskLevel, signals }
}
