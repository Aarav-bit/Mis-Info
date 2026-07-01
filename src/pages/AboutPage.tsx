import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Brain, Globe, Zap, CheckCircle, Target, Rocket, Code } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

const techStack = [
  { name: 'React 19', category: 'Frontend', color: 'info' as const },
  { name: 'TypeScript', category: 'Language', color: 'default' as const },
  { name: 'Vite 8', category: 'Build Tool', color: 'info' as const },
  { name: 'TailwindCSS v4', category: 'Styling', color: 'info' as const },
  { name: 'Framer Motion', category: 'Animation', color: 'default' as const },
  { name: 'Recharts', category: 'Analytics', color: 'info' as const },
  { name: 'React Router 7', category: 'Routing', color: 'default' as const },
  { name: 'Lucide Icons', category: 'Icons', color: 'default' as const },
]

const roadmap = [
  { phase: 'Phase 01', title: 'MVP Launch', items: ['Core verification pipeline', 'Trust Score consensus engine', 'Auditor workspace'], done: true },
  { phase: 'Phase 02', title: 'Integrations & API', items: ['Programmatic REST API Endpoint', 'Browser extension client', 'Shared workspaces'], done: false },
  { phase: 'Phase 03', title: 'Intelligent Expansion', items: ['Multilingual NLP ingestion', 'Institutional pricing tiers', 'Custom webhook notifications'], done: false },
  { phase: 'Phase 04', title: 'Cognitive Model v2', items: ['Fine-tuned context reasoning model', 'Audio transcription mapping', 'Real-time news stream mapping'], done: false },
]

export function AboutPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#B58B63]/10 border border-[#B58B63]/30 flex items-center justify-center mx-auto shadow-[0_0_24px_rgba(181,139,99,0.15)]">
          <Shield size={28} className="text-[#B58B63]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">About Mis·Info</h1>
        <p className="text-[#A79E9C] max-w-xl mx-auto text-sm leading-relaxed">
          We engineer cognitive auditing pipelines to evaluate digital claim credibility, helping teams navigate the era of automated misinformation.
        </p>
      </div>

      {/* Grid: Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-white/10 bg-[#1e272b]/40 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#B58B63]/10 border border-[#B58B63]/30 flex items-center justify-center">
              <Target size={20} className="text-[#B58B63]" />
            </div>
            <h2 className="text-lg font-display font-semibold text-white">Our Mission</h2>
            <p className="text-sm text-[#A79E9C] leading-relaxed">
              To democratize advanced fact-checking. We build open, transparent, and auditable credibility assessment pipelines that ensure truth remains a standard, not a premium.
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#1e272b]/40 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-[#B58B63]/10 border border-[#B58B63]/30 flex items-center justify-center">
              <Brain size={20} className="text-[#B58B63]" />
            </div>
            <h2 className="text-lg font-display font-semibold text-white">Our Vision</h2>
            <p className="text-sm text-[#A79E9C] leading-relaxed">
              A public digital sphere anchored in audited assertions. We envision Mis·Info as the baseline credibility metric embedded in information networks, search engines, and developer API hubs.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
          <Zap size={20} className="text-[#B58B63]" /> Core Processing Engine
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Globe, title: 'Multi-Source Queries', desc: 'Queries 50+ governmental registers, fact-check indexes, and institutional source grids.' },
            { icon: Brain, title: 'Consensus Reasoning', desc: 'LLM instances analyze claims, evaluating contradictions, negations, and source credibility factors.' },
            { icon: CheckCircle, title: 'Calibrated Confidence', desc: 'Combines source reliability ratings, publication dates, and support metrics into a final Trust score.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <Card className="border-white/10 bg-[#1e272b]/30 hover:border-[#B58B63]/30 transition-all">
                <CardContent className="p-5 space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-[#B58B63]/10 flex items-center justify-center">
                    <item.icon size={18} className="text-[#B58B63]" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">{item.title}</h3>
                  <p className="text-xs text-[#A79E9C] leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
          <Code size={20} className="text-[#B58B63]" /> Engineering Architecture
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {techStack.map((tech, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-[#1e272b]/40 backdrop-blur-sm">
                <span className="text-xs font-semibold text-white">{tech.name}</span>
                <Badge variant="outline" className="text-[9px] border-white/10 text-[#A79E9C] tracking-wider uppercase font-mono">{tech.category}</Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="space-y-6">
        <h2 className="text-xl font-display font-semibold text-white flex items-center gap-2">
          <Rocket size={20} className="text-[#B58B63]" /> Development Roadmap
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {roadmap.map((phase, i) => (
            <Card key={i} className={`border-white/10 bg-[#1e272b]/40 backdrop-blur-sm ${phase.done ? 'border-[#B58B63]/30 shadow-[0_0_12px_rgba(181,139,99,0.06)]' : ''}`}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#A79E9C] uppercase tracking-wider">{phase.phase}</span>
                  <Badge variant={phase.done ? 'success' : 'outline'} className="font-mono text-[9px] uppercase tracking-wider">
                    {phase.done ? 'Completed' : 'Planned'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-white font-display text-base">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-[#A79E9C]">
                      <CheckCircle size={13} className={phase.done ? 'text-[#B58B63]' : 'text-[#A79E9C]/30'} />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
