import { VerificationReport, DailyVerification, TopicStat } from '../types'

export const MOCK_REPORTS: VerificationReport[] = [
  {
    id: 'rep-001',
    claim: 'Government announces free laptops for every student nationwide',
    inputType: 'text',
    trustScore: 34,
    status: 'Likely False',
    confidence: 87,
    summary: 'This claim lacks official government sources and contradicts recent budget announcements. Multiple fact-checking organizations have flagged similar stories as misinformation.',
    claimExtracted: 'The government will provide free laptops to all students in the country as part of a new educational policy.',
    evidenceSummary: 'No official government press release or budget allocation found. The Ministry of Education has not confirmed any such program. Similar claims have been debunked by 3 major fact-checking agencies.',
    reasoning: 'The claim is highly specific but lacks verifiable sources. Government announcements of this magnitude would appear in official gazettes and multiple reputable news outlets simultaneously. The story originated from a single unverified social media account with a history of spreading misinformation.',
    recommendation: 'Do not share this claim. Verify directly with official government channels before treating as factual. The sensational framing and lack of official confirmation strongly suggest this is misinformation.',
    sources: [
      {
        id: 's1',
        name: 'Ministry of Education',
        url: 'https://education.gov/press',
        reliability: 98,
        supportsClaim: false,
        publishedAt: '2024-01-15T10:00:00Z',
        category: 'Government',
        excerpt: 'No such program has been announced or budgeted for in the current fiscal year.',
        tier: 1
      },
      {
        id: 's2',
        name: 'FactCheck.org',
        url: 'https://factcheck.org/laptop-claim',
        reliability: 95,
        supportsClaim: false,
        publishedAt: '2024-01-16T14:30:00Z',
        category: 'Fact-Checker',
        excerpt: 'This viral claim about free government laptops is FALSE. No such policy exists.',
        tier: 2
      },
      {
        id: 's3',
        name: 'Viral Social Post',
        url: 'https://twitter.com/example',
        reliability: 12,
        supportsClaim: true,
        publishedAt: '2024-01-14T08:00:00Z',
        category: 'Social Media',
        excerpt: 'Breaking: Government to give FREE laptops to ALL students! Share this!',
        tier: 3
      }
    ],
    credibilityFactors: [
      { name: 'Source Reliability', score: 15, description: 'Primary source is an unverified social media account', impact: 'negative' },
      { name: 'Corroboration', score: 10, description: 'No reputable outlets have confirmed the story', impact: 'negative' },
      { name: 'Official Confirmation', score: 5, description: 'Government has explicitly denied the claim', impact: 'negative' },
      { name: 'Historical Accuracy', score: 40, description: 'Similar past claims were found to be false', impact: 'negative' },
      { name: 'Linguistic Analysis', score: 35, description: 'Sensational language typical of misinformation', impact: 'negative' }
    ],
    scoreBreakdown: {
      sourceReliability: 18,
      evidenceAgreement: 12,
      semanticMatch: 45,
      linguisticRisk: 25,
      ruleEngine: 30
    },
    linguisticRiskFlags: [
      { label: 'Clickbait Language', score: 88, detected: true, description: 'Headline uses all-caps and exclamation marks typical of viral misinformation' },
      { label: 'Urgency Signals', score: 72, detected: true, description: 'Phrase "effective immediately" creates false sense of urgency' },
      { label: 'Emotional Manipulation', score: 65, detected: true, description: 'Appeals to financial benefit without citing credible authority' },
      { label: 'Scam Patterns', score: 58, detected: true, description: 'Matches known government impersonation scam templates' },
      { label: 'Capitalization Abuse', score: 80, detected: true, description: 'Excessive capital letters used to amplify perceived importance' },
      { label: 'Excessive Certainty', score: 70, detected: true, description: 'Absolute claims ("every student", "nationwide") without qualifying language' }
    ],
    consensusData: {
      agreementRatio: 0.15,
      totalSources: 3,
      supportingCount: 1,
      contradictingCount: 2,
      tier1Count: 1,
      tier2Count: 1,
      tier3Count: 1,
      conflictDetected: true,
      manualReviewFlag: false
    },
    createdAt: '2024-01-16T15:00:00Z',
    bookmarked: true,
    topic: 'Politics'
  },
  {
    id: 'rep-002',
    claim: 'WHO releases new dengue advisory for Southeast Asian countries',
    inputType: 'url',
    trustScore: 91,
    status: 'Verified',
    confidence: 96,
    summary: 'This claim is highly credible and verified through multiple authoritative health organizations. The WHO has indeed issued an official advisory regarding dengue fever in Southeast Asia.',
    claimExtracted: 'The World Health Organization has issued a new health advisory about dengue fever risks in Southeast Asian countries.',
    evidenceSummary: 'Official WHO press release confirmed. Multiple national health ministries have echoed the advisory. Leading epidemiologists have corroborated the data. Reuters, AP, and BBC have all reported on the advisory.',
    reasoning: 'The claim originates directly from the WHO official website and has been confirmed by multiple tier-1 news organizations. The epidemiological data cited in the advisory is consistent with peer-reviewed research published in The Lancet.',
    recommendation: 'This information is credible and can be safely shared. Reference the official WHO page for the most up-to-date guidance. Residents of the identified regions should follow the advisory\'s preventive measures.',
    sources: [
      {
        id: 's4',
        name: 'World Health Organization',
        url: 'https://who.int/news/dengue-advisory',
        reliability: 99,
        supportsClaim: true,
        publishedAt: '2024-01-20T09:00:00Z',
        category: 'Health Authority',
        excerpt: 'WHO issues dengue advisory for Southeast Asia as cases rise 40% year-over-year.',
        tier: 1
      },
      {
        id: 's5',
        name: 'Reuters Health',
        url: 'https://reuters.com/health/dengue',
        reliability: 97,
        supportsClaim: true,
        publishedAt: '2024-01-20T11:00:00Z',
        category: 'News Agency',
        excerpt: 'WHO warns of increased dengue risk across Southeast Asia, urging preventive measures.',
        tier: 1
      },
      {
        id: 's6',
        name: 'The Lancet',
        url: 'https://thelancet.com/dengue-2024',
        reliability: 99,
        supportsClaim: true,
        publishedAt: '2024-01-18T00:00:00Z',
        category: 'Scientific Journal',
        excerpt: 'Recent surveillance data indicates elevated dengue transmission in tropical regions.',
        tier: 2
      }
    ],
    credibilityFactors: [
      { name: 'Source Reliability', score: 99, description: 'Directly from WHO official channels', impact: 'positive' },
      { name: 'Corroboration', score: 95, description: 'Confirmed by 8+ reputable news organizations', impact: 'positive' },
      { name: 'Scientific Backing', score: 92, description: 'Consistent with peer-reviewed epidemiological research', impact: 'positive' },
      { name: 'Timeliness', score: 88, description: 'Information is current and up-to-date', impact: 'positive' },
      { name: 'Official Channels', score: 98, description: 'Published through official WHO press release system', impact: 'positive' }
    ],
    scoreBreakdown: {
      sourceReliability: 97,
      evidenceAgreement: 95,
      semanticMatch: 92,
      linguisticRisk: 88,
      ruleEngine: 90
    },
    linguisticRiskFlags: [
      { label: 'Clickbait Language', score: 5, detected: false, description: 'No sensational language detected in official advisory' },
      { label: 'Urgency Signals', score: 20, detected: false, description: 'Appropriate advisory tone without manufactured urgency' },
      { label: 'Emotional Manipulation', score: 8, detected: false, description: 'Factual, clinical language throughout' },
      { label: 'Scam Patterns', score: 2, detected: false, description: 'Content matches official health advisory templates' },
      { label: 'Capitalization Abuse', score: 3, detected: false, description: 'Standard sentence case used throughout' },
      { label: 'Excessive Certainty', score: 15, detected: false, description: 'Appropriate hedging language used ("increased risk", "advisory")' }
    ],
    consensusData: {
      agreementRatio: 0.97,
      totalSources: 3,
      supportingCount: 3,
      contradictingCount: 0,
      tier1Count: 2,
      tier2Count: 1,
      tier3Count: 0,
      conflictDetected: false,
      manualReviewFlag: false
    },
    createdAt: '2024-01-20T12:00:00Z',
    bookmarked: false,
    topic: 'Health'
  },
  {
    id: 'rep-003',
    claim: 'Fuel prices reduced nationwide by 15% effective immediately',
    inputType: 'text',
    trustScore: 65,
    status: 'Needs Verification',
    confidence: 72,
    summary: 'This claim contains partially verifiable information. While some regions have reported price adjustments, the nationwide scope and exact percentage cited require further verification from official petroleum authority sources.',
    claimExtracted: 'Fuel prices have been reduced by 15% across all regions of the country, effective immediately.',
    evidenceSummary: 'Partial confirmation from 2 regional petroleum boards. National petroleum authority has not made an official announcement. Some states report reduction, others show no change.',
    reasoning: 'The claim has a kernel of truth — some regions have implemented fuel price adjustments — but the nationwide scope and specific 15% figure are not verified by authoritative sources.',
    recommendation: 'Exercise caution before sharing. Verify with your local petroleum authority or government energy ministry. The nationwide scope and exact percentage appear to be exaggerated. Partial price adjustments in some regions may be accurate.',
    sources: [
      {
        id: 's7',
        name: 'National Petroleum Authority',
        url: 'https://npa.gov/prices',
        reliability: 95,
        supportsClaim: false,
        publishedAt: '2024-02-01T08:00:00Z',
        category: 'Government',
        excerpt: 'No nationwide fuel price reduction has been announced. Regional adjustments are under review.',
        tier: 1
      },
      {
        id: 's8',
        name: 'Economic Times',
        url: 'https://economictimes.com/fuel',
        reliability: 88,
        supportsClaim: false,
        publishedAt: '2024-02-02T09:00:00Z',
        category: 'Financial News',
        excerpt: 'Reports of fuel price cuts are unverified. Markets await official announcement.',
        tier: 2
      },
      {
        id: 's9',
        name: 'Regional Petroleum Board',
        url: 'https://rpb.gov/update',
        reliability: 82,
        supportsClaim: true,
        publishedAt: '2024-02-01T07:00:00Z',
        category: 'Regional Authority',
        excerpt: 'State-level fuel adjustments implemented in response to global oil prices.',
        tier: 2
      }
    ],
    credibilityFactors: [
      { name: 'Source Reliability', score: 60, description: 'Mixed signals from regional vs national authorities', impact: 'neutral' },
      { name: 'Claim Specificity', score: 45, description: 'The 15% figure lacks official confirmation', impact: 'negative' },
      { name: 'Partial Truth', score: 70, description: 'Some regional price adjustments are confirmed', impact: 'positive' },
      { name: 'Official Stance', score: 50, description: 'National authority has not confirmed nationwide reduction', impact: 'negative' },
      { name: 'Market Signals', score: 65, description: 'Global oil prices are trending downward', impact: 'positive' }
    ],
    scoreBreakdown: {
      sourceReliability: 62,
      evidenceAgreement: 45,
      semanticMatch: 68,
      linguisticRisk: 55,
      ruleEngine: 60
    },
    linguisticRiskFlags: [
      { label: 'Clickbait Language', score: 42, detected: false, description: 'Moderate urgency language but within normal reporting range' },
      { label: 'Urgency Signals', score: 65, detected: true, description: '"Effective immediately" creates pressure to believe without verification' },
      { label: 'Emotional Manipulation', score: 35, detected: false, description: 'Financial framing present but not overtly manipulative' },
      { label: 'Scam Patterns', score: 20, detected: false, description: 'No known scam template match detected' },
      { label: 'Capitalization Abuse', score: 15, detected: false, description: 'Normal capitalization used' },
      { label: 'Excessive Certainty', score: 60, detected: true, description: '"Nationwide" and "15%" are overly precise claims without official backing' }
    ],
    consensusData: {
      agreementRatio: 0.33,
      totalSources: 3,
      supportingCount: 1,
      contradictingCount: 2,
      tier1Count: 1,
      tier2Count: 2,
      tier3Count: 0,
      conflictDetected: true,
      manualReviewFlag: true
    },
    createdAt: '2024-02-02T10:00:00Z',
    bookmarked: true,
    topic: 'Economy'
  },
  {
    id: 'rep-004',
    claim: 'Scientists discover new treatment that cures type 2 diabetes completely',
    inputType: 'text',
    trustScore: 42,
    status: 'Needs Verification',
    confidence: 78,
    summary: 'While there is ongoing research in diabetes treatment, the claim of a complete cure is not supported by peer-reviewed clinical trials. Promising research exists but has not reached the clinical stage.',
    claimExtracted: 'Scientists have developed and proven a complete cure for Type 2 diabetes.',
    evidenceSummary: 'Ongoing research at 3 universities shows promising results in early-stage trials. No completed Phase 3 clinical trials exist for a complete cure. Medical associations have not endorsed any such cure.',
    reasoning: 'This claim overstates current scientific progress. While there is genuine research into remission through lifestyle interventions, no cure has been clinically proven and approved.',
    recommendation: 'Do not treat this as confirmed medical information. Consult a healthcare professional for diabetes management. Monitor peer-reviewed journals for future updates on clinical trial results.',
    sources: [
      {
        id: 's10',
        name: 'American Diabetes Association',
        url: 'https://diabetes.org/research',
        reliability: 98,
        supportsClaim: false,
        publishedAt: '2024-01-10T00:00:00Z',
        category: 'Medical Authority',
        excerpt: 'No approved cure exists for Type 2 diabetes. Research is ongoing into remission strategies.',
        tier: 1
      }
    ],
    credibilityFactors: [
      { name: 'Scientific Consensus', score: 20, description: 'Not supported by mainstream medical consensus', impact: 'negative' },
      { name: 'Research Backing', score: 55, description: 'Preliminary research exists but is not conclusive', impact: 'neutral' },
      { name: 'Peer Review', score: 30, description: 'No peer-reviewed cure studies published', impact: 'negative' }
    ],
    scoreBreakdown: {
      sourceReliability: 40,
      evidenceAgreement: 20,
      semanticMatch: 55,
      linguisticRisk: 38,
      ruleEngine: 45
    },
    linguisticRiskFlags: [
      { label: 'Clickbait Language', score: 75, detected: true, description: '"Completely cures" is an absolute medical claim with no qualifier' },
      { label: 'Urgency Signals', score: 30, detected: false, description: 'No artificial urgency detected' },
      { label: 'Emotional Manipulation', score: 68, detected: true, description: 'Targets vulnerable population (diabetes patients) with false hope' },
      { label: 'Scam Patterns', score: 45, detected: false, description: 'Low scam pattern match, appears to be overclaiming rather than fraud' },
      { label: 'Capitalization Abuse', score: 10, detected: false, description: 'Normal capitalization' },
      { label: 'Excessive Certainty', score: 82, detected: true, description: '"Completely cures" and "discover" make absolute claims not supported by data' }
    ],
    consensusData: {
      agreementRatio: 0.0,
      totalSources: 1,
      supportingCount: 0,
      contradictingCount: 1,
      tier1Count: 1,
      tier2Count: 0,
      tier3Count: 0,
      conflictDetected: false,
      manualReviewFlag: true
    },
    createdAt: '2024-01-25T09:00:00Z',
    bookmarked: false,
    topic: 'Health'
  },
  {
    id: 'rep-005',
    claim: 'Global average temperature reaches record high in 2023 according to NASA data',
    inputType: 'url',
    trustScore: 96,
    status: 'Verified',
    confidence: 99,
    summary: 'This claim is fully verified with high confidence. NASA, NOAA, and multiple independent climate research institutions confirm that 2023 was the hottest year on record.',
    claimExtracted: 'The global average temperature in 2023 was the highest ever recorded according to NASA.',
    evidenceSummary: 'NASA GISS Surface Temperature Analysis confirms 2023 as hottest year. NOAA data corroborates. European Centre for Medium-Range Weather Forecasts (ECMWF) also confirms. Peer-reviewed studies published in Science and Nature.',
    reasoning: 'Multiple independent scientific bodies using different methodologies all reached the same conclusion. The data is transparent, reproducible, and has been subjected to rigorous peer review.',
    recommendation: 'This is confirmed, peer-reviewed scientific data from multiple independent agencies. Safe to cite in academic, journalistic, or professional contexts with attribution to NASA GISS and NOAA.',
    sources: [
      {
        id: 's11',
        name: 'NASA GISS',
        url: 'https://climate.nasa.gov/2023',
        reliability: 99,
        supportsClaim: true,
        publishedAt: '2024-01-12T00:00:00Z',
        category: 'Scientific Agency',
        excerpt: '2023 was the warmest year in NASA\'s 144-year record by a wide margin.',
        tier: 1
      },
      {
        id: 's12',
        name: 'NOAA Climate',
        url: 'https://noaa.gov/climate/2023',
        reliability: 99,
        supportsClaim: true,
        publishedAt: '2024-01-12T00:00:00Z',
        category: 'Scientific Agency',
        excerpt: 'Global surface temperature in 2023 was 1.45°C above the 20th century average.',
        tier: 1
      }
    ],
    credibilityFactors: [
      { name: 'Scientific Consensus', score: 99, description: 'Unanimous agreement among scientific agencies', impact: 'positive' },
      { name: 'Data Transparency', score: 98, description: 'Raw data publicly available for independent verification', impact: 'positive' },
      { name: 'Peer Review', score: 97, description: 'Published in top peer-reviewed journals', impact: 'positive' }
    ],
    scoreBreakdown: {
      sourceReliability: 99,
      evidenceAgreement: 98,
      semanticMatch: 96,
      linguisticRisk: 95,
      ruleEngine: 97
    },
    linguisticRiskFlags: [
      { label: 'Clickbait Language', score: 5, detected: false, description: 'Precise, factual language consistent with scientific reporting' },
      { label: 'Urgency Signals', score: 8, detected: false, description: 'No artificial urgency; factual statement of record' },
      { label: 'Emotional Manipulation', score: 10, detected: false, description: 'Data-driven claim with no emotional language' },
      { label: 'Scam Patterns', score: 2, detected: false, description: 'No scam indicators detected' },
      { label: 'Capitalization Abuse', score: 3, detected: false, description: 'Standard capitalization throughout' },
      { label: 'Excessive Certainty', score: 12, detected: false, description: 'Certainty is appropriate given the strength of scientific evidence' }
    ],
    consensusData: {
      agreementRatio: 1.0,
      totalSources: 2,
      supportingCount: 2,
      contradictingCount: 0,
      tier1Count: 2,
      tier2Count: 0,
      tier3Count: 0,
      conflictDetected: false,
      manualReviewFlag: false
    },
    createdAt: '2024-01-20T08:00:00Z',
    bookmarked: true,
    topic: 'Science'
  }
]

export const DAILY_VERIFICATIONS: DailyVerification[] = [
  { date: 'Jan 14', count: 45, verified: 18, false: 15, uncertain: 12 },
  { date: 'Jan 15', count: 62, verified: 28, false: 20, uncertain: 14 },
  { date: 'Jan 16', count: 38, verified: 15, false: 10, uncertain: 13 },
  { date: 'Jan 17', count: 71, verified: 35, false: 22, uncertain: 14 },
  { date: 'Jan 18', count: 55, verified: 25, false: 18, uncertain: 12 },
  { date: 'Jan 19', count: 89, verified: 42, false: 28, uncertain: 19 },
  { date: 'Jan 20', count: 103, verified: 58, false: 30, uncertain: 15 },
  { date: 'Jan 21', count: 87, verified: 44, false: 25, uncertain: 18 },
  { date: 'Jan 22', count: 115, verified: 62, false: 32, uncertain: 21 },
  { date: 'Jan 23', count: 98, verified: 51, false: 28, uncertain: 19 },
  { date: 'Jan 24', count: 124, verified: 70, false: 35, uncertain: 19 },
  { date: 'Jan 25', count: 142, verified: 84, false: 38, uncertain: 20 },
]

export const TOPIC_STATS: TopicStat[] = [
  { topic: 'Politics', count: 342, avgScore: 48 },
  { topic: 'Health', count: 289, avgScore: 72 },
  { topic: 'Economy', count: 215, avgScore: 61 },
  { topic: 'Science', count: 178, avgScore: 84 },
  { topic: 'Technology', count: 156, avgScore: 69 },
  { topic: 'Sports', count: 98, avgScore: 79 },
]

export const SCORE_DISTRIBUTION = [
  { range: '0-20', count: 45, label: 'Clearly False' },
  { range: '21-40', count: 89, label: 'Likely False' },
  { range: '41-60', count: 134, label: 'Uncertain' },
  { range: '61-80', count: 198, label: 'Credible' },
  { range: '81-100', count: 156, label: 'Verified' },
]

export const PIPELINE_STEPS = [
  { id: 1, label: 'Claim Extraction', icon: 'search', duration: 800 },
  { id: 2, label: 'Linguistic Risk Analysis', icon: 'alert-triangle', duration: 900 },
  { id: 3, label: 'Evidence Retrieval', icon: 'globe', duration: 1200 },
  { id: 4, label: 'Consensus Engine', icon: 'layers', duration: 1000 },
  { id: 5, label: 'Trust Score Engine', icon: 'bar-chart', duration: 600 },
]
