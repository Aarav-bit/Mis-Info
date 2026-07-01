/**
 * Evidence Retrieval Engine
 *
 * Queries multiple external evidence sources IN PARALLEL:
 *   A. Google Fact Check Tools API  — debunked rumors & fact-checker ratings
 *   B. GDELT Project News API       — real-world news coverage (no key needed)
 *
 * Unlike the Knowledge Retrieval Layer (background facts), this layer
 * targets RECENT claims, breaking news, and political misinformation
 * where Wikipedia would be out of date or absent.
 */

import { Source, CredibilityFactor, VerificationReport } from '../types'
import { generateId, getScoreStatus } from './utils'

// ── Token helpers (shared logic, isolated here to avoid circular imports) ─────
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'on', 'in', 'at', 'to', 'for', 'of', 'and', 'or',
  'is', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'this', 'that',
])

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .map((t) => {
        if (t.endsWith('s') && t.length > 3) t = t.slice(0, -1)
        if (t.endsWith('ed') && t.length > 4) t = t.slice(0, -2)
        if (t.endsWith('ing') && t.length > 5) t = t.slice(0, -3)
        return t.trim()
      })
      .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
  )
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0
  const intersection = [...a].filter((x) => b.has(x)).length
  const union = new Set([...a, ...b]).size
  return intersection / union
}

// ── Rating converter (same logic as before) ───────────────────────────────────
function ratingToScore(rating: string): number {
  const r = rating.toLowerCase()
  if (r.includes('pants on fire') || r.includes('hoax') || (r.includes('false') && !r.includes('mostly'))) return 12
  if (r.includes('mostly false') || r.includes('partly false')) return 32
  if (r.includes('misleading')) return 38
  if (r.includes('mixture') || r.includes('half') || r.includes('partly')) return 50
  if (r.includes('mostly true') || r.includes('partly true')) return 75
  if (r.includes('true') || r.includes('correct') || r.includes('verified') || r.includes('accurate')) return 93
  return 55
}

// ── A. Google Fact Check Tools API ───────────────────────────────────────────
interface FactCheckClaim {
  text: string
  claimReview: Array<{
    publisher: { name: string; site: string }
    url: string
    title: string
    reviewDate?: string
    textualRating: string
  }>
}

export interface FactCheckEvidence {
  type: 'fact-check'
  claim: string
  ratings: string[]
  publishers: string[]
  urls: string[]
  reviewDates: string[]
  avgScore: number
  jaccard: number
}

async function queryGoogleFactCheck(query: string, queryTokens: Set<string>): Promise<FactCheckEvidence | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_FACT_CHECK_API_KEY
  if (!apiKey) return null

  try {
    const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&key=${apiKey}&languageCode=en`
    const res = await fetch(url)
    if (!res.ok) return null

    const data: { claims?: FactCheckClaim[] } = await res.json()
    if (!data.claims || data.claims.length === 0) return null

    const claim = data.claims[0]
    const reviews = claim.claimReview ?? []
    if (reviews.length === 0) return null

    // Mismatch detection
    const claimTokens = tokenize(claim.text)
    const sim = jaccard(queryTokens, claimTokens)
    const mediaTerms = ['video', 'clip', 'simulation', 'animation', 'cgi', 'footage', 'image', 'photo']
    const claimHasMedia = mediaTerms.some((t) => claim.text.toLowerCase().includes(t))
    const queryHasMedia = mediaTerms.some((t) => query.toLowerCase().includes(t))
    const isMediaMismatch = claimHasMedia && !queryHasMedia

    // Subject entity mismatch
    const subjectPairs: [string, string[]][] = [
      ['china', ['india', 'chandrayaan', 'isro', 'russia', 'usa', 'america']],
      ['india', ['china', 'russia', 'usa', 'america']],
      ['russia', ['china', 'india', 'usa', 'america']],
    ]
    let subjectMismatch = false
    for (const [key, rivals] of subjectPairs) {
      const qHas = queryTokens.has(key) || [...queryTokens].some(t => rivals.some(r => t.includes(r)))
      const cHas = claimTokens.has(key)
      if (qHas && !cHas) { subjectMismatch = true; break }
      if (!qHas && cHas && rivals.some(r => queryTokens.has(r))) { subjectMismatch = true; break }
    }

    if (isMediaMismatch || subjectMismatch || sim < 0.12) return null

    const scores = reviews.map((r) => ratingToScore(r.textualRating))
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

    return {
      type: 'fact-check',
      claim: claim.text,
      ratings: reviews.map((r) => r.textualRating),
      publishers: reviews.map((r) => r.publisher.name),
      urls: reviews.map((r) => r.url),
      reviewDates: reviews.map((r) => r.reviewDate ?? new Date().toISOString()),
      avgScore,
      jaccard: sim,
    }
  } catch {
    return null
  }
}

// ── B. GDELT News API ─────────────────────────────────────────────────────────
interface GDELTArticle {
  title: string
  url: string
  domain: string
  seendatetime: string
  language: string
}

export interface NewsEvidence {
  type: 'news'
  articles: GDELTArticle[]
  sourceDomains: string[]
  jaccard: number
}

// Trusted news domain list for reliability scoring
const TRUSTED_DOMAINS = new Set([
  'reuters.com', 'bbc.com', 'bbc.co.uk', 'apnews.com', 'theguardian.com',
  'nytimes.com', 'washingtonpost.com', 'thehindu.com', 'ndtv.com',
  'timesofindia.indiatimes.com', 'hindustantimes.com', 'indianexpress.com',
  'pib.gov.in', 'pti.in', 'ani.in', 'aljazeera.com', 'dw.com',
  'economist.com', 'ft.com', 'bloomberg.com', 'wsj.com',
])

async function queryGDELT(query: string, queryTokens: Set<string>): Promise<NewsEvidence | null> {
  try {
    // GDELT Article Search API: free, no key, CORS-friendly
    const encodedQuery = encodeURIComponent(`"${query.slice(0, 100)}"`)
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodedQuery}&mode=artlist&maxrecords=10&format=json&timespan=6m`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null

    const data = await res.json()
    const articles: GDELTArticle[] = data.articles ?? []
    if (articles.length === 0) return null

    // Filter to English articles with matching titles
    const relevant = articles
      .filter((a) => a.language === 'English' && a.title)
      .filter((a) => {
        const sim = jaccard(queryTokens, tokenize(a.title))
        return sim > 0.08
      })
      .slice(0, 6)

    if (relevant.length === 0) return null

    const titleTokens = tokenize(relevant.map((a) => a.title).join(' '))
    const avgSim = jaccard(queryTokens, titleTokens)

    return {
      type: 'news',
      articles: relevant,
      sourceDomains: [...new Set(relevant.map((a) => a.domain))],
      jaccard: avgSim,
    }
  } catch {
    return null
  }
}

// ── Assemble Evidence Report ──────────────────────────────────────────────────

/**
 * Runs Google Fact Check API and GDELT News API in parallel.
 * Returns a unified VerificationReport if any evidence is found.
 */
export async function queryEvidenceEngine(
  query: string,
  inputType: 'text' | 'url' | 'screenshot'
): Promise<VerificationReport | null> {
  const queryTokens = tokenize(query)

  const [factCheck, news] = await Promise.all([
    queryGoogleFactCheck(query, queryTokens),
    queryGDELT(query, queryTokens),
  ])

  if (!factCheck && !news) return null

  const sources: Source[] = []
  const credibilityFactors: CredibilityFactor[] = []
  const summaryParts: string[] = []
  let baseScore = 55

  // ── Integrate Fact Check Evidence ────────────────────────────────────────
  if (factCheck) {
    baseScore = factCheck.avgScore
    summaryParts.push(
      `Fact-checkers (${factCheck.publishers.slice(0, 2).join(', ')}) rated this claim as: "${factCheck.ratings[0]}".`
    )
    for (let i = 0; i < factCheck.publishers.length; i++) {
      sources.push({
        id: `fc-${i}-${generateId()}`,
        name: factCheck.publishers[i],
        url: factCheck.urls[i],
        reliability: 95,
        supportsClaim: factCheck.avgScore >= 70,
        publishedAt: factCheck.reviewDates[i],
        category: 'Fact-Checker',
        excerpt: `Rated as "${factCheck.ratings[i]}" by ${factCheck.publishers[i]}.`,
      })
    }
    credibilityFactors.push({
      name: 'Independent Fact-Checkers',
      score: Math.min(99, 60 + factCheck.publishers.length * 8),
      description: `Reviewed by ${factCheck.publishers.length} fact-checking platform(s): ${factCheck.publishers.join(', ')}.`,
      impact: factCheck.avgScore >= 70 ? 'positive' : factCheck.avgScore >= 45 ? 'neutral' : 'negative',
    })
  }

  // ── Integrate News Evidence ───────────────────────────────────────────────
  if (news) {
    const trustedArticles = news.articles.filter((a) => TRUSTED_DOMAINS.has(a.domain))
    const trustedCount = trustedArticles.length

    if (!factCheck) {
      // Use news coverage as proxy for credibility when no fact-check exists
      baseScore = 60 + Math.min(25, trustedCount * 5)
    } else {
      // Boost score if news corroborates fact-checkers
      baseScore = Math.min(99, baseScore + Math.min(10, trustedCount * 3))
    }

    summaryParts.push(
      `Found ${news.articles.length} news article(s) covering this topic from: ${news.sourceDomains.slice(0, 3).join(', ')}.`
    )

    for (const article of news.articles.slice(0, 4)) {
      const isTrusted = TRUSTED_DOMAINS.has(article.domain)
      sources.push({
        id: `news-${generateId()}`,
        name: article.domain,
        url: article.url,
        reliability: isTrusted ? 88 : 65,
        supportsClaim: true,
        publishedAt: article.seendatetime,
        category: isTrusted ? 'Trusted News Outlet' : 'News Source',
        excerpt: article.title,
      })
    }

    credibilityFactors.push({
      name: 'News Coverage',
      score: Math.min(99, 50 + trustedCount * 10),
      description: trustedCount > 0
        ? `${trustedCount} trusted outlet(s) (${trustedArticles.map((a) => a.domain).slice(0, 2).join(', ')}) have covered this topic.`
        : `${news.articles.length} news source(s) cover this topic, but none are in the top-tier trusted list.`,
      impact: trustedCount >= 2 ? 'positive' : trustedCount === 1 ? 'neutral' : 'neutral',
    })
  }

  const trustScore = Math.max(10, Math.min(98, Math.round(baseScore)))
  const confidence = Math.min(95, 50 + sources.length * 5 + (factCheck ? 15 : 0))
  const status = getScoreStatus(trustScore) as VerificationReport['status']

  const summary = summaryParts.join(' ') || 'Evidence retrieved from external sources.'
  const evidenceSummary = `Evidence Retrieval Engine found: ${[factCheck ? `${factCheck.publishers.length} fact-checker(s)` : null, news ? `${news.articles.length} news article(s)` : null].filter(Boolean).join(', ')}.`
  const reasoning = factCheck
    ? `This claim has been reviewed by professional fact-checking organizations. Their aggregate rating yields a trust score of ${trustScore}/100.`
    : `No dedicated fact-checks found yet, but ${news?.articles.length ?? 0} news source(s) have reported on this topic, suggesting it has real-world coverage.`

  return {
    id: generateId(),
    claim: query.length > 150 ? query.substring(0, 150) + '…' : query,
    inputType,
    trustScore,
    status,
    confidence,
    summary,
    claimExtracted: factCheck?.claim ?? query.slice(0, 120),
    evidenceSummary,
    reasoning,
    recommendation: trustScore >= 75
      ? 'This information appears credible and can be shared responsibly.'
      : trustScore >= 50
      ? 'Exercise caution before sharing. Some evidence is conflicting.'
      : 'Do not share without further verification from official sources.',
    sources,
    credibilityFactors,
    scoreBreakdown: { sourceReliability: trustScore, evidenceAgreement: trustScore, semanticMatch: trustScore, linguisticRisk: 70, ruleEngine: 60 },
    linguisticRiskFlags: [],
    consensusData: {
      agreementRatio: sources.filter((s: { supportsClaim: boolean }) => s.supportsClaim).length / Math.max(sources.length, 1),
      totalSources: sources.length,
      supportingCount: sources.filter((s: { supportsClaim: boolean }) => s.supportsClaim).length,
      contradictingCount: sources.filter((s: { supportsClaim: boolean }) => !s.supportsClaim).length,
      tier1Count: sources.filter((s: { reliability: number }) => s.reliability >= 90).length,
      tier2Count: sources.filter((s: { reliability: number }) => s.reliability >= 70 && s.reliability < 90).length,
      tier3Count: sources.filter((s: { reliability: number }) => s.reliability < 70).length,
      conflictDetected: false,
      manualReviewFlag: false,
    },
    createdAt: new Date().toISOString(),
    bookmarked: false,
    topic: 'General',
  }
}
