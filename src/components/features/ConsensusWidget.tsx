import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Layers, Flag } from 'lucide-react'
import type { ConsensusData } from '../../types'

interface ConsensusWidgetProps {
  data: ConsensusData
  className?: string
}

const TIER_CONFIG = [
  { key: 'tier1Count' as keyof ConsensusData, label: 'Tier 1', sub: 'Gov · WHO · Reuters · BBC', color: '#D0FF00' },
  { key: 'tier2Count' as keyof ConsensusData, label: 'Tier 2', sub: 'Wikipedia · FactCheckers · Major News', color: '#8116E0' },
  { key: 'tier3Count' as keyof ConsensusData, label: 'Tier 3', sub: 'Blogs · Unknown Domains', color: '#8E8A9F' },
]

export function ConsensusWidget({ data, className }: ConsensusWidgetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const agreementPct = Math.round(data.agreementRatio * 100)
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (data.agreementRatio) * circumference

  const agreementColor = agreementPct >= 75 ? '#22c55e' : agreementPct >= 50 ? '#eab308' : '#ef4444'

  return (
    <div ref={ref} className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Layers size={14} className="text-[#D0FF00]" />
        <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-white">
          Consensus Analysis
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Agreement ring */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <svg width={100} height={100} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={50} cy={50} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
              <motion.circle
                cx={50} cy={50} r={radius}
                fill="none"
                stroke={agreementColor}
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold font-display" style={{ color: agreementColor }}>{agreementPct}%</span>
              <span className="text-[9px] font-mono text-[#8E8A9F] uppercase tracking-wider">Agree</span>
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-3 text-[11px] font-mono">
              <span className="text-green-400">{data.supportingCount} supporting</span>
              <span className="text-[#8E8A9F]">·</span>
              <span className="text-red-400">{data.contradictingCount} contradicting</span>
            </div>
            {data.conflictDetected && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                Conflict Detected
              </span>
            )}
            {data.manualReviewFlag && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded ml-1">
                <Flag size={9} />
                Manual Review Suggested
              </span>
            )}
          </div>
        </div>

        {/* Tier breakdown */}
        <div className="space-y-3">
          {TIER_CONFIG.map((tier, i) => {
            const count = data[tier.key] as number
            const pct = data.totalSources > 0 ? (count / data.totalSources) * 100 : 0
            return (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, x: 12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: tier.color }}
                    />
                    <span className="text-[#FEFFFC] font-bold">{tier.label}</span>
                    <span className="text-[#8E8A9F] hidden sm:inline">{tier.sub}</span>
                  </div>
                  <span className="font-bold" style={{ color: tier.color }}>{count}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: tier.color }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${pct}%` } : { width: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            )
          })}
          <p className="text-[10px] font-mono text-[#8E8A9F] pt-1 border-t border-white/5">
            Total: {data.totalSources} source{data.totalSources !== 1 ? 's' : ''} indexed
          </p>
        </div>
      </div>
    </div>
  )
}
