/**
 * Claim Extraction Layer
 *
 * Pre-processes raw user input BEFORE any API calls are made.
 * Strips noise, normalizes text, detects claim type, and extracts
 * the core factual statement from WhatsApp-style forwarded messages.
 */

export type ClaimType = 'factual' | 'opinion' | 'question' | 'spam'

export interface ExtractedClaim {
  original: string
  cleaned: string
  normalized: string
  claimType: ClaimType
  language: string
  entities: string[]
  isSpam: boolean
}

// WhatsApp / forwarded message prefixes to strip
const FORWARD_PREFIXES = [
  /^(forwarded\s+message[:\s]*)/i,
  /^(fwd[:\s]+)/i,
  /^(share\s+this[:\s]*)/i,
  /^(please\s+share[:\s]*)/i,
  /^(must\s+read[:\s]*)/i,
  /^(breaking[:\s]*)/i,
  /^(urgent[:\s]*)/i,
  /^(important[:\s]*)/i,
]

// Spam signal patterns (strong indicators of low-credibility content)
const SPAM_PATTERNS = [
  /forward\s+(immediately|this|now)/i,
  /share\s+(with\s+all|immediately|now|everyone)/i,
  /government\s+(giving|distributing|offering)\s+[₹$]?\d+/i,
  /free\s+(money|cash|gift|iphone|laptop|prize)/i,
  /you\s+(have\s+)?(won|win)\s+(a\s+)?(prize|lottery|award)/i,
  /click\s+the\s+link\s+below/i,
  /limited\s+time\s+offer/i,
  /act\s+now/i,
  /100%\s+(free|genuine|real|guaranteed)/i,
]

// Opinion / non-factual markers
const OPINION_MARKERS = [
  /\b(i think|i believe|in my opinion|personally|i feel|seems to me|could be|might be|probably)\b/i,
]

// Question markers
const QUESTION_MARKERS = [/\?\s*$/, /^(is|are|was|were|did|does|do|can|will|would|should|has|have)\b/i]

/** Detects the likely language of the text (basic heuristic). */
function detectLanguage(text: string): string {
  if (/[\u0900-\u097F]/.test(text)) return 'hi'
  if (/[\u0600-\u06FF]/.test(text)) return 'ar'
  return 'en'
}

/** Extract named entities using simple pattern matching. */
function extractEntities(text: string): string[] {
  const entities: string[] = []

  // Dates: "August 23, 2023" / "2023-08-23"
  const dateMatches = text.match(
    /\b(\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\d{4}-\d{2}-\d{2})\b/gi
  )
  if (dateMatches) entities.push(...dateMatches)

  // Currency amounts: ₹50,000 / $1 billion
  const currencyMatches = text.match(/[₹$€£]\s*[\d,]+(?:\.\d+)?(?:\s*(?:lakh|crore|million|billion|thousand))?/gi)
  if (currencyMatches) entities.push(...currencyMatches)

  // Capitalized proper nouns
  const properNounMatches = text.match(/\b(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*|[A-Z]{2,}(?:-\d+)?)\b/g)
  if (properNounMatches) {
    const filtered = properNounMatches.filter(
      (n) => n.length > 2 && !['The', 'This', 'That', 'These', 'Those', 'From', 'With'].includes(n)
    )
    entities.push(...filtered)
  }

  return [...new Set(entities)].slice(0, 10)
}

/** Cleans raw input: removes emojis, HTML, excess whitespace, forwarded prefixes. */
function cleanText(raw: string): string {
  let text = raw

  // Strip HTML tags
  text = text.replace(/<[^>]+>/g, ' ')

  // Strip emojis and symbol Unicode blocks
  // eslint-disable-next-line no-misleading-character-class
  text = text.replace(
    /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,
    ' '
  )

  // Strip forwarded message prefixes
  for (const pattern of FORWARD_PREFIXES) {
    text = text.replace(pattern, '')
  }

  // Normalize punctuation clutter (!!!!! → !)
  text = text.replace(/([!?])\1+/g, '$1')

  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim()

  return text
}

/** Normalizes cleaned text: standardizes currency, removes trailing CTAs. */
function normalizeText(cleaned: string): string {
  let text = cleaned

  // Normalize currency spacing: ₹ 50,000 → ₹50000
  text = text.replace(/([₹$€£])\s*([\d,]+)/g, (_: string, sym: string, num: string) => `${sym}${num.replace(/,/g, '')}`)

  // Remove trailing call-to-action phrases
  text = text
    .replace(/\s*(forward\s+to\s+all|share\s+immediately|share\s+now|send\s+to\s+all)\.?$/i, '')
    .trim()

  return text
}

/** Detects the claim type from the normalized text. */
function detectClaimType(text: string): ClaimType {
  if (SPAM_PATTERNS.some((p) => p.test(text))) return 'spam'
  if (QUESTION_MARKERS.some((p) => p.test(text.trim()))) return 'question'
  if (OPINION_MARKERS.some((p) => p.test(text))) return 'opinion'
  return 'factual'
}

/**
 * Main entry point. Takes raw user input, returns a structured ExtractedClaim.
 */
export function extractClaim(raw: string): ExtractedClaim {
  const cleaned = cleanText(raw)
  const normalized = normalizeText(cleaned)
  const claimType = detectClaimType(normalized)
  const language = detectLanguage(raw)
  const entities = extractEntities(normalized)
  const isSpam = claimType === 'spam'

  return {
    original: raw,
    cleaned,
    normalized,
    claimType,
    language,
    entities,
    isSpam,
  }
}
