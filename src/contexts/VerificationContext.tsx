import React, { createContext, useContext, useState, useCallback } from 'react'
import { VerificationReport } from '../types'
import { MOCK_REPORTS } from '../data/mockData'
import { generateId, getScoreStatus } from '../lib/utils'
import { KeywordRule, findBestRuleMatch, calibrateConfidence } from '../lib/keywordScorer'
import { extractClaim } from '../lib/claimExtractor'
import { analyzeLinguisticRisk } from '../lib/linguisticRisk'
import { queryEvidenceEngine } from '../lib/evidenceRetrieval'
import { queryKnowledgeLayer } from '../lib/knowledgeRetrieval'
import { analyzeConsensus } from '../lib/consensusEngine'
import { computeTrustScore } from '../lib/trustScoreEngine'

interface VerificationContextValue {
  reports: VerificationReport[]
  currentReport: VerificationReport | null
  isAnalyzing: boolean
  analysisStep: number
  verify: (input: string, type: 'text' | 'url' | 'screenshot') => Promise<string | undefined>
  getReport: (id: string) => VerificationReport | undefined
  toggleBookmark: (id: string) => void
}

const VerificationContext = createContext<VerificationContextValue | null>(null)

interface RuleEntry {
  keywords: KeywordRule;
  specificity: number;
  report: Omit<VerificationReport, 'id' | 'claim' | 'inputType' | 'createdAt' | 'bookmarked'>;
}

const RULE_DATABASE: Map<string, RuleEntry> = new Map([
  // 1. Laptop giveaway myth
  [
    'laptop_giveaway',
    {
      keywords: {
        required: ['government', 'free', 'laptop'],
        optional: ['student', 'nationwide', 'policy', 'announce', 'education'],
        negation: ['proposal', 'plan', 'consider', 'may', 'could'],
        weight: 1.2,
      },
      specificity: 0.85,
      report: {
        trustScore: 34,
        status: 'Likely False',
        confidence: 87,
        summary: 'This claim lacks official government sources and contradicts recent budget announcements. Multiple fact-checking organizations have flagged similar stories as misinformation.',
        claimExtracted: 'The government will provide free laptops to all students in the country as part of a new educational policy.',
        evidenceSummary: 'No official government press release or budget allocation found. The Ministry of Education has not confirmed any such program. Similar claims have been debunked by 3 major fact-checking agencies.',
        reasoning: 'The claim is highly specific but lacks verifiable sources. Government announcements of this magnitude would appear in official gazettes and multiple reputable news outlets simultaneously.',
        sources: [
          {
            id: 's1',
            name: 'Ministry of Education Official',
            url: 'https://education.gov/press',
            reliability: 98,
            supportsClaim: false,
            publishedAt: '2024-01-15T10:00:00Z',
            category: 'Government',
            excerpt: 'No such program has been announced or budgeted for in the current fiscal year.'
          },
          {
            id: 's2',
            name: 'FactCheck.org',
            url: 'https://factcheck.org/laptop-claim',
            reliability: 95,
            supportsClaim: false,
            publishedAt: '2024-01-16T14:30:00Z',
            category: 'Fact-Checker',
            excerpt: 'This viral claim about free government laptops is FALSE. No such policy exists.'
          }
        ],
        credibilityFactors: [
          { name: 'Source Reliability', score: 15, description: 'Primary source is an unverified social media account', impact: 'negative' },
          { name: 'Corroboration', score: 10, description: 'No reputable outlets have confirmed the story', impact: 'negative' }
        ],
        topic: 'Politics'
      }
    }
  ],
  // 2. Dengue advisory
  [
    'dengue_advisory',
    {
      keywords: {
        required: ['who', 'dengue'],
        optional: ['advisory', 'southeast asia', 'health', 'fever', 'outbreak', 'cases', 'rise'],
        negation: ['fake', 'false', 'debunk', 'hoax'],
        weight: 1.1,
      },
      specificity: 0.9,
      report: {
        trustScore: 91,
        status: 'Verified',
        confidence: 96,
        summary: 'This claim is highly credible and verified through multiple authoritative health organizations. The WHO has indeed issued an official advisory regarding dengue fever in Southeast Asia.',
        claimExtracted: 'The World Health Organization has issued a new health advisory about dengue fever risks in Southeast Asian countries.',
        evidenceSummary: 'Official WHO press release confirmed. Multiple national health ministries have echoed the advisory. Leading epidemiologists have corroborated the data.',
        reasoning: 'The claim originates directly from the WHO official website and has been confirmed by multiple tier-1 news organizations.',
        sources: [
          {
            id: 's4',
            name: 'World Health Organization',
            url: 'https://who.int/news/dengue-advisory',
            reliability: 99,
            supportsClaim: true,
            publishedAt: '2024-01-20T09:00:00Z',
            category: 'Health Authority',
            excerpt: 'WHO issues dengue advisory for Southeast Asia as cases rise 40% year-over-year.'
          }
        ],
        credibilityFactors: [
          { name: 'Source Reliability', score: 99, description: 'Directly from WHO official channels', impact: 'positive' }
        ],
        topic: 'Health'
      }
    }
  ],
  // 3. Fuel price
  [
    'fuel_price',
    {
      keywords: {
        required: ['fuel', 'price'],
        optional: ['reduce', 'reduction', 'nationwide', 'petrol', 'diesel', '15%', 'fifteen percent', 'effective immediately'],
        negation: ['proposal', 'consider', 'review', 'plan', 'may', 'proposed'],
        weight: 1.0,
      },
      specificity: 0.7,
      report: {
        trustScore: 65,
        status: 'Needs Verification',
        confidence: 72,
        summary: 'This claim contains partially verifiable information. While some regions have reported price adjustments, the nationwide scope and exact percentage cited require further verification.',
        claimExtracted: 'Fuel prices have been reduced by 15% across all regions of the country, effective immediately.',
        evidenceSummary: 'Partial confirmation from regional boards. National petroleum authority has not made an official announcement.',
        reasoning: 'The claim has a kernel of truth but the nationwide scope and specific 15% figure are not verified by authoritative sources.',
        sources: [
          {
            id: 's7',
            name: 'National Petroleum Authority',
            url: 'https://npa.gov/prices',
            reliability: 95,
            supportsClaim: false,
            publishedAt: '2024-02-01T08:00:00Z',
            category: 'Government',
            excerpt: 'No nationwide fuel price reduction has been announced.'
          }
        ],
        credibilityFactors: [
          { name: 'Source Reliability', score: 60, description: 'Mixed signals from regional vs national authorities', impact: 'neutral' }
        ],
        topic: 'Economy'
      }
    }
  ],
  // 4. Diabetes cure
  [
    'diabetes_cure',
    {
      keywords: {
        required: ['diabetes', 'cure'],
        optional: ['type 2', 'type two', 'complete', 'proven', 'scientist', 'research', 'treatment', 'discover'],
        negation: ['remission', 'management', 'control', 'study', 'trial', 'promising', 'potential', 'early', 'phase'],
        weight: 1.3,
      },
      specificity: 0.8,
      report: {
        trustScore: 42,
        status: 'Needs Verification',
        confidence: 78,
        summary: 'While there is ongoing research in diabetes treatment, the claim of a complete cure is not supported by peer-reviewed clinical trials.',
        claimExtracted: 'Scientists have developed and proven a complete cure for Type 2 diabetes.',
        evidenceSummary: 'Ongoing research shows promising results in early-stage trials, but no completed Phase 3 trials or approvals exist.',
        reasoning: 'This claim overstates current scientific progress. No cure has been clinically proven and approved.',
        sources: [
          {
            id: 's10',
            name: 'American Diabetes Association',
            url: 'https://diabetes.org/research',
            reliability: 98,
            supportsClaim: false,
            publishedAt: '2024-01-10T00:00:00Z',
            category: 'Medical Authority',
            excerpt: 'No approved cure exists for Type 2 diabetes.'
          }
        ],
        credibilityFactors: [
          { name: 'Scientific Consensus', score: 20, description: 'Not supported by mainstream medical consensus', impact: 'negative' }
        ],
        topic: 'Health'
      }
    }
  ],
  // 5. Climate record
  [
    'climate_record',
    {
      keywords: {
        required: ['nasa', 'temperature', 'record'],
        optional: ['hottest', 'warmest', '2023', 'global', 'average', 'climate', 'giss', 'noaa'],
        negation: ['fake', 'false', 'debunk', 'hoax', 'manipulated'],
        weight: 1.0,
      },
      specificity: 0.95,
      report: {
        trustScore: 96,
        status: 'Verified',
        confidence: 99,
        summary: 'This claim is fully verified with high confidence. NASA, NOAA, and independent climate research institutions confirm that 2023 was the hottest year on record.',
        claimExtracted: 'The global average temperature in 2023 was the highest ever recorded according to NASA.',
        evidenceSummary: 'NASA GISS Surface Temperature Analysis confirms 2023 as hottest year.',
        reasoning: 'Multiple independent scientific bodies using different methodologies reached the same conclusion.',
        sources: [
          {
            id: 's11',
            name: 'NASA GISS',
            url: 'https://climate.nasa.gov/2023',
            reliability: 99,
            supportsClaim: true,
            publishedAt: '2024-01-12T00:00:00Z',
            category: 'Scientific Agency',
            excerpt: '2023 was the warmest year in NASAs 144-year record.'
          }
        ],
        credibilityFactors: [
          { name: 'Scientific Consensus', score: 99, description: 'Unanimous agreement among scientific agencies', impact: 'positive' }
        ],
        topic: 'Science'
      }
    }
  ],
  // 6. Smoking / lung cancer
  [
    'smoking_cancer',
    {
      keywords: {
        required: ['smoking', 'lung cancer'],
        optional: ['tobacco', 'cancer risk', 'cause', 'carcinogen', 'who', 'cdc', 'death'],
        negation: ['myth', 'fake', 'false', 'debunk', 'not cause'],
        weight: 1.0,
      },
      specificity: 0.98,
      report: {
        trustScore: 98,
        status: 'Verified',
        confidence: 99,
        summary: 'This claim is universally verified by global medical consensus, extensive longitudinal studies, and public health authorities. Smoking is the leading cause of lung cancer worldwide.',
        claimExtracted: 'Smoking tobacco significantly increases the risk of developing lung cancer.',
        evidenceSummary: 'Overwhelming clinical and epidemiological evidence from organizations like the WHO, CDC, and Mayo Clinic proves the direct causal link between smoking and lung cancer.',
        reasoning: 'The causal link is established through decades of peer-reviewed research showing that tobacco smoke contains over 70 known carcinogens that damage lung cells and DNA.',
        sources: [
          {
            id: 'sm1',
            name: 'World Health Organization (WHO)',
            url: 'https://who.int/news-room/fact-sheets/detail/tobacco',
            reliability: 99,
            supportsClaim: true,
            publishedAt: '2024-01-10T00:00:00Z',
            category: 'Health Authority',
            excerpt: 'Tobacco use is the single greatest cause of preventable death globally, causing over 8 million deaths per year, primarily from lung cancer.'
          },
          {
            id: 'sm2',
            name: 'Centers for Disease Control (CDC)',
            url: 'https://cdc.gov/tobacco/data_statistics/fact_sheets/health_effects',
            reliability: 99,
            supportsClaim: true,
            publishedAt: '2024-01-15T00:00:00Z',
            category: 'Health Authority',
            excerpt: 'Smoking causes about 90% of all lung cancer deaths in the United States.'
          }
        ],
        credibilityFactors: [
          { name: 'Scientific Consensus', score: 99, description: 'Unanimous consensus among global medical and scientific communities', impact: 'positive' },
          { name: 'Empirical Evidence', score: 98, description: 'Decades of clinical, laboratory, and demographic research support the link', impact: 'positive' },
          { name: 'Source Reliability', score: 99, description: 'Information verified by premium global health authorities', impact: 'positive' }
        ],
        topic: 'Health'
      }
    }
  ],
  // 7. Flat earth
  [
    'flat_earth',
    {
      keywords: {
        required: ['flat earth', 'earth is flat', 'flat-earth'],
        optional: ['flat earth theory', 'flat earth model'],
        negation: ['round', 'sphere', 'globe', 'oblate', 'satellite', 'orbit', 'nasa', 'science'],
        weight: 1.5,
      },
      specificity: 0.99,
      report: {
        trustScore: 8,
        status: 'Likely False',
        confidence: 99,
        summary: 'This claim is scientifically false and contradicts centuries of astronomical observations, satellite imagery, and physics laws.',
        claimExtracted: 'The Earth is flat rather than an oblate spheroid.',
        evidenceSummary: 'All scientific data, orbital satellite photography, space exploration logs, and gravitational physics disprove flat Earth models.',
        reasoning: 'The spherical nature of the Earth has been verified through navigation, satellite communications, lunar eclipses, and direct observation from space.',
        sources: [
          {
            id: 'fe1',
            name: 'NASA Science',
            url: 'https://science.nasa.gov/earth',
            reliability: 99,
            supportsClaim: false,
            publishedAt: '2024-01-01T00:00:00Z',
            category: 'Scientific Agency',
            excerpt: 'Satellite imagery and orbital mechanics continuously verify that the Earth is a sphere.'
          }
        ],
        credibilityFactors: [
          { name: 'Scientific Consensus', score: 5, description: 'Contradicts 100% of established scientific and physical consensus', impact: 'negative' }
        ],
        topic: 'Science'
      }
    }
  ],
  // 8. Covid breath-holding myth
  [
    'covid_breath_myth',
    {
      keywords: {
        required: ['breath', '10 second'],
        optional: ['covid', 'corona', 'coronavirus', 'prove', 'free from', 'test', 'hold'],
        negation: ['myth', 'debunk', 'false', 'who', 'not prove', 'does not'],
        weight: 1.4,
      },
      specificity: 0.9,
      report: {
        trustScore: 15,
        status: 'Likely False',
        confidence: 98,
        summary: 'Being able to hold your breath for 10 seconds or more without coughing or discomfort does not prove you are free from COVID-19.',
        claimExtracted: 'Holding your breath for 10 seconds proves you do not have COVID-19.',
        evidenceSummary: 'The WHO and medical experts have explicitly debunked this myth. The only way to confirm a diagnosis is through a laboratory test.',
        reasoning: 'Many healthy individuals infected with COVID-19 can easily hold their breath for 10 seconds, while some non-infected individuals with other lung conditions cannot.',
        sources: [
          {
            id: 'cv4',
            name: 'World Health Organization (WHO) Mythbusters',
            url: 'https://who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public/myth-busters',
            reliability: 99,
            supportsClaim: false,
            publishedAt: '2020-03-20T00:00:00Z',
            category: 'Health Authority',
            excerpt: 'Being able to hold your breath for 10 seconds or more without coughing or feeling discomfort does not mean you are free from COVID-19.'
          }
        ],
        credibilityFactors: [
          { name: 'Scientific Consensus', score: 5, description: 'Debunked by global medical associations', impact: 'negative' },
          { name: 'Methodology Validation', score: 0, description: 'The breath-holding test has zero diagnostic validity', impact: 'negative' }
        ],
        topic: 'Health'
      }
    }
  ],
  // 9. Covid saltwater gargle myth
  [
    'covid_gargle_myth',
    {
      keywords: {
        required: ['salt water', 'gargle'],
        optional: ['covid', 'corona', 'coronavirus', 'cure', 'prevent', 'protect', 'saltwater'],
        negation: ['myth', 'debunk', 'false', 'who', 'no evidence', 'not cure', 'not prevent', 'does not'],
        weight: 1.4,
      },
      specificity: 0.9,
      report: {
        trustScore: 12,
        status: 'Likely False',
        confidence: 98,
        summary: 'This claim is a widely debunked medical myth. There is no scientific evidence that gargling salt water cures or prevents COVID-19.',
        claimExtracted: 'Gargling salt water cures or prevents coronavirus infection.',
        evidenceSummary: 'The World Health Organization (WHO) and Johns Hopkins Medicine have officially stated that gargling saltwater provides no protection against COVID-19.',
        reasoning: 'Coronaviruses infect cells inside the respiratory tract. Surface treatments like salt water gargles do not reach or eliminate the virus once it has entered cells.',
        sources: [
          {
            id: 'cv1',
            name: 'World Health Organization (WHO)',
            url: 'https://who.int',
            reliability: 99,
            supportsClaim: false,
            publishedAt: '2020-03-15T00:00:00Z',
            category: 'Health Authority',
            excerpt: 'There is no evidence that regularly rinsing the nose with saline or gargling saltwater protects people from COVID-19.'
          }
        ],
        credibilityFactors: [
          { name: 'Scientific Consensus', score: 5, description: 'Contradicts 100% of global medical associations', impact: 'negative' }
        ],
        topic: 'Health'
      }
    }
  ],
  // 10. General Covid cure/prevention myth fallback
  [
    'covid_cure_myth',
    {
      keywords: {
        required: ['covid', 'cure', 'cures'],
        optional: ['coronavirus', 'corona', 'prevent', 'treatment', 'protect', 'kill', 'home remedy', 'natural', 'remedy'],
        negation: ['vaccine', 'approved', 'fda', 'who', 'clinical trial', 'antiviral', 'paxlovid'],
        weight: 1.1,
      },
      specificity: 0.7,
      report: {
        trustScore: 24,
        status: 'Likely False',
        confidence: 88,
        summary: 'Claims asserting quick home remedies or unverified cures for COVID-19 are highly likely to be misinformation.',
        claimExtracted: 'Home remedies or unverified treatments prevent or cure COVID-19.',
        evidenceSummary: 'The WHO and major medical databases confirm that only approved medical treatments, drugs, and vaccines have proven efficacy against COVID-19.',
        reasoning: 'Self-treatment claims circulate widely online but lack clinical backing and are classified as dangerous medical misinformation.',
        sources: [
          {
            id: 'cv_gen',
            name: 'World Health Organization (WHO)',
            url: 'https://who.int',
            reliability: 99,
            supportsClaim: false,
            publishedAt: '2021-01-01T00:00:00Z',
            category: 'Health Authority',
            excerpt: 'Consult your local health authority regarding approved treatments and vaccines for COVID-19.'
          }
        ],
        credibilityFactors: [
          { name: 'Scientific Consensus', score: 10, description: 'Does not align with approved medical protocols', impact: 'negative' }
        ],
        topic: 'Health'
      }
    }
  ],
  // 11. General Covid facts
  [
    'covid_facts',
    {
      keywords: {
        required: ['covid'],
        optional: ['coronavirus', 'corona', 'surveillance', 'data', 'case', 'hospital', 'update', 'tracker', 'cdc'],
        negation: ['cure', 'prevent', 'myth', 'debunk', 'fake', 'hoax'],
        weight: 0.8,
      },
      specificity: 0.5,
      report: {
        trustScore: 82,
        status: 'Verified',
        confidence: 90,
        summary: 'General information regarding COVID-19 surveillance corresponds with verified public health records.',
        claimExtracted: 'COVID-19 surveillance data or updates.',
        evidenceSummary: 'Data matches official health registry logs.',
        reasoning: 'The claim matches records from the CDC and local health department databases.',
        sources: [
          {
            id: 'cv3',
            name: 'CDC Covid Data Tracker',
            url: 'https://covid.cdc.gov',
            reliability: 99,
            supportsClaim: true,
            publishedAt: new Date().toISOString(),
            category: 'Health Authority',
            excerpt: 'Official tracking data for covid cases and hospitalizations.'
          }
        ],
        credibilityFactors: [
          { name: 'Source Reliability', score: 95, description: 'Matches official health authority data', impact: 'positive' }
        ],
        topic: 'Health'
      }
    }
  ]
]);

function buildRuleMap(): Map<string, KeywordRule> {
  const map = new Map<string, KeywordRule>()
  RULE_DATABASE.forEach((entry, id) => {
    map.set(id, entry.keywords)
  })
  return map
}

function simulateAnalysis(input: string, type: 'text' | 'url' | 'screenshot'): VerificationReport {
  const ruleMap = buildRuleMap()
  const matched = findBestRuleMatch(input, ruleMap)

  let baseReport: Omit<VerificationReport, 'id' | 'claim' | 'inputType' | 'createdAt' | 'bookmarked'>
  let confidenceOverride: number | null = null

  if (matched) {
    const entry = RULE_DATABASE.get(matched.ruleId)!
    baseReport = { ...entry.report }

    // Calibrate confidence based on match strength
    confidenceOverride = calibrateConfidence(
      matched.scoredRule.score,
      entry.specificity,
      matched.scoredRule.matchedNegation.length > 0 ? 1 : 0
    )

    // Adjust trustScore slightly upward when negation keywords forced lower confidence
    if (matched.scoredRule.matchedNegation.length > 0 && entry.report.trustScore < 50) {
      baseReport = {
        ...baseReport,
        trustScore: Math.round(entry.report.trustScore * 0.85),
      }
    }

    baseReport = {
      ...baseReport,
      status: getScoreStatus(baseReport.trustScore) as VerificationReport['status'],
    }
  } else {
    // Dynamic fallback based on text analysis
    const fallbackScore = computeFallbackScore(input)
    baseReport = {
      trustScore: fallbackScore,
      status: getScoreStatus(fallbackScore) as VerificationReport['status'],
      confidence: 65,
      summary: 'The credibility of this claim is currently undetermined. Initial cross-referencing indicates mixed or insufficient coverage in mainstream reputable sources.',
      claimExtracted: input.length > 100 ? input.substring(0, 100) + '...' : input,
      evidenceSummary: 'No direct consensus found in fact-checking databases or primary official sources. Social media chatter exists, but formal corroboration is pending.',
      reasoning: 'The claim is not verified because it lacks authoritative statements or reports from primary stakeholders. We recommend waiting for verified reporting.',
      sources: [
        {
          id: 'gen1',
          name: 'General Web Search',
          url: 'https://google.com/search?q=' + encodeURIComponent(input),
          reliability: 50,
          supportsClaim: false,
          publishedAt: new Date().toISOString(),
          category: 'Web Search',
          excerpt: 'Initial searches show discussions around the topic, but no verified reporting is present.'
        }
      ],
      credibilityFactors: [
        { name: 'Source Reliability', score: 50, description: 'Sources are general websites and social discussions, not verified outlets', impact: 'neutral' },
        { name: 'Corroboration', score: 45, description: 'No major news or fact-checking agencies have verified the claim', impact: 'neutral' },
        { name: 'Official Stance', score: 50, description: 'No official statement from relevant authorities is available', impact: 'neutral' }
      ],
      topic: 'General'
    }
  }

  return {
    ...baseReport,
    id: generateId(),
    claim: input.length > 150 ? input.substring(0, 150) + '...' : input,
    inputType: type,
    confidence: confidenceOverride ?? baseReport.confidence,
    createdAt: new Date().toISOString(),
    bookmarked: false,
  }
}

function computeFallbackScore(input: string): number {
  const lower = input.toLowerCase()
  let score = 50

  // Sensational language indicators (lower trust)
  const sensationalTerms = ['shocking', 'mind blowing', 'you wont believe', 'must see', 'share this', 'goes viral', 'everyone needs to', 'secret', 'what they dont want', 'hidden truth', 'mainstream media wont', 'they dont want you', 'wake up', 'big pharma', 'deep state', 'they are hiding']
  const sensationalCount = sensationalTerms.filter(t => lower.includes(t)).length
  score -= sensationalCount * 8

  // Emotional punctuation indicators
  const exclamationCount = (input.match(/!/g) || []).length
  const questionCount = (input.match(/\?/g) || []).length
  score -= exclamationCount * 2
  score -= questionCount * 1

  // Capitalization signals
  const upperRatio = input.replace(/[^A-Za-z]/g, '').length > 0
    ? input.replace(/[^A-Z]/g, '').length / input.replace(/[^A-Za-z]/g, '').length
    : 0
  if (upperRatio > 0.5) score -= 10

  // Source citation indicators (higher trust)
  const citationTerms = ['according to', 'published in', 'study found', 'research shows', 'data indicates', 'peer reviewed', 'sourced from', 'official', 'confirmed by']
  const citationCount = citationTerms.filter(t => lower.includes(t)).length
  score += citationCount * 6

  return Math.max(5, Math.min(95, Math.round(score)))
}

export function VerificationProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = useState<VerificationReport[]>(MOCK_REPORTS)
  const [currentReport, setCurrentReport] = useState<VerificationReport | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)

  const verify = useCallback(async (input: string, type: 'text' | 'url' | 'screenshot') => {
    setIsAnalyzing(true)
    setAnalysisStep(0)
    setCurrentReport(null)

    // ── STEP 1: Claim Extraction ──────────────────────────────────────────────
    // Run synchronously before any network calls — strips emojis, spam CTAs,
    // forwarded prefixes, and normalizes text.
    setAnalysisStep(1)
    const extracted = extractClaim(input)
    const cleanQuery = extracted.normalized || extracted.cleaned || input

    // ── STEP 2: Linguistic Risk Analysis ─────────────────────────────────────
    // Runs on the cleaned text to detect manipulation patterns, scams, clickbait.
    setAnalysisStep(2)
    const linguisticResult = analyzeLinguisticRisk(cleanQuery)

    // ── STEP 3: Parallel Evidence + Knowledge Retrieval ──────────────────────
    // Evidence Engine: Google Fact Check API + GDELT News (for recent claims)
    // Knowledge Layer: Wikipedia + Wikidata + Open Library (for documented facts)
    // Both run IN PARALLEL to minimize total latency.
    setAnalysisStep(3)
    const [evidenceReport, knowledgeReport] = await Promise.all([
      queryEvidenceEngine(cleanQuery, type),
      queryKnowledgeLayer(cleanQuery, type),
    ])

    await new Promise(resolve => setTimeout(resolve, 400)) // brief UI hold

    // ── STEP 4: Consensus Engine ──────────────────────────────────────────────
    setAnalysisStep(4)
    const allSources = [
      ...(evidenceReport?.sources ?? []),
      ...(knowledgeReport?.sources ?? []),
    ]
    const consensus = analyzeConsensus(allSources)

    // ── STEP 5: Trust Score Engine ────────────────────────────────────────────
    setAnalysisStep(5)

    // sourceReliability = WHAT reliable sources say about this claim (not how reliable they are).
    // If a fact-checker (reliability=95) says the claim is FALSE, the claim's sourceReliability
    // should be LOW (~12), not HIGH (95). evidenceReport.trustScore already encodes this correctly
    // (ratingToScore("False") ≈ 12, ratingToScore("True") ≈ 93).
    const sourceReliability = (() => {
      if (evidenceReport) return evidenceReport.trustScore          // Fact-check verdict (e.g. 12 = False, 93 = True)
      if (knowledgeReport) return knowledgeReport.trustScore        // Knowledge base corroboration
      return 0
    })()

    // Semantic match: best similarity signal from either retrieval layer
    const evidenceSemantic = evidenceReport ? 60 : 0
    const knowledgeSemantic = knowledgeReport
      ? Math.min(99, (knowledgeReport.confidence ?? 50))
      : 0
    const semanticMatch = Math.max(evidenceSemantic, knowledgeSemantic)

    // evidenceAgreement = cross-source consensus (0–100).
    // consensus.agreement is already directional: 0 = all sources oppose claim, 100 = all support.
    // confidenceBoost adjusts the displayed confidence field only — do NOT mix it into the formula.
    const evidenceAgreement = Math.max(0, Math.min(99, consensus.agreement))

    // Rule engine: fall back to local keyword database if no API reports found
    let ruleScore = 50
    if (!evidenceReport && !knowledgeReport) {
      const ruleMatch = findBestRuleMatch(cleanQuery, new Map(
        Array.from(RULE_DATABASE.entries()).map(([k, v]) => [k, v.keywords])
      ))
      if (ruleMatch) {
        const entry = RULE_DATABASE.get(ruleMatch.ruleId)
        ruleScore = entry ? entry.report.trustScore : 50
      }
    }

    const scoreResult = computeTrustScore({
      sourceReliability,
      evidenceAgreement,
      semanticMatch,
      linguisticRisk: linguisticResult.safetyScore,
      ruleEngine: ruleScore,
    })

    // ── Assemble Final Report ─────────────────────────────────────────────────
    // Merge sources and credibility factors from all layers
    const mergedSources = allSources
    const primaryReport = evidenceReport ?? knowledgeReport

    // Credibility factors: trust score breakdown + consensus + linguistic risk
    const mergedFactors = [
      ...scoreResult.breakdownFactors,
      {
        name: 'Cross-Source Consensus',
        score: Math.min(99, consensus.agreement + Math.max(0, consensus.confidenceBoost)),
        description: consensus.explanation,
        impact: consensus.verdict === 'high' ? 'positive' as const
               : consensus.verdict === 'conflict' ? 'negative' as const
               : 'neutral' as const,
      },
    ]

    // Spam fast-path: if extracted claim is spam, override score
    const finalTrustScore = extracted.isSpam
      ? Math.min(scoreResult.trustScore, 20)
      : scoreResult.trustScore

    const finalStatus = getScoreStatus(finalTrustScore) as VerificationReport['status']

    const summary = primaryReport?.summary
      ?? (extracted.isSpam
        ? 'This content shows strong indicators of spam or scam messaging.'
        : `No specific fact-checks or knowledge base entries found. Trust score based on linguistic analysis. ${consensus.explanation}`)

    const report: VerificationReport = {
      id: generateId(),
      claim: cleanQuery.length > 150 ? cleanQuery.substring(0, 150) + '…' : cleanQuery,
      inputType: type,
      trustScore: finalTrustScore,
      status: finalStatus,
      confidence: Math.min(95, scoreResult.confidence + (primaryReport ? 10 : 0)),
      summary,
      claimExtracted: (primaryReport?.claimExtracted ?? extracted.entities.join(', ')) || cleanQuery.slice(0, 80),
      evidenceSummary: primaryReport?.evidenceSummary
        ?? `Linguistic Risk: ${linguisticResult.riskLevel.toUpperCase()}. No external evidence sources matched this claim.`,
      reasoning: scoreResult.explanation + (consensus.flagForReview ? ' ⚠️ Manual review recommended due to conflicting sources.' : ''),
      sources: mergedSources,
      credibilityFactors: mergedFactors,
      scoreBreakdown: scoreResult.breakdown,
      createdAt: new Date().toISOString(),
      bookmarked: false,
      topic: primaryReport?.topic ?? 'General',
    }

    setCurrentReport(report)
    setReports(prev => [report, ...prev])
    setIsAnalyzing(false)
    setAnalysisStep(0)
    return report.id
  }, [])

  const getReport = useCallback((id: string) => {
    return reports.find(r => r.id === id)
  }, [reports])

  const toggleBookmark = useCallback((id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, bookmarked: !r.bookmarked } : r))
  }, [])

  return (
    <VerificationContext.Provider value={{ reports, currentReport, isAnalyzing, analysisStep, verify, getReport, toggleBookmark }}>
      {children}
    </VerificationContext.Provider>
  )
}

export function useVerification() {
  const ctx = useContext(VerificationContext)
  if (!ctx) throw new Error('useVerification must be used within VerificationProvider')
  return ctx
}
