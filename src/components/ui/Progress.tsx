import React from 'react'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  showLabel?: boolean
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export function Progress({ value, max = 100, className, barClassName, showLabel, animated = true, size = 'md' }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('relative', className)}>
      <div className={cn('w-full rounded-full bg-secondary overflow-hidden', sizeClasses[size])}>
        {animated ? (
          <motion.div
            className={cn('h-full rounded-full gradient-bg', barClassName)}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={cn('h-full rounded-full gradient-bg', barClassName)}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
      {showLabel && (
        <span className="mt-1 text-xs text-muted-foreground">{Math.round(percentage)}%</span>
      )}
    </div>
  )
}
