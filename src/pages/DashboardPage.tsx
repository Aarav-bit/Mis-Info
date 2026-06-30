import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Link2, Image, ArrowRight, Sparkles, Shield, AlertCircle } from 'lucide-react'
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

export function DashboardPage() {
  const navigate = useNavigate()
  const { verify, isAnalyzing, analysisStep, currentReport } = useVerification()
  const [activeTab, setActiveTab] = useState<InputTab>('text')
  const [input, setInput] = useState('')
  const [error, setError] = useState('')

  const handleVerify = async () => {
    if (!input.trim()) { setError('Please enter something to verify.'); return }
    setError('')
    const reportId = await verify(input, activeTab)
    if (reportId) {
      navigate(`/report/${reportId}`)
    }
  }

  const tabs = [
    { id: 'text' as InputTab, label: 'Paste Text', icon: <Search size={15} />, placeholder: 'Paste a news article, claim, or social media post to verify...' },
    { id: 'url' as InputTab, label: 'News URL', icon: <Link2 size={15} />, placeholder: 'https://example.com/news-article' },
    { id: 'screenshot' as InputTab, label: 'Description', icon: <Image size={15} />, placeholder: 'Describe the content you want to verify...' },
  ]

  if (isAnalyzing) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto"><AnalysisPipeline currentStep={analysisStep} /></motion.div>
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1"><Sparkles size={18} className="text-primary" /><span className="text-sm font-medium text-primary">AI Verification Engine</span></div>
        <h1 className="text-2xl font-bold text-foreground">Verify a Claim or Article</h1>
        <p className="text-muted-foreground text-sm mt-1">Submit any textual content and our AI will analyze its credibility in seconds.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-1 mb-4 p-1 bg-secondary rounded-lg w-fit">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setInput('') }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
              <textarea value={input} onChange={e => { setInput(e.target.value); setError('') }}
                placeholder={tabs.find(t => t.id === activeTab)?.placeholder}
                rows={activeTab === 'url' ? 2 : 6}
                className={`w-full rounded-lg border bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-colors ${error ? 'border-red-500 focus:ring-red-500' : 'border-input'}`}
              />
            </motion.div>
          </AnimatePresence>
          {error && <div className="flex items-center gap-2 mt-2 text-red-500 text-sm"><AlertCircle size={14} />{error}</div>}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground">{input.length > 0 ? `${input.length} characters` : 'Supports text, headlines, and URLs'}</span>
            <Button onClick={handleVerify} variant="gradient" rightIcon={<ArrowRight size={16} />} loading={isAnalyzing}>Verify Now</Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1"><Sparkles size={12} /> Try an example claim:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_CLAIMS.map((claim, i) => (
            <button key={i} onClick={() => { setActiveTab('text'); setInput(claim); setError('') }}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background hover:bg-accent hover:border-primary/50 transition-all text-muted-foreground hover:text-foreground">
              {claim.length > 50 ? claim.substring(0, 50) + '...' : claim}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2"><Shield size={16} className="text-primary" /> Recent Verifications</h2>
        <div className="space-y-2">
          {MOCK_REPORTS.slice(0, 3).map(report => (
            <motion.div key={report.id} whileHover={{ x: 2 }} onClick={() => navigate(`/report/${report.id}`)}
              className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-primary/50 cursor-pointer transition-all group">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${report.trustScore >= 75 ? 'bg-green-500' : report.trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>{report.trustScore}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{report.claim}</p>
                <p className="text-xs text-muted-foreground">{report.topic} &bull; {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant={report.trustScore >= 75 ? 'success' : report.trustScore >= 50 ? 'warning' : 'danger'}>{report.status}</Badge>
                <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
