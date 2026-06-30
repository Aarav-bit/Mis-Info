import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2, Download,
  ChevronDown, ExternalLink, CheckCircle, XCircle, AlertCircle,
  Minus
} from 'lucide-react'
import { useVerification } from '../contexts/VerificationContext'
import { TrustScoreRing } from '../components/features/TrustScoreRing'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { MOCK_REPORTS } from '../data/mockData'
import { formatDate } from '../lib/utils'
import type { Source } from '../types'

function ReliabilityDot({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-sm text-foreground">{score}%</span>
    </div>
  )
}

export function ReportPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getReport, toggleBookmark } = useVerification()
  const [openAccordion, setOpenAccordion] = useState<string | null>('claim')

  const report = id ? (getReport(id) ?? MOCK_REPORTS.find(r => r.id === id)) : undefined

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle size={48} className="text-muted-foreground" />
        <p className="text-muted-foreground">Report not found</p>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    )
  }

  const statusVariant = report.trustScore >= 75 ? 'success' : report.trustScore >= 50 ? 'warning' : 'danger'
  const supportingSources = report.sources.filter(s => s.supportsClaim)
  const contradictingSources = report.sources.filter(s => !s.supportsClaim)

  const accordionItems = [
    { id: 'claim', title: 'Claim Extracted', content: report.claimExtracted },
    { id: 'evidence', title: 'Evidence Found', content: report.evidenceSummary },
    { id: 'why', title: 'Why this score?', content: `Trust score of ${report.trustScore}/100 based on ${report.sources.length} sources analyzed, with ${supportingSources.length} supporting and ${contradictingSources.length} contradicting the claim.` },
    { id: 'confidence', title: 'Confidence Level', content: `Overall confidence: ${report.confidence}%. The AI analysis is ${report.confidence >= 85 ? 'highly' : report.confidence >= 70 ? 'moderately' : 'somewhat'} confident in this assessment.` },
    { id: 'reasoning', title: 'Full Reasoning', content: report.reasoning },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={16} />}>Back</Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toggleBookmark(report.id)}
            leftIcon={report.bookmarked ? <BookmarkCheck size={14} className="text-primary" /> : <Bookmark size={14} />}>
            {report.bookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Share2 size={14} />}>Share</Button>
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />}>Export</Button>
        </div>
      </div>

      {/* Trust Score Hero */}
      <Card className="border-border overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 gradient-bg opacity-5" />
          <CardContent className="relative p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <TrustScoreRing score={report.trustScore} size={160} />
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
                  <Badge variant={statusVariant} className="text-sm px-3 py-1">{report.status}</Badge>
                  <Badge variant="outline">{report.topic}</Badge>
                  <Badge variant="outline">{report.inputType}</Badge>
                </div>
                <h1 className="text-xl font-bold text-foreground mb-3 leading-snug">&ldquo;{report.claim}&rdquo;</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{report.summary}</p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div><div className="text-xs text-muted-foreground">Confidence</div><div className="text-sm font-semibold text-foreground">{report.confidence}%</div></div>
                  <div><div className="text-xs text-muted-foreground">Sources</div><div className="text-sm font-semibold text-foreground">{report.sources.length} analyzed</div></div>
                  <div><div className="text-xs text-muted-foreground">Verified at</div><div className="text-sm font-semibold text-foreground">{formatDate(report.createdAt)}</div></div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Credibility Factors */}
      <Card>
        <CardHeader><CardTitle>Credibility Factors</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {report.credibilityFactors.map((factor, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {factor.impact === 'positive' ? <CheckCircle size={14} className="text-green-500" /> :
                   factor.impact === 'negative' ? <XCircle size={14} className="text-red-500" /> :
                   <Minus size={14} className="text-yellow-500" />}
                  <span className="text-sm font-medium text-foreground">{factor.name}</span>
                </div>
                <span className={`text-sm font-bold ${factor.score >= 70 ? 'text-green-500' : factor.score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>{factor.score}/100</span>
              </div>
              <Progress value={factor.score} size="sm" />
              <p className="text-xs text-muted-foreground mt-1">{factor.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Source Comparison Table */}
      <Card>
        <CardHeader><CardTitle>Source Comparison</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Source</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Reliability</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Supports</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.sources.map((source: Source) => (
                  <tr key={source.id} className="hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-foreground">{source.name}</span>
                          <a href={source.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={12} className="text-muted-foreground hover:text-primary" /></a>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{source.excerpt}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4"><ReliabilityDot score={source.reliability} /></td>
                    <td className="px-4 py-4">
                      {source.supportsClaim ? <CheckCircle size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />}
                    </td>
                    <td className="px-4 py-4"><Badge variant="outline" className="text-xs">{source.category}</Badge></td>
                    <td className="px-4 py-4"><span className="text-xs text-muted-foreground">{new Date(source.publishedAt).toLocaleDateString()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Explainability Accordion */}
      <Card>
        <CardHeader><CardTitle>Explainability Report</CardTitle></CardHeader>
        <CardContent className="p-0">
          {accordionItems.map((item) => (
            <div key={item.id} className="border-b border-border last:border-0">
              <button onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-accent/30 transition-colors">
                <span className="font-medium text-sm text-foreground">{item.title}</span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform ${openAccordion === item.id ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === item.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-6 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                </motion.div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
