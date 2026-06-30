import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Brain, Globe, Zap, CheckCircle, Target, Rocket, Code } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

const techStack = [
  { name: 'React 18', category: 'Frontend', color: 'info' as const },
  { name: 'TypeScript', category: 'Language', color: 'default' as const },
  { name: 'Vite', category: 'Build Tool', color: 'info' as const },
  { name: 'TailwindCSS', category: 'Styling', color: 'info' as const },
  { name: 'Framer Motion', category: 'Animation', color: 'default' as const },
  { name: 'Recharts', category: 'Analytics', color: 'info' as const },
  { name: 'React Router', category: 'Routing', color: 'default' as const },
  { name: 'Lucide Icons', category: 'Icons', color: 'default' as const },
]

const roadmap = [
  { phase: 'Q1 2024', title: 'MVP Launch', items: ['Core verification engine', 'Trust Score algorithm', 'Basic dashboard'], done: true },
  { phase: 'Q2 2024', title: 'Beta Features', items: ['Real-time API integration', 'Browser extension', 'Team workspace'], done: false },
  { phase: 'Q3 2024', title: 'Scale & Grow', items: ['Multi-language support', 'Enterprise tier', 'Webhook API'], done: false },
  { phase: 'Q4 2024', title: 'AI v2', items: ['Fine-tuned verification model', 'Audio transcription support', 'GraphQL API'], done: false },
]

export function AboutPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-10">
      {/* Hero */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
          <Shield size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">About TrustLens AI</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">We are on a mission to help people navigate the age of misinformation with confidence and clarity.</p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Target size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">Our Mission</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To democratize fact-checking by making professional-grade misinformation detection accessible to everyone &mdash; from individual citizens to major news organizations. We believe truth should be a right, not a privilege.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
              <Brain size={20} className="text-cyan-500" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">Our Vision</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A world where information is verified before it goes viral. We envision TrustLens AI as the universal standard for credibility verification &mdash; embedded in every social platform, news outlet, and search engine.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How it works */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><Zap size={20} className="text-primary" /> How the AI Works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Globe, title: 'Multi-source Search', desc: 'Our AI simultaneously queries 50+ trusted databases, news APIs, and fact-checking organizations.' },
            { icon: Brain, title: 'LLM Reasoning', desc: 'Advanced language models analyze the semantic relationship between claims and evidence, detecting contradictions.' },
            { icon: CheckCircle, title: 'Consensus Scoring', desc: 'A weighted consensus algorithm combines source reliability, recency, and corroboration into the Trust Score.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card hover>
                <CardContent className="p-5">
                  <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center mb-3">
                    <item.icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><Code size={20} className="text-primary" /> Technology Stack</h2>
        <div className="flex flex-wrap gap-3">
          {techStack.map((tech, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card">
                <span className="text-sm font-medium text-foreground">{tech.name}</span>
                <Badge variant={tech.color} className="text-xs">{tech.category}</Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><Rocket size={20} className="text-primary" /> Roadmap</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {roadmap.map((phase, i) => (
            <Card key={i} className={phase.done ? 'border-primary/30' : ''}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-muted-foreground">{phase.phase}</span>
                  <Badge variant={phase.done ? 'success' : 'outline'}>{phase.done ? 'Completed' : 'Upcoming'}</Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-3">{phase.title}</h3>
                <ul className="space-y-1.5">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle size={13} className={phase.done ? 'text-green-500' : 'text-muted-foreground/50'} />
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
