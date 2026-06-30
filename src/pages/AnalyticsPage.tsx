import React from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Shield, AlertCircle, CheckCircle, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { DAILY_VERIFICATIONS, TOPIC_STATS, SCORE_DISTRIBUTION } from '../data/mockData'
import { useVerification } from '../contexts/VerificationContext'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']

const statCards = [
  { label: 'Total Verifications', value: '1,247', change: 12.5, icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Verified Claims', value: '483', change: 8.2, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
  { label: 'Misinformation Found', value: '312', change: -3.1, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  { label: 'Avg Trust Score', value: '67.4', change: 4.7, icon: Activity, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
]

export function AnalyticsPage() {
  const { reports } = useVerification()

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Insights into verification patterns and credibility trends.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    stat.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(stat.change)}%
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Daily Verifications Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Daily Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={DAILY_VERIFICATIONS}>
                <defs>
                  <linearGradient id="colorVerified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFalse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="verified" stroke="#22c55e" fill="url(#colorVerified)" strokeWidth={2} name="Verified" />
                <Area type="monotone" dataKey="false" stroke="#ef4444" fill="url(#colorFalse)" strokeWidth={2} name="False" />
                <Area type="monotone" dataKey="uncertain" stroke="#eab308" strokeWidth={2} fill="none" name="Uncertain" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Score Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={SCORE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="count" nameKey="label">
                  {SCORE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Legend formatter={(value) => <span style={{fontSize: '11px'}}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Topic Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Most Checked Topics</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={TOPIC_STATS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis dataKey="topic" type="category" width={80} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {reports.slice(0, 5).map((report, i) => (
              <div key={report.id} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  report.trustScore >= 75 ? 'bg-green-500' : report.trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{report.claim}</p>
                  <p className="text-xs text-muted-foreground">{report.topic}</p>
                </div>
                <div className={`text-sm font-bold ${
                  report.trustScore >= 75 ? 'text-green-500' : report.trustScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                }`}>{report.trustScore}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
