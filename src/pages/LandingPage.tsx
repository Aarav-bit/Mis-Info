import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, ArrowRight, CheckCircle, Globe, Brain, Zap, BarChart3, Lock, Star, ChevronDown } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

const features = [
  { icon: Brain, title: 'AI-Powered Analysis', description: 'Advanced LLM reasoning evaluates claims against thousands of trusted sources in seconds.' },
  { icon: Globe, title: 'Source Verification', description: 'Cross-references 50+ premium news outlets, government sites, and academic databases.' },
  { icon: BarChart3, title: 'Trust Score Engine', description: 'Proprietary scoring algorithm gives you a clear 0-100 credibility rating with explanations.' },
  { icon: Lock, title: 'Privacy First', description: 'Your queries are never stored or used for training. Enterprise-grade security.' },
  { icon: Zap, title: 'Real-time Speed', description: 'Get comprehensive verification reports in under 10 seconds.' },
  { icon: CheckCircle, title: 'Explainable AI', description: 'Transparent reasoning so you understand why a claim scored the way it did.' },
]

const stats = [
  { value: '2.4M+', label: 'Claims Verified' },
  { value: '99.2%', label: 'Accuracy Rate' },
  { value: '50+', label: 'Trusted Sources' },
  { value: '<8s', label: 'Avg. Response Time' },
]

const examples = [
  { claim: 'WHO releases new dengue advisory', score: 91, status: 'Verified', color: 'green' },
  { claim: 'Fuel prices reduced nationwide', score: 65, status: 'Needs Verification', color: 'yellow' },
  { claim: 'Government gives free laptops to all students', score: 34, status: 'Likely False', color: 'red' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border/50 glass">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <span className="font-bold text-foreground">TrustLens <span className="gradient-text">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
        </div>
        <Link to="/dashboard">
          <Button size="sm" variant="gradient">Try Demo <ArrowRight size={14} /></Button>
        </Link>
      </nav>

      <section className="relative flex flex-col items-center justify-center min-h-screen pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(37,99,235,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="info" className="mb-6 text-sm px-4 py-1.5"><Zap size={12} /> Powered by Advanced AI Reasoning</Badge>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
            Verify Before<br /><span className="gradient-text">You Believe.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered misinformation verification platform. Paste any claim, article, or news headline and get a comprehensive credibility report in seconds.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard"><Button size="lg" variant="gradient" className="w-full sm:w-auto">Try Demo Free <ArrowRight size={18} /></Button></Link>
            <a href="#how-it-works"><Button size="lg" variant="outline" className="w-full sm:w-auto">Learn More <ChevronDown size={18} /></Button></a>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="relative w-full max-w-2xl mt-16 animate-float">
          <div className="glass rounded-2xl p-6 border border-border shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 h-7 rounded-md bg-secondary flex items-center px-3">
                <span className="text-xs text-muted-foreground">app.trustlens.ai/dashboard</span>
              </div>
            </div>
            <div className="space-y-3">
              {examples.map((ex, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.2 }} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                  <span className="text-sm text-foreground flex-1 truncate pr-4">{ex.claim}</span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-lg font-bold ${ex.color === 'green' ? 'text-green-500' : ex.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'}`}>{ex.score}</span>
                    <Badge variant={ex.color === 'green' ? 'success' : ex.color === 'yellow' ? 'warning' : 'danger'}>{ex.status}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="how-it-works" className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="info" className="mb-4">The Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How TrustLens Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A 5-step AI pipeline that gives you verifiable, explainable results</p>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {[{step:'01',label:'Submit',desc:'Paste text, URL, or upload'},{step:'02',label:'Extract',desc:'AI extracts core claims'},{step:'03',label:'Search',desc:'Cross-references sources'},{step:'04',label:'Score',desc:'Generates Trust Score'},{step:'05',label:'Report',desc:'Full explanation delivered'}].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-3 text-white font-bold text-sm">{item.step}</div>
                <div className="font-semibold text-foreground text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="info" className="mb-4">Capabilities</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for the Truth-Seekers</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="glass rounded-xl p-6 border border-border hover:border-primary/50 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative">
            <div className="relative glass rounded-2xl p-12 border border-border">
              <Star className="mx-auto mb-4 text-yellow-500" size={32} />
              <h2 className="text-3xl font-bold text-foreground mb-4">Start Verifying Today</h2>
              <p className="text-muted-foreground mb-8">Join thousands of journalists, researchers, and fact-checkers who trust TrustLens AI.</p>
              <Link to="/dashboard"><Button size="lg" variant="gradient">Try the Free Demo <ArrowRight size={18} /></Button></Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-bg flex items-center justify-center"><Shield size={12} className="text-white" /></div>
            <span className="text-sm font-medium text-foreground">TrustLens AI</span>
            <span className="text-xs text-muted-foreground">&copy; 2024</span>
          </div>
          <div className="flex gap-6">
            <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground">About</Link>
            <Link to="/settings" className="text-xs text-muted-foreground hover:text-foreground">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
