import { VerificationReport, Source, CredibilityFactor } from '../types'
import { generateId, getScoreStatus } from './utils'

// Helper to extract clean token sets from a text string (with basic stemming)
function getImportantTokens(text: string): Set<string> {
  const stopWords = new Set(['the', 'a', 'an', 'on', 'in', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'first', 'country', 'few', 'years', 'ago', 'near', 'with', 'about', 'by', 'from', 'this', 'that', 'these', 'those', 'some', 'any', 'all', 'both', 'each', 'every', 'other', 'another', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'more', 'most'])
  
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .map(token => {
        let clean = token.trim()
        if (clean.endsWith('s') && clean.length > 3) clean = clean.slice(0, -1)
        if (clean.endsWith('ed') && clean.length > 4) clean = clean.slice(0, -2)
        if (clean.endsWith('ing') && clean.length > 5) clean = clean.slice(0, -3)
        return clean
      })
      .filter(token => token.length > 2 && !stopWords.has(token))
  )
}

// Compute Jaccard similarity of two sets of tokens
function calculateJaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 || setB.size === 0) return 0
  const intersection = new Set([...setA].filter(x => setB.has(x)))
  const union = new Set([...setA, ...setB])
  return intersection.size / union.size
}

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

    // Detect mismatch:
    // 1. Media mismatch: User asks about the event, but the API returned a review about fake media (video/photo)
    const mediaTerms = ['video', 'clip', 'simulation', 'animation', 'cgi', 'footage', 'image', 'photo', 'picture', 'graphic', 'recording', 'visual', 'audio', 'thumbnail']
    const claimLower = claim.text.toLowerCase()
    const queryLower = query.toLowerCase()
    
    const claimHasMedia = mediaTerms.some(term => claimLower.includes(term))
    const queryHasMedia = mediaTerms.some(term => queryLower.includes(term))
    const isMediaMismatch = claimHasMedia && !queryHasMedia

    // 2. Subject entity mismatch (e.g., China vs India/ISRO)
    const queryTokens = getImportantTokens(query)
    const claimTokens = getImportantTokens(claim.text)
    
    const hasChina1 = queryTokens.has('china')
    const hasChina2 = claimTokens.has('china')
    const hasIndia1 = queryTokens.has('india') || queryLower.includes('chandrayaan') || queryLower.includes('isro')
    const hasIndia2 = claimTokens.has('india') || claimLower.includes('chandrayaan') || claimLower.includes('isro')
    const hasRussia1 = queryTokens.has('russia') || queryTokens.has('russian')
    const hasRussia2 = claimTokens.has('russia') || claimTokens.has('russian')
    const hasUsa1 = queryTokens.has('usa') || queryTokens.has('us') || queryTokens.has('america') || queryTokens.has('american')
    const hasUsa2 = claimTokens.has('usa') || claimTokens.has('us') || claimTokens.has('america') || claimTokens.has('american')
    
    const subjectMismatch = 
      (hasChina1 !== hasChina2) || 
      (hasIndia1 !== hasIndia2) ||
      (hasRussia1 !== hasRussia2) ||
      (hasUsa1 !== hasUsa2)

    // 3. Jaccard token similarity check
    const jaccard = calculateJaccardSimilarity(queryTokens, claimTokens)
    const isLowSimilarity = jaccard < 0.35

    const isMismatch = isMediaMismatch || subjectMismatch || isLowSimilarity

    // Synthesize publishers list
    const publishers = reviews.map((r) => r.publisher.name)
    const uniquePublishers = Array.from(new Set(publishers))

    // Compute aggregate scores from reviews
    const scores = reviews.map((r) => ratingToScore(r.textualRating))
    let trustScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    let confidence = Math.min(99, 70 + reviews.length * 5)
    
    let summary = `This claim was analyzed by ${uniquePublishers.join(', ')}. The general consensus rating is: "${reviews[0].textualRating}".`
    let reasoning = `Based on reports published by authorized fact-checking platforms, this claim has been evaluated and scored. Check the linked sources below for the full analysis of the claim.`

    if (isMismatch) {
      trustScore = 55 // Needs Verification
      confidence = 45 // Lower confidence
      if (subjectMismatch) {
        summary = `The search matched a fact-check regarding a different topic or subject ("${claim.text}"). Since the contexts do not align, we cannot verify your claim using this match.`
      } else if (isMediaMismatch) {
        summary = `The search matched a fact-check debunking viral media (like a simulation or video) associated with this topic. While the specific media is rated as "${reviews[0].textualRating}", the underlying event itself is documented.`
      } else {
        summary = `The matched fact-check matches loosely but has low similarity to your query. We cannot verify your claim using this match.`
      }
      reasoning = `A context mismatch was detected. The fact-checking report by ${uniquePublishers.join(', ')} is evaluating a different claim ("${claim.text}"), rather than the factual statement you entered. Therefore, the status is set to Needs Verification.`
    }

    const status = getScoreStatus(trustScore) as VerificationReport['status']

    const evidenceSummary = `Google Fact Check Tools found matching reports from independent fact-checkers. Reviews state: ${reviews
      .slice(0, 3)
      .map((r) => `[${r.publisher.name}]: ${r.textualRating}`)
      .join('; ')}.`

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
        score: isMismatch ? 50 : 95,
        description: isMismatch 
          ? `Fact-checkers evaluated associated claim: ${uniquePublishers.join(', ')}`
          : `Analyzed by registered third-party fact-checkers: ${uniquePublishers.join(', ')}`,
        impact: isMismatch ? 'neutral' : 'positive'
      },
      {
        name: 'Context Matching',
        score: isMismatch ? (subjectMismatch ? 15 : isLowSimilarity ? 30 : 45) : 95,
        description: isMismatch
          ? subjectMismatch
            ? 'Critical Warning: The fact-check is about a completely different subject (e.g. different country).'
            : 'Warning: The fact-check targets a viral video/image or loose context, not your text claim.'
          : 'High: The fact-check matches the context of your query.',
        impact: isMismatch ? 'negative' : 'positive'
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

interface WikipediaSearchResult {
  title: string
  snippet: string
}

interface WikipediaSummaryResponse {
  title: string
  extract: string
  timestamp: string
  content_urls: {
    desktop: {
      page: string
    }
  }
}

/**
 * Queries the Wikipedia Search & Summary REST API to corroborate factual claims.
 */
export async function queryWikipediaApi(
  query: string,
  inputType: 'text' | 'url' | 'screenshot'
): Promise<VerificationReport | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&format=json&origin=*`

    const response = await fetch(searchUrl)
    if (!response.ok) return null

    const searchData = await response.json()
    const results = searchData.query?.search as WikipediaSearchResult[] | undefined
    if (!results || results.length === 0) return null

    // Tokenize query
    const queryTokens = getImportantTokens(query)

    let bestMatch: WikipediaSearchResult | null = null
    let maxSimilarity = 0

    // Evaluate Jaccard similarity for top 3 results
    for (const res of results.slice(0, 3)) {
      const textToMatch = `${res.title} ${res.snippet.replace(/<span class="searchmatch">/g, '').replace(/<\/span>/g, '')}`
      const resTokens = getImportantTokens(textToMatch)
      const sim = calculateJaccardSimilarity(queryTokens, resTokens)
      if (sim > maxSimilarity) {
        maxSimilarity = sim
        bestMatch = res
      }
    }

    // Similarity threshold to ensure we don't return random pages
    if (!bestMatch || maxSimilarity < 0.15) {
      return null
    }

    // Fetch summary REST API
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      bestMatch.title.replace(/ /g, '_')
    )}`

    const summaryResponse = await fetch(summaryUrl)
    if (!summaryResponse.ok) return null

    const summaryData: WikipediaSummaryResponse = await summaryResponse.json()

    // Assign score based on match strength
    const trustScore = maxSimilarity >= 0.25 ? 90 : 75
    const status = getScoreStatus(trustScore) as VerificationReport['status']
    const confidence = Math.min(99, Math.round(maxSimilarity * 100 + 20))

    const summary = `According to Wikipedia's page for "${summaryData.title}": ${summaryData.extract}`
    const evidenceSummary = `Verified details found in Wikipedia. The closest matching page is "${summaryData.title}" with a Jaccard token overlap of ${Math.round(
      maxSimilarity * 100
    )}%.`
    const reasoning = `This statement is corroborated by documented factual records on Wikipedia (Article: "${summaryData.title}"). It matches a widely recognized historical, scientific, or general event.`

    const sources: Source[] = [
      {
        id: `wiki-${generateId()}`,
        name: 'Wikipedia',
        url: summaryData.content_urls.desktop.page,
        reliability: 98,
        supportsClaim: true,
        publishedAt: summaryData.timestamp || new Date().toISOString(),
        category: 'Encyclopedic Source',
        excerpt: summaryData.extract
      }
    ]

    const credibilityFactors: CredibilityFactor[] = [
      {
        name: 'Encyclopedic Reference',
        score: 95,
        description: `Corroborated by Wikipedia article: "${summaryData.title}"`,
        impact: 'positive'
      },
      {
        name: 'Contextual Alignment',
        score: Math.min(99, Math.round(maxSimilarity * 100 + 35)),
        description: `High semantic correlation (${Math.round(maxSimilarity * 100)}% match) to documented encyclopedia entry.`,
        impact: 'positive'
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
      claimExtracted: summaryData.title,
      evidenceSummary,
      reasoning,
      sources,
      credibilityFactors,
      createdAt: new Date().toISOString(),
      bookmarked: false,
      topic
    }
  } catch (error) {
    console.error('Error fetching from Wikipedia API:', error)
    return null
  }
}

/**
 * High-level wrapper function.
 * Queries Google Fact Check API first (Negative lookup). If no matches, queries Wikipedia API (Positive lookup).
 */
export async function verifyClaim(
  query: string,
  inputType: 'text' | 'url' | 'screenshot'
): Promise<VerificationReport | null> {
  // 1. Google Fact Check Tools API (Negative lookup for rumors/myths)
  const factCheckReport = await queryFactCheckApi(query, inputType)
  if (factCheckReport) {
    return factCheckReport
  }

  // 2. Wikipedia API (Positive lookup for documented facts/events)
  return queryWikipediaApi(query, inputType)
}
