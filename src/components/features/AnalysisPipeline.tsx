import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, AlertTriangle, Globe, Layers, BarChart2,
  Check, Loader2, ChevronRight, Shield, Wifi, Database
} from 'lucide-react'

// ─── Stage definitions ─────────────────────────────────────────────────────
const STAGES = [
  {
    id: 1,
    label: 'Claim Extraction',
    sublabel: 'Pre-processing input before verification',
    icon: Search,
    color: '#D0FF00',
    operations: [
      'Cleaning raw text input',
      'Normalizing linguistic structure',
      'Detecting claim type & intent',
      'Extracting named entities',
    ],
  },
  {
    id: 2,
    label: 'Linguistic Risk Analysis',
    sublabel: 'Detecting manipulation techniques',
    icon: AlertTriangle,
    color: '#f59e0b',
    operations: [
      'Clickbait detection',
      'Urgency signal scan',
      'Emotional manipulation check',
      'Scam pattern matching',
      'Capitalization abuse detection',
      'Excessive certainty analysis',
    ],
  },
  {
    id: 3,
    label: 'Evidence Retrieval',
    sublabel: 'Parallel API execution across trusted sources',
    icon: Globe,
    color: '#60a5fa',
    sources: [
      { name: 'Google Fact Check', latency: '120ms' },
      { name: 'GDELT Project', latency: '340ms' },
      { name: 'Wikipedia', latency: '88ms' },
      { name: 'Wikidata', latency: '95ms' },
      { name: 'OpenLibrary', latency: '210ms' },
    ],
  },
  {
    id: 4,
    label: 'Consensus Engine',
    sublabel: 'Comparing evidence, calculating agreement',
    icon: Layers,
    color: '#8116E0',
    tiers: [
      { label: 'Tier 1', desc: 'Government · WHO · Reuters · BBC', color: '#D0FF00' },
      { label: 'Tier 2', desc: 'Wikipedia · Fact Checkers · Major News', color: '#8116E0' },
      { label: 'Tier 3', desc: 'Blogs · Unknown Domains', color: '#8E8A9F' },
    ],
  },
  {
    id: 5,
    label: 'Trust Score Engine',
    sublabel: 'Generating final explainable trust score',
    icon: BarChart2,
    color: '#34d399',
    weights: [
      { label: 'Source Reliability', pct: 35 },
      { label: 'Evidence Agreement', pct: 25 },
      { label: 'Semantic Similarity', pct: 20 },
      { label: 'Linguistic Safety', pct: 10 },
      { label: 'Rule Engine', pct: 10 },
    ],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────
function OperationList({ items, active }: { items: string[]; active: boolean }) {
  const [visible, setVisible] = useState(0)
  useEffect(() => {
    if (!active) { setVisible(0); return }
    const t = setInterval(() => setVisible(v => {
      if (v >= items.length) { clearInterval(t); return v }
      return v + 1
    }), 220)
    return () => clearInterval(t)
  }, [active, items.length])

  return (
    <div className="space-y-1.5 mt-3">
      {items.slice(0, visible).map((op, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-[11px] font-mono text-[#8E8A9F]"
        >
          <Check size={11} className="text-[#D0FF00] flex-shrink-0" />
          {op}
        </motion.div>
      ))}
    </div>
  )
}

function SourcePings({ sources, active }: { sources: { name: string; latency: string }[]; active: boolean }) {
  const [pinged, setPinged] = useState<number[]>([])
  useEffect(() => {
    if (!active) { setPinged([]); return }
    sources.forEach((_, i) => {
      const t = setTimeout(() => setPinged(p => [...p, i]), i * 180 + 100)
      return () => clearTimeout(t)
    })
  }, [active, sources.length])

  return (
    <div className="mt-3 space-y-1.5">
      {sources.map((src, i) => (
        <div key={i} className="flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: pinged.includes(i) ? '#22c55e' : 'rgba(255,255,255,0.15)' }}
              animate={pinged.includes(i) ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
            <span className={pinged.includes(i) ? 'text-[#FEFFFC]' : 'text-[#8E8A9F]/50'}>{src.name}</span>
          </div>
          {pinged.includes(i) && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400"
            >
              {src.latency}
            </motion.span>
          )}
        </div>
      ))}
    </div>
  )
}

function TierRows({ tiers, active }: { tiers: { label: string; desc: string; color: string }[]; active: boolean }) {
  const [vis, setVis] = useState(0)
  useEffect(() => {
    if (!active) { setVis(0); return }
    const t = setInterval(() => setVis(v => Math.min(v + 1, tiers.length)), 300)
    return () => clearInterval(t)
  }, [active, tiers.length])

  return (
    <div className="mt-3 space-y-2">
      {tiers.slice(0, vis).map((tier, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-[11px] font-mono p-2 rounded-lg bg-white/3 border border-white/5"
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: tier.color }} />
          <span className="font-bold" style={{ color: tier.color }}>{tier.label}</span>
          <span className="text-[#8E8A9F] truncate">{tier.desc}</span>
        </motion.div>
      ))}
      {active && vis >= tiers.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] font-mono text-[#D0FF00] flex items-center gap-1.5 mt-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#D0FF00] animate-pulse" />
          Calculating agreement ratio...
        </motion.div>
      )}
    </div>
  )
}

function WeightBars({ weights, active }: { weights: { label: string; pct: number }[]; active: boolean }) {
  const [vis, setVis] = useState(0)
  useEffect(() => {
    if (!active) { setVis(0); return }
    const t = setInterval(() => setVis(v => Math.min(v + 1, weights.length)), 250)
    return () => clearInterval(t)
  }, [active, weights.length])

  return (
    <div className="mt-3 space-y-2">
      {weights.slice(0, vis).map((w, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-1"
        >
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-[#FEFFFC]">{w.label}</span>
            <span className="text-[#D0FF00]">×{w.pct}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#D0FF00] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${w.pct * 2}%` }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────
interface AnalysisPipelineProps {
  currentStep: number
}

export function AnalysisPipeline({ currentStep }: AnalysisPipelineProps) {
  const progress = Math.round(((currentStep - 1) / (STAGES.length)) * 100)

  return (
    <div className="flex flex-col gap-6 min-h-[520px] bg-[#141021]/30 border border-white/8 rounded-2xl p-6 backdrop-blur-md">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 rounded-lg bg-[#D0FF00]/10 border border-[#D0FF00]/30 flex items-center justify-center"
          >
            <Shield size={14} className="text-[#D0FF00]" />
          </motion.div>
          <div>
            <div className="text-white font-semibold text-sm">TrustLens Verification</div>
            <div className="text-[10px] font-mono text-[#8E8A9F] uppercase tracking-wider">5-Stage AI Pipeline Active</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#D0FF00]">
          <Wifi size={11} className="animate-pulse" />
          <span>LIVE</span>
        </div>
      </div>

      {/* Global progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-mono text-[#8E8A9F]">
          <span className="uppercase tracking-wider">Pipeline Progress</span>
          <span className="text-[#D0FF00]">{progress}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#D0FF00] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Stage list */}
      <div className="space-y-2 flex-1">
        {STAGES.map((stage, idx) => {
          const StageIcon = stage.icon
          const isDone = idx + 1 < currentStep
          const isActive = idx + 1 === currentStep
          const isPending = idx + 1 > currentStep
          const isLast = idx === STAGES.length - 1

          return (
            <div key={stage.id} className="relative">
              {/* Connector line */}
              {!isLast && (
                <div
                  className="absolute left-4 top-10 bottom-0 w-px"
                  style={{
                    background: isDone
                      ? 'linear-gradient(to bottom, rgba(34,197,94,0.5), rgba(34,197,94,0.1))'
                      : isActive
                        ? `linear-gradient(to bottom, ${stage.color}40, transparent)`
                        : 'rgba(255,255,255,0.05)',
                  }}
                />
              )}

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: isPending ? 0.4 : 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={`rounded-xl border transition-all ${isActive
                  ? 'border-white/15 bg-white/4'
                  : isDone
                    ? 'border-white/8 bg-white/2'
                    : 'border-white/4 bg-transparent'
                  }`}
              >
                <div className="flex items-center gap-3 p-3">
                  {/* Icon node */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-colors"
                    style={{
                      background: isDone ? 'rgba(34,197,94,0.12)' : isActive ? `${stage.color}18` : 'rgba(255,255,255,0.04)',
                      borderColor: isDone ? 'rgba(34,197,94,0.3)' : isActive ? `${stage.color}45` : 'rgba(255,255,255,0.06)',
                      color: isDone ? '#22c55e' : isActive ? stage.color : '#8E8A9F',
                    }}
                  >
                    {isDone ? <Check size={14} /> : isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <StageIcon size={14} />
                      </motion.div>
                    ) : <StageIcon size={14} />}
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-semibold font-mono"
                        style={{ color: isDone ? '#22c55e' : isActive ? '#fff' : '#8E8A9F' }}
                      >
                        {stage.label}
                      </span>
                      {isDone && <span className="text-[10px] font-mono text-green-400/80 uppercase flex items-center gap-1"><Check size={9} />Done</span>}
                      {isActive && (
                        <motion.div className="flex gap-0.5" animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                          {[0, 1, 2].map(i => (
                            <motion.div
                              key={i}
                              className="w-1 h-1 rounded-full"
                              style={{ background: stage.color }}
                              animate={{ y: [-2, 2, -2] }}
                              transition={{ duration: 0.5, delay: i * 0.12, repeat: Infinity }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[#8E8A9F]">{stage.sublabel}</span>
                  </div>
                </div>

                {/* Active stage detail */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden px-3 pb-3"
                    >
                      <div className="pl-11">
                        {/* Progress bar for active step */}
                        <div className="h-0.5 bg-white/5 rounded-full overflow-hidden mb-3">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: stage.color }}
                            animate={{ width: ['0%', '100%'] }}
                            transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
                          />
                        </div>

                        {/* Stage-specific detail */}
                        {stage.operations && (
                          <OperationList items={stage.operations} active={isActive} />
                        )}
                        {stage.sources && (
                          <SourcePings sources={stage.sources} active={isActive} />
                        )}
                        {stage.tiers && (
                          <TierRows tiers={stage.tiers} active={isActive} />
                        )}
                        {stage.weights && (
                          <WeightBars weights={stage.weights} active={isActive} />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* Footer status */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <Database size={11} className="text-[#8E8A9F]" />
        <span className="text-[10px] font-mono text-[#8E8A9F] uppercase tracking-wider">
          Stage {currentStep} of {STAGES.length} — {STAGES[currentStep - 1]?.label ?? 'Completing...'}
        </span>
      </div>
    </div>
  )
}
