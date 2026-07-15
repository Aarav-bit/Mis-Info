import React, { useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Languages, FileSearch, Lightbulb, ThumbsUp } from 'lucide-react'
import type { VerificationReport } from '../../types'

interface ExplainabilityPanelProps {
  report: VerificationReport
}

function ExplainCard({
  icon,
  title,
  content,
  color,
  index,
  inView,
}: {
  icon: React.ReactNode
  title: string
  content: string
  color: string
  index: number
  inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="rounded-xl border p-4 space-y-2.5"
      style={{
        background: `${color}06`,
        borderColor: `${color}22`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, color }}
        >
          {icon}
        </div>
        <span className="text-[11px] font-mono font-bold text-[#FEFFFC] uppercase tracking-wider">
          {title}
        </span>
      </div>
      <p className="text-xs text-[#8E8A9F] leading-relaxed pl-9">{content}</p>
    </motion.div>
  )
}

export function ExplainabilityPanel({ report }: ExplainabilityPanelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  // ⚡ Bolt Performance Optimization:
  // Why: Component recalculates array filters repeatedly when parent re-renders (like inView state changes).
  // What: Merged source partitioning into one O(n) loop and memoized all filter results using useMemo.
  // Impact: Decreases render cycle duration and reduces memory allocations.
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

  const detectedRisks = useMemo(() => report.linguisticRiskFlags.filter(f => f.detected), [report.linguisticRiskFlags])

  const cards = [
    {
      icon: <CheckCircle size={14} />,
      title: 'Evidence Found',
      content: report.sources.length > 0
        ? `${report.sources.length} source${report.sources.length > 1 ? 's' : ''} were retrieved and analyzed. Evidence spans ${[...new Set(report.sources.map(s => s.category))].join(', ')}.`
        : 'No direct evidence sources were found for this claim.',
      color: '#22c55e',
    },
    {
      icon: <FileSearch size={14} />,
      title: 'Missing Evidence',
      content: report.trustScore < 70
        ? `No primary authoritative confirmation was found. ${contradictingSources.length > 0 ? `${contradictingSources.length} source(s) actively contradicted the claim.` : 'Absence of evidence from tier-1 sources reduces confidence.'}`
        : 'Evidence coverage is comprehensive. No significant gaps were detected in source retrieval.',
      color: '#f59e0b',
    },
    {
      icon: <CheckCircle size={14} />,
      title: 'Supporting Sources',
      content: supportingSources.length > 0
        ? `${supportingSources.length} source(s) support this claim: ${supportingSources.map(s => s.name).join(', ')}. Average reliability: ${Math.round(supportingSources.reduce((a, s) => a + s.reliability, 0) / supportingSources.length)}%.`
        : 'No sources were found that support this claim.',
      color: '#D0FF00',
    },
    {
      icon: <XCircle size={14} />,
      title: 'Contradicting Sources',
      content: contradictingSources.length > 0
        ? `${contradictingSources.length} source(s) contradict this claim: ${contradictingSources.map(s => s.name).join(', ')}. This creates a consensus conflict that reduces the trust score.`
        : 'No contradicting sources were found. The claim is not actively disputed by any indexed source.',
      color: '#ef4444',
    },
    {
      icon: <Languages size={14} />,
      title: 'Language Analysis',
      content: detectedRisks.length > 0
        ? `${detectedRisks.length} linguistic risk signal(s) detected: ${detectedRisks.map(r => r.label).join(', ')}. These patterns are commonly associated with misinformation and reduce the Linguistic Safety score.`
        : 'Language analysis found no significant manipulation signals. The text follows factual, measured reporting conventions.',
      color: '#60a5fa',
    },
    {
      icon: <AlertTriangle size={14} />,
      title: 'Final Reasoning',
      content: report.reasoning,
      color: '#c084fc',
    },
    {
      icon: <ThumbsUp size={14} />,
      title: 'Recommendation',
      content: report.recommendation,
      color: '#34d399',
    },
  ]

  return (
    <div ref={ref} className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={14} className="text-[#D0FF00]" />
        <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-white">
          Why did we reach this conclusion?
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <ExplainCard key={i} {...card} index={i} inView={inView} />
        ))}
      </div>
    </div>
  )
}
