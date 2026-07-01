import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ScoreBreakdown } from '../../types'

interface ScoreBreakdownBarsProps {
  breakdown: ScoreBreakdown
  className?: string
}

const FACTORS = [
  { key: 'sourceReliability' as keyof ScoreBreakdown, label: 'Source Reliability', weight: 35, color: '#D0FF00' },
  { key: 'evidenceAgreement' as keyof ScoreBreakdown, label: 'Evidence Agreement', weight: 25, color: '#8116E0' },
  { key: 'semanticMatch' as keyof ScoreBreakdown, label: 'Semantic Similarity', weight: 20, color: '#60a5fa' },
  { key: 'linguisticRisk' as keyof ScoreBreakdown, label: 'Linguistic Safety', weight: 10, color: '#34d399' },
  { key: 'ruleEngine' as keyof ScoreBreakdown, label: 'Rule Engine', weight: 10, color: '#f59e0b' },
]

function getBarColor(score: number) {
  if (score >= 75) return '#22c55e'
  if (score >= 50) return '#eab308'
  return '#ef4444'
}

export function ScoreBreakdownBars({ breakdown, className }: ScoreBreakdownBarsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref} className={className}>
      <div className="space-y-4">
        {FACTORS.map((factor, i) => {
          const score = breakdown[factor.key]
          const barColor = getBarColor(score)
          const contribution = ((score / 100) * factor.weight).toFixed(1)

          return (
            <motion.div
              key={factor.key}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#FEFFFC] uppercase tracking-wider font-semibold">
                    {factor.label}
                  </span>
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                    style={{
                      background: `${factor.color}18`,
                      color: factor.color,
                      border: `1px solid ${factor.color}30`,
                    }}
                  >
                    ×{factor.weight}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#8E8A9F]">
                    +{contribution}pts
                  </span>
                  <span
                    className="text-xs font-mono font-bold tabular-nums"
                    style={{ color: barColor }}
                  >
                    {score}
                  </span>
                </div>
              </div>

              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: barColor }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${score}%` } : { width: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Formula legend */}
      <div className="mt-5 pt-4 border-t border-white/5">
        <p className="text-[10px] font-mono text-[#8E8A9F] uppercase tracking-wider">
          Score = Σ(Factor × Weight) — Weighted Trust Formula v2.1
        </p>
      </div>
    </div>
  )
}
