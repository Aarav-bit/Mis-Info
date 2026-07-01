import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2, Download,
  ChevronDown, ExternalLink, CheckCircle, XCircle, AlertCircle,
  Minus, Sparkles, Shield, Globe
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
      <span className="text-xs font-mono text-[#E6F3F5]">{score}%</span>
    </div>
  )
}

export function ReportPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getReport, toggleBookmark } = useVerification()
  const [openAccordion, setOpenAccordion] = useState<string | null>('decomp')

  const report = id ? (getReport(id) ?? MOCK_REPORTS.find(r => r.id === id)) : undefined

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-[#072e33]/25 border border-white/5 rounded-xl p-8 max-w-md mx-auto mt-12">
        <AlertCircle size={48} className="text-[#6DA5C0]" />
        <p className="text-[#E6F3F5] font-mono text-sm">Report not found</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-2 font-mono text-xs uppercase tracking-wider">Back to Workspace</Button>
      </div>
    )
  }

  const statusVariant = report.trustScore >= 75 ? 'success' : report.trustScore >= 50 ? 'warning' : 'danger'
  const scoreTextColor = report.trustScore >= 75 ? 'text-green-400' : report.trustScore >= 50 ? 'text-yellow-400' : 'text-red-400'
  const supportingSources = report.sources.filter(s => s.supportsClaim)
  const contradictingSources = report.sources.filter(s => !s.supportsClaim)

  const accordionItems = [
    { id: 'decomp', title: 'Claim Decomposition', content: report.claimExtracted },
    { id: 'evidence', title: 'Evidence Corroboration', content: report.evidenceSummary },
    { id: 'why', title: 'Consensus Calibration', content: `Consensus index of ${report.trustScore}% established via ${report.sources.length} nodes: ${supportingSources.length} supporting and ${contradictingSources.length} contradicting the target assertion.` },
    { id: 'confidence', title: 'AI Reasoning Path', content: report.reasoning },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6 py-6">
      
      {/* Report Toolbars */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft size={16} />}
            className="text-[#6DA5C0] hover:text-white font-mono text-xs uppercase tracking-wider"
          >
            Return
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleBookmark(report.id)}
            leftIcon={report.bookmarked ? <BookmarkCheck size={14} className="text-[#0F969C]" /> : <Bookmark size={14} />}
            className="border-white/10 hover:bg-white/5 text-[#6DA5C0] hover:text-[#E6F3F5] font-mono text-xs uppercase tracking-wider"
          >
            {report.bookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Share2 size={14} />} className="border-white/10 hover:bg-white/5 text-[#6DA5C0] hover:text-[#E6F3F5] font-mono text-xs uppercase tracking-wider">Share</Button>
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />} className="border-white/10 hover:bg-white/5 text-[#6DA5C0] hover:text-[#E6F3F5] font-mono text-xs uppercase tracking-wider">Export</Button>
        </div>
      </div>

      {/* Hero Panel */}
      <div className="glass rounded-xl border border-white/10 overflow-hidden shadow-2xl relative bg-white/3">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0F969C]/3 rounded-full blur-[100px] pointer-events-none" />
        <div className="p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-mono text-[#0F969C] bg-[#0F969C]/10 border border-[#0F969C]/25 px-2.5 py-1 rounded">
                AUDIT REPORT ID-{report.id.substring(0, 6).toUpperCase()}
              </span>
              <Badge variant={statusVariant} className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5">{report.status}</Badge>
              <Badge variant="outline" className="border-white/10 text-xs font-mono text-[#6DA5C0] uppercase">{report.topic}</Badge>
            </div>
            <span className="text-xs font-mono text-[#6DA5C0]">
              AUDITED: {formatDate(report.createdAt)}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-display font-bold text-white leading-snug">
            &ldquo;{report.claim}&rdquo;
          </h2>

          <p className="text-sm text-[#6DA5C0] leading-relaxed border-l-2 border-[#0F969C]/30 pl-4 py-1">
            {report.summary}
          </p>
        </div>
      </div>

      {/* Middle Grid: Confidence Center & Semantic Auditor Accordion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Confidence Center */}
        <div className="lg:col-span-5">
          <Card className="border-white/10 bg-[#072e33]/40 backdrop-blur-md h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
            <div className="relative">
              {/* Backlight halo effect */}
              <div className="absolute inset-0 bg-[#0F969C]/8 rounded-full blur-2xl pointer-events-none" />
              <TrustScoreRing score={report.trustScore} size={180} />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-mono uppercase tracking-widest text-[#0F969C]">VERDICT VALIDATION STAMP</h3>
              <p className="text-xs text-[#6DA5C0] max-w-xs font-mono uppercase tracking-wider">
                This claim exhibits <span className={scoreTextColor}>{report.trustScore}% trust rating</span> across corroborative network index checks.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Side: Accordion & Credibility Factors */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-white/10 bg-[#072e33]/40 backdrop-blur-md">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-white flex items-center gap-2 font-display text-sm">
                <Shield size={14} className="text-[#0F969C]" />
                Semantic Auditor Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-white/5">
              {accordionItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-xs font-mono uppercase tracking-wider text-[#E6F3F5]">
                      {item.title}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-[#6DA5C0] transition-transform ${openAccordion === item.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openAccordion === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-xs font-mono text-[#6DA5C0] leading-relaxed whitespace-pre-line">{item.content}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Credibility progress bars */}
      <Card className="border-white/10 bg-[#072e33]/40 backdrop-blur-md">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-white flex items-center gap-2 font-display text-sm">
            <Sparkles size={14} className="text-[#0F969C]" /> Credibility Index Factors
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {report.credibilityFactors.map((factor, i) => (
            <div key={i} className="space-y-1.5 border border-white/5 rounded-lg p-4 bg-black/10">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-white uppercase font-bold">{factor.name}</span>
                <span className="text-[#0F969C]">{factor.score}/100</span>
              </div>
              <Progress value={factor.score} size="sm" barClassName="bg-[#0F969C]" className="bg-white/5" />
              <p className="text-[11px] text-[#6DA5C0] leading-normal pt-1">{factor.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Source Reference Grid */}
      <Card className="border-white/10 bg-[#072e33]/40 backdrop-blur-md">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-white flex items-center gap-2 font-display text-sm">
            <Globe size={14} className="text-[#0F969C]" /> Source Reference Grid
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-[9px] font-mono text-[#6DA5C0] uppercase tracking-widest">
                  <th className="text-left px-6 py-4 font-semibold">Audited Source</th>
                  <th className="text-left px-4 py-4 font-semibold">Reliability</th>
                  <th className="text-left px-4 py-4 font-semibold">Alignment</th>
                  <th className="text-left px-4 py-4 font-semibold">Category</th>
                  <th className="text-left px-6 py-4 font-semibold">Date Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono text-[#E6F3F5]">
                {report.sources.map((source: Source) => (
                  <tr key={source.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 max-w-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white group-hover:text-[#0F969C] transition-colors">{source.name}</span>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#6DA5C0] hover:text-white"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                        <p className="text-[11px] text-[#6DA5C0] line-clamp-1 leading-normal">{source.excerpt}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4"><ReliabilityDot score={source.reliability} /></td>
                    <td className="px-4 py-4">
                      {source.supportsClaim ? (
                        <span className="text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold">SUPPORTS</span>
                      ) : (
                        <span className="text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold">CONTRADICTS</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] text-[#6DA5C0] uppercase">{source.category}</span>
                    </td>
                    <td className="px-6 py-4 text-[#6DA5C0]">
                      {new Date(source.publishedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
