import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { TrendingUp, TrendingDown, Shield, AlertCircle, CheckCircle, Activity, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { DAILY_VERIFICATIONS, TOPIC_STATS, SCORE_DISTRIBUTION } from '../data/mockData'
import { useVerification } from '../contexts/VerificationContext'

const CHART_COLORS = ['#072E33', '#0F969C', '#6DA5C0', '#E6F3F5', '#0C7075']


export function AnalyticsPage() {
  const { reports } = useVerification()
  const [range, setRange] = useState('MAY 01 - MAY 22, 2026')

  const hudStats = [
    { label: 'TOTAL INGESTED', value: '14.8M', trend: '+12.5%', isUp: true, detail: 'Data packets mapped' },
    { label: 'ACCURACY INDEX', value: '98.4%', trend: 'STABLE', isUp: true, detail: 'Validation delta' },
    { label: 'DISMANTLED CLAIMS', value: '42.1K', trend: '+8.2%', isUp: true, detail: 'Debunk logs indexed' },
    { label: 'COGNITIVE UPTIME', value: '99.99%', trend: 'ACTIVE', isUp: true, detail: 'Node verification thread' },
  ]

  // Mock live logger feed
  const liveLogs = [
    { time: '11:42:01', label: 'CLAIM VERIFIED: [ID-48291]', type: 'success' },
    { time: '11:40:15', label: 'CROSS-CHECK INITIATED: AP REGISTRY', type: 'info' },
    { time: '11:38:44', label: 'NEGATION PENALTY CALCULATED: [ID-47120]', type: 'warning' },
    { time: '11:35:12', label: 'INGESTION SEQUENCE COMPLETE: IMAGE UPLOAD', type: 'info' },
    { time: '11:32:09', label: 'CLAIM VERIFIED: [ID-46199]', type: 'success' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8 py-2">
      
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[#0F969C]" />
            <span className="text-[10px] font-mono tracking-widest text-[#0F969C] uppercase">TACTICAL ANALYSIS BOARD</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight mt-1">Credibility Analytics & Trends</h1>
          <p className="text-[#6DA5C0] text-xs font-mono mt-1 uppercase">Real-time truth verification & network integrity monitoring</p>
        </div>

        {/* Date Picker Trigger */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded font-mono text-xs text-[#6DA5C0] cursor-pointer hover:border-[#0F969C]/40 transition-colors">
          <Calendar size={13} className="text-[#0F969C]" />
          <span>{range}</span>
        </div>
      </div>

      {/* HUD Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {hudStats.map((stat, i) => (
          <Card key={i} className="border border-white/5 bg-[#072e33]/30">
            <CardContent className="p-5">
              <div className="flex justify-between items-center text-[9px] font-mono text-[#6DA5C0] uppercase tracking-wider mb-2">
                <span>{stat.label}</span>
                <span className={stat.isUp ? 'text-green-400' : 'text-red-400'}>{stat.trend}</span>
              </div>
              <div className="text-2xl font-display font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-[9px] font-mono text-[#6DA5C0] mt-2 uppercase tracking-wide opacity-60">
                {stat.detail}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Area & Logger Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Analytical Charts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chart 1: Daily Verification Volume */}
          <Card className="border border-white/10 bg-[#072e33]/40 backdrop-blur-md">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-white font-display text-sm flex items-center gap-2 uppercase tracking-wider font-semibold">
                Daily Verification Volume
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={DAILY_VERIFICATIONS}>
                  <defs>
                    <linearGradient id="gCopper" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F969C" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0F969C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6DA5C0', fontFamily: 'monospace' }} stroke="rgba(255,255,255,0.05)" />
                  <YAxis tick={{ fontSize: 10, fill: '#6DA5C0', fontFamily: 'monospace' }} stroke="rgba(255,255,255,0.05)" />
                  <Tooltip contentStyle={{ background: '#072E33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '11px', color: '#E6F3F5' }} />
                  <Area type="monotone" dataKey="verified" stroke="#0F969C" fill="url(#gCopper)" strokeWidth={2} name="Audits Run" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Grids: Donut Score and Topic Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Score Donut */}
            <Card className="border border-white/10 bg-[#072e33]/40 backdrop-blur-md">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-white font-display text-xs uppercase tracking-wider font-semibold">
                  Score Distribution Donut
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={SCORE_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      dataKey="count"
                      nameKey="label"
                      stroke="none"
                    >
                      {SCORE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#072E33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '11px', color: '#E6F3F5' }} />
                    <Legend formatter={(value) => <span className="text-[10px] font-mono text-[#6DA5C0] uppercase tracking-wider">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Horizontal Bar Chart */}
            <Card className="border border-white/10 bg-[#072e33]/40 backdrop-blur-md">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-white font-display text-xs uppercase tracking-wider font-semibold">
                  Topic Volume Map
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={TOPIC_STATS} layout="vertical">
                    <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.03)" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#6DA5C0', fontFamily: 'monospace' }} stroke="rgba(255,255,255,0.05)" />
                    <YAxis dataKey="topic" type="category" width={72} tick={{ fontSize: 10, fill: '#6DA5C0', fontFamily: 'monospace' }} stroke="rgba(255,255,255,0.05)" />
                    <Tooltip contentStyle={{ background: '#072E33', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '11px', color: '#E6F3F5' }} />
                    <Bar dataKey="count" fill="#0F969C" radius={[0, 2, 2, 0]} name="Audits" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Right Side: Tactical Activity Logger */}
        <div className="lg:col-span-4 h-full">
          <Card className="border border-white/10 bg-[#072e33]/40 backdrop-blur-md h-full">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-white font-display text-sm flex items-center gap-2 uppercase tracking-wider font-semibold">
                Live Activity Logger
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {liveLogs.map((log, idx) => {
                const nodeColor = log.type === 'success' ? 'bg-green-400' : log.type === 'warning' ? 'bg-yellow-400' : 'bg-cyan-400'
                return (
                  <div key={idx} className="flex gap-3 items-start text-xs font-mono">
                    <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${nodeColor} animate-pulse`} />
                    <div className="space-y-1 min-w-0">
                      <div className="text-[10px] text-[#6DA5C0]">{log.time}</div>
                      <p className="text-white truncate uppercase tracking-wide">{log.label}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

      </div>

    </motion.div>
  )
}
