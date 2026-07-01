import React from 'react'
import { motion } from 'framer-motion'
import { Search, Globe, Brain, BarChart2, FileText, Check } from 'lucide-react'

const steps = [
  { id: 1, label: 'Extracting Claim...', icon: Search },
  { id: 2, label: 'Searching Trusted Sources...', icon: Globe },
  { id: 3, label: 'Evaluating Credibility...', icon: Brain },
  { id: 4, label: 'Generating Trust Score...', icon: BarChart2 },
  { id: 5, label: 'Preparing Report...', icon: FileText },
]

interface AnalysisPipelineProps { currentStep: number }

export function AnalysisPipeline({ currentStep }: AnalysisPipelineProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8 bg-[#141021]/25 border border-white/5 rounded-2xl p-8 backdrop-blur-md">
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 rounded-2xl bg-[#D0FF00]/10 border border-[#D0FF00]/30 flex items-center justify-center shadow-[0_0_24px_rgba(208, 255, 0,0.15)]"
      >
        <Brain size={36} className="text-[#D0FF00]" />
      </motion.div>

      <div className="text-center">
        <h2 className="text-xl font-display font-bold text-white">Analyzing Content</h2>
        <p className="text-xs text-[#8E8A9F] font-mono uppercase tracking-wider mt-1.5">AI is verifying your content against trusted sources</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isDone = index + 1 < currentStep
          const isActive = index + 1 === currentStep
          const isPending = index + 1 > currentStep
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isPending ? 0.35 : 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center gap-4"
            >
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                isDone
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : isActive
                    ? 'border-[#D0FF00] bg-[#D0FF00]/10 text-[#D0FF00]'
                    : 'border-white/5 bg-white/5 text-[#8E8A9F]'
              }`}>
                {isDone ? <Check size={14} /> : <StepIcon size={16} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDone ? 'text-green-400' : isActive ? 'text-white' : 'text-[#8E8A9F]'}`}>
                    {step.label}
                  </span>
                  {isDone && <span className="text-xs font-mono text-green-400/80 uppercase">Done</span>}
                  {isActive && (
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="flex gap-0.5">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ y: [-2, 2, -2] }}
                          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                          className="w-1 h-1 rounded-full bg-[#D0FF00]"
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
                {isActive && (
                  <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#D0FF00] rounded-full"
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
