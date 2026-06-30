import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface TrustScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  className?: string
  showLabel?: boolean
}

function getScoreGradient(score: number): [string, string] {
  if (score >= 75) return ['#22c55e', '#16a34a']
  if (score >= 50) return ['#eab308', '#ca8a04']
  return ['#ef4444', '#dc2626']
}

export function TrustScoreRing({ score, size = 180, strokeWidth = 12, className, showLabel = true }: TrustScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const [color1, color2] = getScoreGradient(score)
  const gradientId = `score-gradient-${score}`
  const statusText = score >= 80 ? 'Verified' : score >= 65 ? 'Likely Credible' : score >= 40 ? 'Needs Verification' : 'Likely False'

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-secondary" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={`url(#${gradientId})`} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="text-4xl font-bold text-foreground">{score}</motion.span>
          <span className="text-xs text-muted-foreground font-medium">/ 100</span>
          <span className="text-xs font-semibold mt-1" style={{ color: color1 }}>{statusText}</span>
        </div>
      )}
    </div>
  )
}
