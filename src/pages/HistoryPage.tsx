import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Bookmark, BookmarkCheck, Filter, Clock, ArrowRight } from 'lucide-react'
import { useVerification } from '../contexts/VerificationContext'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { formatDate } from '../lib/utils'

export function HistoryPage() {
  const navigate = useNavigate()
  const { reports, toggleBookmark } = useVerification()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'bookmarked'>('all')

  const filtered = reports.filter(r => {
    const matchesSearch = r.claim.toLowerCase().includes(search.toLowerCase()) || r.topic.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'bookmarked' && r.bookmarked)
    return matchesSearch && matchesFilter
  })

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Verification History</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse, search, and bookmark your past verification reports.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: reports.length, color: 'text-foreground' },
          { label: 'Verified', value: reports.filter(r => r.trustScore >= 75).length, color: 'text-green-500' },
          { label: 'Uncertain', value: reports.filter(r => r.trustScore >= 40 && r.trustScore < 75).length, color: 'text-yellow-500' },
          { label: 'False', value: reports.filter(r => r.trustScore < 40).length, color: 'text-red-500' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by claim or topic..."
            leftIcon={<Search size={15} />}
          />
        </div>
        <div className="flex gap-2">
          <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
          <Button variant={filter === 'bookmarked' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('bookmarked')} leftIcon={<Bookmark size={14} />}>Bookmarked</Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">No verifications found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            filtered.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 pl-2"
              >
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-2 relative z-10 ${
                  report.trustScore >= 75 ? 'bg-green-500' : report.trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {report.trustScore >= 75 ? '✓' : report.trustScore >= 50 ? '?' : '✗'}
                </div>
                <div
                  onClick={() => navigate(`/report/${report.id}`)}
                  className="flex-1 border border-border rounded-xl p-4 bg-card hover:border-primary/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-snug">{report.claim}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={10} /> {formatDate(report.createdAt)}
                        </span>
                        <Badge variant="outline" className="text-xs">{report.topic}</Badge>
                        <Badge variant={report.trustScore >= 75 ? 'success' : report.trustScore >= 50 ? 'warning' : 'danger'}>
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`text-2xl font-bold ${
                        report.trustScore >= 75 ? 'text-green-500' : report.trustScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                      }`}>{report.trustScore}</div>
                      <button
                        onClick={e => { e.stopPropagation(); toggleBookmark(report.id) }}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {report.bookmarked ? <BookmarkCheck size={16} className="text-primary" /> : <Bookmark size={16} />}
                      </button>
                      <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}
