import { VerificationReport, Source, CredibilityFactor } from '../types'
import { generateId, getScoreStatus } from './utils'

// Helper to guess the topic category of a claim
function guessTopic(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('health') || t.includes('covid') || t.includes('virus') || t.includes('vaccine') || t.includes('medical') || t.includes('doctor') || t.includes('dengue')) return 'Health'
  if (t.includes('election') || t.includes('government') || t.includes('senate') || t.includes('president') || t.includes('policy') || t.includes('vote') || t.includes('laptop')) return 'Politics'
  if (t.includes('climate') || t.includes('weather') || t.includes('carbon') || t.includes('earth') || t.includes('nasa') || t.includes('temperature')) return 'Science'
  if (t.includes('economy') || t.includes('price') || t.includes('tax') || t.includes('inflation') || t.includes('budget') || t.includes('money') || t.includes('fuel')) return 'Economy'
  return 'General'
}

// Convert textual ratings into numeric trust scores
function ratingToScore(rating: string): number {
  const r = rating.toLowerCase()
  
  // Standard negative ratings
  if (
    r.includes('false') ||
    r.includes('incorrect') ||
    r.includes('fake') ||
    r.includes('pants on fire') ||
    r.includes('debunk') ||
    r.includes('untrue') ||
    r.includes('hoax') ||
    r.includes('misleading')
  ) {
    if (r.includes('mostly false') || r.includes('partly false') || r.includes('misleading')) {
      return 35
    }
    return 15
  }
  
  // Standard positive ratings
  if (
    r.includes('true') ||
    r.includes('correct') ||
    r.includes('accurate') ||
    r.includes('verified')
  ) {
    if (r.includes('mostly true') || r.includes('partly true')) {
      return 75
    }
    return 95
  }
  
  // Neutral/Mixed ratings
  if (
    r.includes('mixture') ||
    r.includes('half true') ||
    r.includes('partly') ||
    r.includes('undetermined') ||
    r.includes('unverified')
  ) {
    return 50
  }
  
  return 55 // Default neutral score
}

// Check if the source's rating is positive (meaning it corroborates that the claim is true)
function isRatingPositive(rating: string): boolean {
  return ratingToScore(rating) >= 70
}

interface FactCheckClaim {
  text: string
  claimant?: string
  claimDate?: string
  claimReview: Array<{
    publisher: {
      name: string
      site: string
    }
    url: string
    title: string
    reviewDate?: string
    textualRating: string
    languageCode: string
  }>
}

interface FactCheckResponse {
  claims?: FactCheckClaim[]
}

/**
 * Queries the Google Fact Check Tools API for a given claim.
 * Returns a mapped VerificationReport if results are found, or null if no results match.
 */
export async function queryFactCheckApi(
  query: string,
  inputType: 'text' | 'url' | 'screenshot'
): Promise<VerificationReport | null> {
  const apiKey = import.meta.env.VITE_GOOGLE_FACT_CHECK_API_KEY
  
  // Safe fallback if key is not configured
  if (!apiKey) {
    return null
  }

  try {
    const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(
      query
    )}&key=${apiKey}&languageCode=en`

    const response = await fetch(url)
    if (!response.ok) {
      console.warn('Google Fact Check Tools API request failed with status:', response.status)
      return null
    }

    const data: FactCheckResponse = await response.json()
    if (!data.claims || data.claims.length === 0) {
      return null
    }

    // Select the most relevant claim entry
    const claim = data.claims[0]
    const reviews = claim.claimReview || []
    
    if (reviews.length === 0) {
      return null
    }

    // Compute aggregate scores from reviews
    const scores = reviews.map((r) => ratingToScore(r.textualRating))
    const trustScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const status = getScoreStatus(trustScore) as VerificationReport['status']
    const confidence = Math.min(99, 70 + reviews.length * 5)

    // Synthesize summaries
    const publishers = reviews.map((r) => r.publisher.name)
    const uniquePublishers = Array.from(new Set(publishers))
    
    const summary = `This claim was analyzed by ${uniquePublishers.join(', ')}. The general consensus rating is: "${reviews[0].textualRating}".`
    const evidenceSummary = `Google Fact Check Tools found matching reports from independent fact-checkers. Reviews state: ${reviews
      .slice(0, 3)
      .map((r) => `[${r.publisher.name}]: ${r.textualRating}`)
      .join('; ')}.`
    const reasoning = `Based on reports published by authorized fact-checking platforms, this claim has been evaluated and scored. Check the linked sources below for the full analysis of the claim.`

    // Map claim reviews to Source format
    const sources: Source[] = reviews.map((r, i) => ({
      id: `gfc-${i}-${generateId()}`,
      name: r.publisher.name,
      url: r.url,
      reliability: 95,
      supportsClaim: isRatingPositive(r.textualRating),
      publishedAt: r.reviewDate || new Date().toISOString(),
      category: 'Fact-Checker',
      excerpt: r.title || `Fact-check evaluation from ${r.publisher.name}.`
    }))

    // Build credibility factors
    const credibilityFactors: CredibilityFactor[] = [
      {
        name: 'Independent Verification',
        score: 95,
        description: `Analyzed by registered third-party fact-checkers: ${uniquePublishers.join(', ')}`,
        impact: 'positive'
      },
      {
        name: 'Consensus Rating',
        score: trustScore >= 70 || trustScore <= 35 ? 90 : 50,
        description:
          trustScore >= 70
            ? 'The fact-checking sources agree that the claim is verified.'
            : trustScore <= 35
            ? 'The fact-checking sources agree that the claim is false.'
            : 'Reviews show mixed evaluations or are pending definitive consensus.',
        impact: trustScore >= 70 ? 'positive' : trustScore <= 35 ? 'negative' : 'neutral'
      }
    ]

    const topic = guessTopic(query)

    return {
      id: generateId(),
      claim: query.length > 150 ? query.substring(0, 150) + '...' : query,
      inputType,
      trustScore,
      status,
      confidence,
      summary,
      claimExtracted: claim.text,
      evidenceSummary,
      reasoning,
      sources,
      credibilityFactors,
      createdAt: new Date().toISOString(),
      bookmarked: false,
      topic
    }
  } catch (error) {
    console.error('Error fetching from Google Fact Check API:', error)
    return null
  }
}
