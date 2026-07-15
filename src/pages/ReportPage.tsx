import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Bookmark, BookmarkCheck, Share2, Download,
  AlertCircle, Sparkles, Shield, Globe, Brain,
  TrendingUp, AlignLeft, ChevronDown, ChevronUp
} from 'lucide-react'
import { useVerification } from '../contexts/VerificationContext'
import { TrustScoreRing } from '../components/features/TrustScoreRing'
import { ScoreBreakdownBars } from '../components/features/ScoreBreakdownBars'
import { SourceCard } from '../components/features/SourceCard'
import { ExplainabilityPanel } from '../components/features/ExplainabilityPanel'
import { ConsensusWidget } from '../components/features/ConsensusWidget'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { MOCK_REPORTS } from '../data/mockData'
import { formatDate } from '../lib/utils'
import type { LinguisticRiskFlag } from '../types'

// ─── Linguistic Risk Section ──────────────────────────────────────────────
function LinguisticRiskSection({ flags }: { flags: LinguisticRiskFlag[] }) {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {flags.map((flag, i) => {
        const riskColor = flag.score >= 70 ? '#ef4444' : flag.score >= 45 ? '#f59e0b' : '#22c55e'
        const riskBg = flag.score >= 70 ? 'rgba(239,68,68,0.08)' : flag.score >= 45 ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)'
        const riskBorder = flag.score >= 70 ? 'rgba(239,68,68,0.2)' : flag.score >= 45 ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)'

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-xl border p-3.5 space-y-2"
            style={{ background: riskBg, borderColor: riskBorder }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#FEFFFC] uppercase tracking-wider">
                {flag.label}
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: riskColor }}>
                {flag.detected ? '⚠ ' : '✓ '}{flag.score}
              </span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: riskColor }}
                initial={{ width: 0 }}
                animate={{ width: `${flag.score}%` }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.6, ease: 'easeOut' }}
              />
            </div>
            <p className="text-[10px] text-[#8E8A9F] leading-relaxed">{flag.description}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Section Header ──────────────────────────────────────────────────────
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-4">
      <div className="text-[#D0FF00]">{icon}</div>
      <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">{title}</h2>
    </div>
  )
}

// ─── Main Report Page ─────────────────────────────────────────────────────
export function ReportPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getReport, toggleBookmark } = useVerification()
  const [showReasoning, setShowReasoning] = useState(false)

  const report = id ? (getReport(id) ?? MOCK_REPORTS.find(r => r.id === id)) : undefined

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 bg-[#141021]/25 border border-white/5 rounded-xl p-8 max-w-md mx-auto mt-12">
        <AlertCircle size={48} className="text-[#8E8A9F]" />
        <p className="text-[#FEFFFC] font-mono text-sm">Report not found</p>
        <Button onClick={() => navigate('/dashboard')} className="mt-2 font-mono text-xs uppercase tracking-wider">
          Back to Workspace
        </Button>
      </div>
    )
  }

  const statusVariant = report.trustScore >= 75 ? 'success' : report.trustScore >= 50 ? 'warning' : 'danger'
  const glowColor = report.trustScore >= 75 ? 'rgba(34,197,94,0.15)' : report.trustScore >= 50 ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.12)'
  const glowBorder = report.trustScore >= 75 ? 'rgba(34,197,94,0.25)' : report.trustScore >= 50 ? 'rgba(234,179,8,0.25)' : 'rgba(239,68,68,0.22)'

  // ⚡ Bolt Performance Optimization:
  // Why: Multiple .filter() calls over report.sources run on every render unnecessarily.
  // What: Merged array partitioning into a single O(n) loop and wrapped in useMemo.
  // Impact: Provides referential equality to prevent unnecessary re-renders in child components and halves the CPU cycles needed for source categorization.
  const { supportingSources, contradictingSources } = useMemo(() => {
    const supporting = []
    const contradicting = []
    for (const source of report.sources) {
      if (source.supportsClaim) {
        supporting.push(source)
      } else {
        contradicting.push(source)
      }
    }
    return { supportingSources: supporting, contradictingSources: contradicting }
  }, [report.sources])

  const hasScoreBreakdown = !!report.scoreBreakdown
  const hasLinguisticFlags = !!(report.linguisticRiskFlags && report.linguisticRiskFlags.length)
  const hasConsensus = !!report.consensusData

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6 py-6">

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft size={16} />}
          className="text-[#8E8A9F] hover:text-white font-mono text-xs uppercase tracking-wider"
        >
          Return
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleBookmark(report.id)}
            leftIcon={report.bookmarked ? <BookmarkCheck size={14} className="text-[#D0FF00]" /> : <Bookmark size={14} />}
            className="border-white/10 hover:bg-white/5 text-[#8E8A9F] hover:text-[#FEFFFC] font-mono text-xs uppercase tracking-wider"
          >
            {report.bookmarked ? 'Saved' : 'Save'}
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Share2 size={14} />} className="border-white/10 hover:bg-white/5 text-[#8E8A9F] hover:text-[#FEFFFC] font-mono text-xs uppercase tracking-wider">Share</Button>
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />} className="border-white/10 hover:bg-white/5 text-[#8E8A9F] hover:text-[#FEFFFC] font-mono text-xs uppercase tracking-wider">Export</Button>
        </div>
      </div>

      {/* ── 1. Hero Report Card ──────────────────────────────────────── */}
      <div
        className="rounded-2xl border p-6 relative overflow-hidden"
        style={{ background: glowColor, borderColor: glowBorder }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none" style={{ background: glowColor }} />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] font-mono text-[#D0FF00] bg-[#D0FF00]/10 border border-[#D0FF00]/25 px-2.5 py-1 rounded">
              REPORT ID-{report.id.substring(0, 6).toUpperCase()}
            </span>
            <Badge variant={statusVariant} className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5">{report.status}</Badge>
            <Badge variant="outline" className="border-white/10 text-xs font-mono text-[#8E8A9F] uppercase">{report.topic}</Badge>
            <span className="text-xs font-mono text-[#8E8A9F] ml-auto">
              {formatDate(report.createdAt)}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-display font-bold text-white leading-snug mb-3">
            &ldquo;{report.claim}&rdquo;
          </h1>
          <p className="text-sm text-[#8E8A9F] leading-relaxed border-l-2 border-[#D0FF00]/30 pl-4 py-1">
            {report.summary}
          </p>
        </div>
      </div>

      {/* ── 2. Trust Score + Score Breakdown ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Trust Score Card */}
        <Card className="lg:col-span-4 border-white/10 bg-[#141021]/40 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl pointer-events-none" style={{ background: glowColor }} />
            <TrustScoreRing score={report.trustScore} size={160} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D0FF00]">Confidence</span>
              <span className="text-sm font-bold font-mono text-white">{report.confidence}%</span>
            </div>
            <p className="text-[10px] text-[#8E8A9F] font-mono uppercase tracking-wider max-w-xs">
              Verification Status: <span className="text-white font-semibold">{report.status}</span>
            </p>
          </div>
        </Card>

        {/* Score Breakdown */}
        <Card className="lg:col-span-8 border-white/10 bg-[#141021]/40 backdrop-blur-md">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-white flex items-center gap-2 font-display text-sm">
              <TrendingUp size={14} className="text-[#D0FF00]" />
              Weighted Trust Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {hasScoreBreakdown ? (
              <ScoreBreakdownBars breakdown={report.scoreBreakdown} />
            ) : (
              <p className="text-xs font-mono text-[#8E8A9F]">Score breakdown not available for this report.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Claim Summary + Evidence Summary ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-white/10 bg-[#141021]/40 backdrop-blur-md">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-white flex items-center gap-2 font-display text-sm">
              <AlignLeft size={14} className="text-[#D0FF00]" />
              Claim Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <p className="text-[11px] font-mono text-[#8E8A9F] leading-relaxed mb-3 uppercase tracking-wider">Extracted Claim</p>
            <p className="text-sm text-[#FEFFFC] leading-relaxed border-l-2 border-[#D0FF00]/40 pl-3">
              {report.claimExtracted}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#141021]/40 backdrop-blur-md">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-white flex items-center gap-2 font-display text-sm">
              <Globe size={14} className="text-[#D0FF00]" />
              Evidence Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <p className="text-[11px] font-mono text-[#8E8A9F] leading-relaxed mb-3 uppercase tracking-wider">Retrieved Evidence</p>
            <p className="text-sm text-[#FEFFFC] leading-relaxed border-l-2 border-[#8116E0]/40 pl-3">
              {report.evidenceSummary}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── 4. Supporting Sources ────────────────────────────────────── */}
      {supportingSources.length > 0 && (
        <Card className="border-white/10 bg-[#141021]/40 backdrop-blur-md">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-white flex items-center gap-2 font-display text-sm">
              <Shield size={14} className="text-green-400" />
              Supporting Sources
              <span className="ml-auto text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                {supportingSources.length} found
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {supportingSources.map((source, i) => (
                <SourceCard key={source.id} source={source} index={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 5. Contradicting Sources ─────────────────────────────────── */}
      {contradictingSources.length > 0 && (
        <Card className="border-white/10 bg-[#141021]/40 backdrop-blur-md">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-white flex items-center gap-2 font-display text-sm">
              <AlertCircle size={14} className="text-red-400" />
              Contradicting Sources
              <span className="ml-auto text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                {contradictingSources.length} found
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contradictingSources.map((source, i) => (
                <SourceCard key={source.id} source={source} index={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 6. Consensus + Linguistic Risk ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Consensus Analysis */}
        {hasConsensus && (
          <Card className="border-white/10 bg-[#141021]/40 backdrop-blur-md">
            <CardContent className="p-5">
              <ConsensusWidget data={report.consensusData} />
            </CardContent>
          </Card>
        )}

        {/* Semantic Match (from score breakdown) */}
        <Card className="border-white/10 bg-[#141021]/40 backdrop-blur-md">
          <CardContent className="p-5">
            <SectionHeader icon={<Sparkles size={14} />} title="Source Reliability Index" />
            <div className="space-y-3">
              {report.credibilityFactors.slice(0, 4).map((factor, i) => {
                const color = factor.impact === 'positive' ? '#22c55e' : factor.impact === 'negative' ? '#ef4444' : '#f59e0b'
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-[#FEFFFC] font-semibold uppercase">{factor.name}</span>
                      <span style={{ color }} className="font-bold">{factor.score}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.score}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-[10px] text-[#8E8A9F]">{factor.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 7. Linguistic Risk ──────────────────────────────────────── */}
      {hasLinguisticFlags && (
        <Card className="border-white/10 bg-[#141021]/40 backdrop-blur-md">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-white flex items-center gap-2 font-display text-sm">
              <AlertCircle size={14} className="text-[#f59e0b]" />
              Linguistic Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <LinguisticRiskSection flags={report.linguisticRiskFlags} />
          </CardContent>
        </Card>
      )}

      {/* ── 8. Explainability Panel ─────────────────────────────────── */}
      <Card className="border-white/10 bg-[#141021]/40 backdrop-blur-md">
        <CardContent className="p-5">
          <ExplainabilityPanel report={report} />
        </CardContent>
      </Card>

      {/* ── 9. AI Explanation ───────────────────────────────────────── */}
      <Card className="border border-[#8116E0]/25 bg-[#141021]/40 backdrop-blur-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[#8116E0]/4 pointer-events-none" />
        <CardHeader className="border-b border-white/5 relative">
          <CardTitle className="text-white flex items-center gap-2 font-display text-sm">
            <Brain size={14} className="text-[#c084fc]" />
            AI Reasoning Path
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 relative">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-mono text-[#8E8A9F] uppercase tracking-wider">
              Full reasoning chain — {report.confidence}% confidence
            </p>
            <button
              onClick={() => setShowReasoning(v => !v)}
              className="flex items-center gap-1 text-[10px] font-mono text-[#8E8A9F] hover:text-white transition-colors"
            >
              {showReasoning ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {showReasoning ? 'Collapse' : 'Expand'}
            </button>
          </div>

          {/* Collapsed preview */}
          <p className={`text-sm text-[#FEFFFC] leading-relaxed font-mono ${!showReasoning ? 'line-clamp-3' : ''}`}>
            {report.reasoning}
          </p>

          {!showReasoning && (
            <button
              onClick={() => setShowReasoning(true)}
              className="mt-2 text-[10px] font-mono text-[#8116E0] hover:text-[#c084fc] transition-colors"
            >
              Read full reasoning →
            </button>
          )}
        </CardContent>
      </Card>

    </motion.div>
  )
}
