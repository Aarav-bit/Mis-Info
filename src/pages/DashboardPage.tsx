import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Link2, Image, ArrowRight, Sparkles, Shield, AlertCircle, Upload, Terminal, Cpu } from 'lucide-react'
import { useVerification } from '../contexts/VerificationContext'
import { AnalysisPipeline } from '../components/features/AnalysisPipeline'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { MOCK_REPORTS } from '../data/mockData'

type InputTab = 'text' | 'url' | 'screenshot'

const EXAMPLE_CLAIMS = [
  'Government announces free laptops for every student nationwide',
  'WHO releases new dengue advisory for Southeast Asian countries',
  'Fuel prices reduced nationwide by 15% effective immediately',
  'Scientists discover new treatment that cures type 2 diabetes completely',
]

// Mock system logs for the console footer
const SYSTEM_LOGS = [
  'SYSTEM: Cognitive node initialization complete.',
  'PROCESS: Listening for claim ingestion packets...',
  'AUDIT: Connected to Associated Press Registry v4.',
  'AUDIT: Reuters database sync active. Integrity 100%.',
  'SYSTEM: Pipeline diagnostics online. CPU temp: 42°C.',
]

// Mock live stream checks
const LIVE_FEEDS = [
  { claim: 'New space station launch delayed', source: 'NASA Wire', score: 94, status: 'Verified' },
  { claim: 'AI model achieves human consensus in policy debates', source: 'MIT Tech Review', score: 68, status: 'Auditing' },
  { claim: 'Subsea internet cable damaged in Baltic Sea', source: 'Associated Press', score: 87, status: 'Verified' },
  { claim: 'Free stock trading app offers $500 signup bonus', source: 'FinTech Blog', score: 28, status: 'Debunked' },
  { claim: 'Global temperature levels drop by 2 degrees', source: 'Earth Climate Inst', score: 14, status: 'Debunked' },
]

export function DashboardPage() {
  const navigate = useNavigate()
  const { verify, isAnalyzing, analysisStep } = useVerification()
  const [activeTab, setActiveTab] = useState<InputTab>('text')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  // Live rolling logs
  const [logs, setLogs] = useState<string[]>(SYSTEM_LOGS)
  const logContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLogs = [
        `AUDIT: Checked claim signature #${Math.floor(Math.random() * 80000 + 10000)}`,
        `PROCESS: Cross-referencing nodes for target keyword: ${activeTab === 'url' ? 'URL' : 'Claim'}`,
        'SYSTEM: Latency check: 18ms. Throughput stable.',
        'AUDIT: Querying academic journals index...',
      ]
      const newLog = randomLogs[Math.floor(Math.random() * randomLogs.length)]
      setLogs(prev => [...prev.slice(-4), newLog])
    }, 4500)
    return () => clearInterval(interval)
  }, [activeTab])

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  const handleVerify = async () => {
    if (!input.trim()) { setError('Please enter a claim description or URL.'); return }
    setError('')
    const reportId = await verify(input, activeTab)
    if (reportId) {
      navigate(`/report/${reportId}`)
    }
  }

  const tabs = [
    { id: 'text' as InputTab, label: 'Text Input', icon: <Search size={13} />, placeholder: 'Paste claim text or article paragraphs to audit...' },
    { id: 'url' as InputTab, label: 'Article URL', icon: <Link2 size={13} />, placeholder: 'https://news-outlet.com/article-to-verify' },
    { id: 'screenshot' as InputTab, label: 'Describe Image', icon: <Image size={13} />, placeholder: 'Describe the contents of the image or claim screenshot...' },
  ]

  if (isAnalyzing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-12">
        <AnalysisPipeline currentStep={analysisStep} />
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8 py-2">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-[#B58B63] animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-[#B58B63] uppercase">TACTICAL AUDITING APERTURE</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight mt-1">Cognitive Verification Console</h1>
        </div>
        <Badge variant="outline" className="border-[#B58B63]/20 text-[#B58B63] font-mono text-[9px] uppercase tracking-wider px-3 py-1">
          SYSTEM ACTIVE
        </Badge>
      </div>

      {/* Main Grid: Left Panel (Workspace) & Right Panel (Live Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass rounded-xl border border-white/10 overflow-hidden shadow-2xl bg-white/3">
            <div className="p-6 space-y-6">
              
              {/* Tab Selector */}
              <div className="flex gap-1 p-1 bg-white/5 border border-white/5 rounded-lg w-fit">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setInput(''); setError('') }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#B58B63] text-black font-semibold'
                        : 'text-[#A79E9C] hover:text-[#C9C0B9] hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Ingestion Drag & Drop Zone */}
              <div className="border border-dashed border-[#B58B63]/30 bg-black/20 rounded-xl p-8 flex flex-col items-center justify-center text-center group hover:border-[#B58B63]/60 transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#B58B63]/10 border border-[#B58B63]/25 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Upload size={18} className="text-[#B58B63]" />
                </div>
                <span className="text-xs font-mono text-white uppercase tracking-wider">Drag & drop files to ingest</span>
                <span className="text-[10px] text-[#A79E9C] font-mono mt-1 uppercase">Supports TXT, PDF, JPEG, PNG</span>
              </div>

              {/* Command Bar Input */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#B58B63]" />
                  <span className="text-[10px] font-mono text-[#A79E9C] uppercase tracking-wider">Audit Command Ingestion</span>
                </div>
                <textarea
                  value={input}
                  onChange={e => { setInput(e.target.value); setError('') }}
                  placeholder={tabs.find(t => t.id === activeTab)?.placeholder}
                  rows={activeTab === 'url' ? 2 : 4}
                  className="w-full rounded-xl border border-white/10 bg-black/40 text-[#C9C0B9] px-4 py-3 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-[#B58B63] placeholder:text-[#A79E9C]/40 transition-all"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-mono">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              {/* Submit Row */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[10px] font-mono text-[#A79E9C] uppercase tracking-wider">
                  Ingester ready
                </span>
                <Button
                  onClick={handleVerify}
                  variant="gradient"
                  rightIcon={<ArrowRight size={15} />}
                  className="font-mono text-xs uppercase tracking-wider px-6 h-10"
                >
                  Initiate Audit
                </Button>
              </div>

            </div>
          </div>

          {/* Quick suggestions */}
          <div className="space-y-3">
            <p className="text-[10px] text-[#A79E9C] font-mono uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={11} className="text-[#B58B63]" /> suggest claim templates:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_CLAIMS.map((claim, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveTab('text'); setInput(claim); setError('') }}
                  className="text-[11px] font-mono text-[#A79E9C] px-3.5 py-2 rounded border border-white/5 bg-[#1e272b]/30 hover:bg-[#B58B63]/10 hover:border-[#B58B63]/25 transition-all text-left max-w-full truncate"
                >
                  {claim}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Live Cognitive Feed */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-xl border border-white/10 overflow-hidden shadow-2xl bg-white/3">
            <div className="p-4 border-b border-white/5 bg-white/2">
              <h2 className="text-xs font-mono uppercase tracking-widest text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B58B63] animate-ping" />
                Live Verification Stream
              </h2>
            </div>
            <div className="p-4 space-y-3 max-h-[396px] overflow-y-auto scrollbar-hide">
              {LIVE_FEEDS.map((feed, i) => {
                const isHigh = feed.score >= 75
                const isMid = feed.score >= 50 && feed.score < 75
                const statusColor = isHigh ? 'text-green-400' : isMid ? 'text-yellow-400' : 'text-red-400'
                const statusBg = isHigh ? 'bg-green-500/10' : isMid ? 'bg-yellow-500/10' : 'bg-red-500/10'

                return (
                  <div key={i} className="p-3 bg-black/20 border border-white/5 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-[#A79E9C] uppercase">{feed.source}</span>
                      <span className={`px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${statusBg} ${statusColor}`}>
                        {feed.score}% {feed.status}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-white leading-normal line-clamp-2">
                      &ldquo;{feed.claim}&rdquo;
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Console Footer: System diagnostic logs */}
      <div className="glass rounded-xl border border-white/10 overflow-hidden bg-black/60 shadow-xl">
        <div className="px-4 py-2 border-b border-white/5 bg-white/2 flex items-center justify-between text-[10px] font-mono text-[#A79E9C]">
          <span className="uppercase tracking-wider flex items-center gap-2">
            <Terminal size={11} className="text-[#B58B63]" /> System Diagnostic Logs
          </span>
          <span>SYS_TEMP: Normal</span>
        </div>
        <div ref={logContainerRef} className="p-4 h-28 overflow-y-auto font-mono text-[11px] text-[#A79E9C] space-y-1 scrollbar-hide">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-[#B58B63]/60">[{new Date().toLocaleTimeString()}]</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
