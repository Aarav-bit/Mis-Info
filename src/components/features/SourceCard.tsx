import React from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, ShieldCheck, ShieldX, CheckCircle, XCircle } from 'lucide-react'
import type { Source } from '../../types'

interface SourceCardProps {
  source: Source
  index?: number
}

const TIER_LABELS: Record<number, string> = { 1: 'Tier 1 — Authoritative', 2: 'Tier 2 — Credible', 3: 'Tier 3 — Unverified' }
const TIER_COLORS: Record<number, string> = {
  1: 'rgba(208,255,0,0.15)',
  2: 'rgba(129,22,224,0.15)',
  3: 'rgba(239,68,68,0.12)',
}
const TIER_BORDER: Record<number, string> = {
  1: 'rgba(208,255,0,0.35)',
  2: 'rgba(129,22,224,0.35)',
  3: 'rgba(239,68,68,0.3)',
}
const TIER_TEXT: Record<number, string> = {
  1: '#D0FF00',
  2: '#c084fc',
  3: '#f87171',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function getReliabilityColor(score: number) {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#eab308'
  return '#ef4444'
}

export function SourceCard({ source, index = 0 }: SourceCardProps) {
  const tier = source.tier ?? 2
  const reliabilityColor = getReliabilityColor(source.reliability)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="relative rounded-xl border p-4 space-y-3 transition-all hover:border-white/20"
      style={{
        background: 'rgba(20,16,33,0.5)',
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0"
            style={{
              background: TIER_COLORS[tier],
              border: `1px solid ${TIER_BORDER[tier]}`,
              color: TIER_TEXT[tier],
            }}
          >
            {getInitials(source.name)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white truncate">{source.name}</span>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8E8A9F] hover:text-[#D0FF00] transition-colors flex-shrink-0"
              >
                <ExternalLink size={12} />
              </a>
            </div>
            <span className="text-[10px] font-mono text-[#8E8A9F] uppercase tracking-wider">
              {source.category}
            </span>
          </div>
        </div>

        {/* Agreement badge */}
        <div className="flex-shrink-0">
          {source.supportsClaim ? (
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded bg-green-500/10 border border-green-500/25 text-green-400">
              <CheckCircle size={10} />
              Supports
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded bg-red-500/10 border border-red-500/25 text-red-400">
              <XCircle size={10} />
              Contradicts
            </span>
          )}
        </div>
      </div>

      {/* Snippet */}
      <p className="text-[12px] text-[#8E8A9F] leading-relaxed border-l-2 border-white/10 pl-3">
        "{source.excerpt}"
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <div className="space-y-1 flex-1 mr-4">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#8E8A9F]">
            <span className="uppercase tracking-wider">Reliability</span>
            <span style={{ color: reliabilityColor }} className="font-bold">{source.reliability}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: reliabilityColor }}
              initial={{ width: 0 }}
              animate={{ width: `${source.reliability}%` }}
              transition={{ delay: index * 0.07 + 0.3, duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Tier badge */}
          <span
            className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{
              background: TIER_COLORS[tier],
              color: TIER_TEXT[tier],
              border: `1px solid ${TIER_BORDER[tier]}`,
            }}
          >
            T{tier}
          </span>
          <span className="text-[10px] font-mono text-[#8E8A9F]">
            {new Date(source.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
