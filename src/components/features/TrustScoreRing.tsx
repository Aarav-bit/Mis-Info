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

function getScoreColors(score: number): [string, string] {
  if (score >= 75) return ['#D0FF00', '#8116E0'] // Premium Copper stops
  if (score >= 50) return ['#FEFFFC', '#8E8A9F'] // Warm Beige/Gray stops
  return ['#ef4444', '#b91c1c'] // Danger red stops
}

export function TrustScoreRing({ score, size = 180, strokeWidth = 10, className, showLabel = true }: TrustScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const [color1, color2] = getScoreColors(score)
  const gradientId = `score-gradient-${score}`
  
  const statusText = score >= 80 ? 'Verified' : score >= 65 ? 'Likely Credible' : score >= 40 ? 'Needs Verification' : 'Likely False'
  const textClassColor = score >= 75 ? 'text-[#D0FF00]' : score >= 50 ? 'text-[#FEFFFC]' : 'text-red-400'

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color1} />
            <stop offset="100%" stopColor={color2} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.04)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-4xl font-display font-bold text-white leading-none"
          >
            {score}
          </motion.span>
          <span className="text-[10px] font-mono text-[#8E8A9F] mt-1 uppercase tracking-widest">/ 100</span>
          <span className={cn('text-xs font-semibold font-mono uppercase tracking-wider mt-2', textClassColor)}>
            {statusText}
          </span>
        </div>
      )}
    </div>
  )
}
