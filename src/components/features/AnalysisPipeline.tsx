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
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
      <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity }} className="w-20 h-20 rounded-2xl gradient-bg flex items-center justify-center shadow-lg">
        <Brain size={36} className="text-white" />
      </motion.div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground">Analyzing Content</h2>
        <p className="text-sm text-muted-foreground mt-1">AI is verifying your content against trusted sources</p>
      </div>
      <div className="w-full max-w-md space-y-3">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isDone = index + 1 < currentStep
          const isActive = index + 1 === currentStep
          const isPending = index + 1 > currentStep
          return (
            <motion.div key={step.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: isPending ? 0.3 : 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center gap-4">
              <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-green-500 border-green-500' : isActive ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}>
                {isDone ? <Check size={14} className="text-white" /> : <StepIcon size={16} className={isActive ? 'text-primary' : 'text-muted-foreground'} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDone ? 'text-green-500' : isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</span>
                  {isDone && <span className="text-xs text-green-500">Done</span>}
                  {isActive && (
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="flex gap-0.5">
                      {[0, 1, 2].map(i => <motion.div key={i} animate={{ y: [-2, 2, -2] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} className="w-1 h-1 rounded-full bg-primary" />)}
                    </motion.div>
                  )}
                </div>
                {isActive && (
                  <div className="mt-1.5 h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div className="h-full gradient-bg rounded-full" animate={{ width: ['0%', '100%'] }} transition={{ duration: 1, ease: 'easeInOut', repeat: Infinity }} />
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
