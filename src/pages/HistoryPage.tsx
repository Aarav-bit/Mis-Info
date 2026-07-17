import React, { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Bookmark, BookmarkCheck, Clock, ArrowRight, FolderKanban } from 'lucide-react'
import { useVerification } from '../contexts/VerificationContext'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { formatDate } from '../lib/utils'
import type { VerificationReport } from '../types'

// ⚡ Bolt Performance Optimization:
// Why: Toggling a bookmark updated the global reports state, causing O(N) re-renders
//      for every single report card in the history list (expensive for large lists).
// What: Extracted the card to a separate component and wrapped it in React.memo(),
//       passing memoized callbacks.
// Impact: Reduces re-renders by 100% for unaffected cards. Toggling a bookmark now
//         only re-renders the specific card being toggled.
interface HistoryCardProps {
  report: VerificationReport;
  index: number;
  onNavigate: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

const HistoryCard = React.memo(({ report, index, onNavigate, onToggleBookmark }: HistoryCardProps) => {
  const isHigh = report.trustScore >= 75
  const isMid = report.trustScore >= 50 && report.trustScore < 75
  const borderStyle = isHigh ? 'hover:border-green-500/30' : isMid ? 'hover:border-yellow-500/30' : 'hover:border-red-500/30'
  const scoreColor = isHigh ? 'text-green-400' : isMid ? 'text-yellow-400' : 'text-red-400'
  const scoreBorder = isHigh ? 'border-green-500/30 bg-green-500/5' : isMid ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-red-500/30 bg-red-500/5'

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, borderColor: 'rgba(208, 255, 0,0.3)' }}
      onClick={() => onNavigate(report.id)}
      className={`glass rounded-xl border border-white/5 p-5 bg-[#141021]/30 cursor-pointer flex flex-col justify-between h-[210px] transition-all duration-200 group ${borderStyle}`}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] font-mono text-[#8E8A9F] uppercase tracking-wider">{report.topic}</span>
          <button
            onClick={e => { e.stopPropagation(); onToggleBookmark(report.id) }}
            className="text-[#8E8A9F] hover:text-[#D0FF00] transition-colors"
          >
            {report.bookmarked ? (
              <BookmarkCheck size={16} className="text-[#D0FF00]" />
            ) : (
              <Bookmark size={16} />
            )}
          </button>
        </div>

        <p className="text-xs font-semibold font-mono text-white leading-relaxed line-clamp-3 group-hover:text-[#D0FF00] transition-colors">
          &ldquo;{report.claim}&rdquo;
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
        <span className="text-[10px] font-mono text-[#8E8A9F]">
          {new Date(report.createdAt).toLocaleDateString()}
        </span>

        <div className={`flex items-center gap-1.5 px-3 py-1 rounded border font-mono text-xs font-bold ${scoreBorder} ${scoreColor}`}>
          <span>INDEX:</span>
          <span>{report.trustScore}%</span>
        </div>
      </div>
    </motion.div>
  )
})

export function HistoryPage() {
  const navigate = useNavigate()
  const handleNavigate = useCallback((id: string) => navigate(`/report/${id}`), [navigate])
  const { reports, toggleBookmark } = useVerification()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'bookmarked'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Get unique topics for category filter
  const topics = useMemo(() => ['all', ...Array.from(new Set(reports.map(r => r.topic)))], [reports])

  const filtered = useMemo(() => {
    const lowerSearch = search.toLowerCase()
    return reports.filter(r => {
      const matchesSearch = r.claim.toLowerCase().includes(lowerSearch) || r.topic.toLowerCase().includes(lowerSearch)
      const matchesFilter = filter === 'all' || (filter === 'bookmarked' && r.bookmarked)
      const matchesCategory = categoryFilter === 'all' || r.topic === categoryFilter
      return matchesSearch && matchesFilter && matchesCategory
    })
  }, [reports, search, filter, categoryFilter])

  // Large mock counts mapped to show vault data
  const stats = useMemo(() => {
    const totalCount = reports.length
    let trueCount = 0
    let uncertainCount = 0
    let falseCount = 0

    for (const r of reports) {
      if (r.trustScore >= 75) trueCount++
      else if (r.trustScore >= 40) uncertainCount++
      else falseCount++
    }

    return [
      { label: 'Total Audits Indexed', value: totalCount, highlight: 'text-white' },
      { label: 'Verified True Nodes', value: trueCount, highlight: 'text-[#D0FF00]' },
      { label: 'Uncertain Calibration', value: uncertainCount, highlight: 'text-yellow-400' },
      { label: 'Exposed Misinformation', value: falseCount, highlight: 'text-red-400' },
    ]
  }, [reports])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8 py-2">
      
      {/* Header section with Title and Search/Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FolderKanban size={14} className="text-[#D0FF00]" />
            <span className="text-[10px] font-mono tracking-widest text-[#D0FF00] uppercase">DIGITAL CORROBORATION VAULT</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight mt-1">Audited Records Archive</h1>
        </div>
        
        {/* Ingestion Search Console */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search index keywords..."
              className="h-10 pl-9 pr-4 rounded bg-black/40 border border-white/10 text-xs font-mono text-[#FEFFFC] focus:outline-none focus:border-[#D0FF00] transition-all w-52"
            />
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8A9F]" />
          </div>
          
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded bg-black/40 border border-white/10 text-xs font-mono text-[#8E8A9F] focus:outline-none focus:border-[#D0FF00]"
          >
            <option value="all">ALL CATEGORIES</option>
            {topics.filter(t => t !== 'all').map(topic => (
              <option key={topic} value={topic}>{topic.toUpperCase()}</option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilter(p => p === 'all' ? 'bookmarked' : 'all')}
            className={`h-10 border-white/10 ${filter === 'bookmarked' ? 'bg-[#D0FF00]/10 border-[#D0FF00]/30 text-white' : 'text-[#8E8A9F]'}`}
          >
            {filter === 'bookmarked' ? 'BOOKMARKS ACTIVE' : 'BOOKMARKS'}
          </Button>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border border-white/5 bg-[#141021]/30">
            <CardContent className="p-5 text-center">
              <div className={`text-2xl font-display font-bold ${stat.highlight}`}>{stat.value}</div>
              <div className="text-[10px] font-mono text-[#8E8A9F] uppercase tracking-wider mt-2">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Archive Grid (3 Columns) */}
      <div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#141021]/20 border border-white/5 rounded-xl p-8 max-w-sm mx-auto">
            <Clock size={36} className="mx-auto mb-4 text-[#8E8A9F]" />
            <p className="font-mono text-sm text-[#FEFFFC]">NO VAULT ENTRIES FOUND</p>
            <p className="text-xs text-[#8E8A9F] mt-1 font-mono uppercase">Adjust index queries or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((report, index) => (
              <HistoryCard
                key={report.id}
                report={report}
                index={index}
                onNavigate={handleNavigate}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </div>

    </motion.div>
  )
}
