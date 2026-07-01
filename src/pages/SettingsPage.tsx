import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Monitor, Bell, Key, User, Shield, Save, Eye, EyeOff } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [apiKey, setApiKey] = useState('mi_sk_verify_xxxx_883a91bc77')
  const [notifications, setNotifications] = useState({ email: true, browser: false, weekly: true })

  const themes = [
    { id: 'light' as const, label: 'Light Theme', icon: Sun },
    { id: 'dark' as const, label: 'Dark Theme', icon: Moon },
    { id: 'system' as const, label: 'System Sync', icon: Monitor },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6 py-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">Settings</h1>
        <p className="text-[#6DA5C0] text-sm mt-1">Manage credentials, appearance configurations, and digest notifications.</p>
      </div>

      {/* Profile Card */}
      <Card className="border-white/10 bg-[#072e33]/40 backdrop-blur-sm">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-white font-display text-base">
            <User size={18} className="text-[#0F969C]" /> Account Profile
          </CardTitle>
          <CardDescription className="text-[#6DA5C0]">Developer account details</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#0F969C]/10 border border-[#0F969C]/30 flex items-center justify-center font-display font-bold text-[#0F969C] text-xl">
              MI
            </div>
            <div>
              <div className="font-semibold text-white">Auditor Account</div>
              <div className="text-sm text-[#6DA5C0]">auditor@misinfo.ai</div>
              <Badge variant="info" className="mt-2 font-mono text-[9px] uppercase tracking-wider">Premium Access</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Cards */}
      <Card className="border-white/10 bg-[#072e33]/40 backdrop-blur-sm">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-white font-display text-base">
            <Sun size={18} className="text-[#0F969C]" /> Workspace Appearance
          </CardTitle>
          <CardDescription className="text-[#6DA5C0]">Select your preferred user interface appearance.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-3">
            {themes.map(t => {
              const active = theme === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                    active
                      ? 'border-[#0F969C] bg-[#0F969C]/15 text-white shadow-[0_0_12px_rgba(15, 150, 156,0.15)]'
                      : 'border-white/5 hover:border-white/20 bg-[#05161A] text-[#6DA5C0]'
                  }`}
                >
                  <t.icon size={20} className={active ? 'text-[#0F969C]' : 'text-[#6DA5C0]'} />
                  <span className={`text-xs font-mono uppercase tracking-wider ${active ? 'font-bold' : ''}`}>{t.label}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card className="border-white/10 bg-[#072e33]/40 backdrop-blur-sm">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-white font-display text-base">
            <Key size={18} className="text-[#0F969C]" /> Integration API Key
          </CardTitle>
          <CardDescription className="text-[#6DA5C0]">Required for programmatic scanning audits.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={apiKeyVisible ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full h-10 rounded-lg border border-white/10 bg-black/25 px-4 text-xs font-mono text-[#E6F3F5] focus:outline-none focus:ring-2 focus:ring-[#0F969C] transition-all"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setApiKeyVisible(p => !p)}
              className="border-white/10 hover:bg-white/5 text-[#6DA5C0] hover:text-[#E6F3F5]"
            >
              {apiKeyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-[#6DA5C0] hover:text-[#E6F3F5] font-mono text-xs uppercase tracking-wider">Regen</Button>
          </div>
          <p className="text-[10px] font-mono text-[#6DA5C0] uppercase tracking-wider">Never share this key. Store it securely in environmental variables.</p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-white/10 bg-[#072e33]/40 backdrop-blur-sm">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-white font-display text-base">
            <Bell size={18} className="text-[#0F969C]" /> Notification Preferences
          </CardTitle>
          <CardDescription className="text-[#6DA5C0]">Configure delivery options for verification digests.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 divide-y divide-white/5">
          {[
            { key: 'email' as const, label: 'Email Reports', desc: 'Receive detailed PDF verification reports via email.' },
            { key: 'browser' as const, label: 'Push Notifications', desc: 'Receive real-time notifications on browser desktop.' },
            { key: 'weekly' as const, label: 'Weekly Summary Digest', desc: 'A weekly compiled analysis statement.' },
          ].map((item, idx) => (
            <div key={item.key} className={`flex items-center justify-between py-4 ${idx === 0 ? 'pt-0' : ''} ${idx === 2 ? 'pb-0' : ''}`}>
              <div>
                <div className="text-sm font-semibold text-white">{item.label}</div>
                <div className="text-xs text-[#6DA5C0] mt-1">{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors border ${
                  notifications[item.key] ? 'bg-[#0F969C]/25 border-[#0F969C]' : 'bg-[#05161A] border-white/10'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full transition-transform ${
                  notifications[item.key] ? 'translate-x-5 bg-[#0F969C]' : 'translate-x-0 bg-[#6DA5C0]'
                }`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-white/10 bg-[#072e33]/40 backdrop-blur-sm">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-white font-display text-base">
            <Shield size={18} className="text-[#0F969C]" /> System Security
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/10">
            <div>
              <div className="text-sm font-semibold text-white">Two-Factor Authentication</div>
              <div className="text-xs text-[#6DA5C0] mt-1">Add authentication steps using hardware security tokens.</div>
            </div>
            <Badge variant="warning" className="font-mono text-[9px] uppercase tracking-wider">Deactivated</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-black/10">
            <div>
              <div className="text-sm font-semibold text-white">Active Sessions</div>
              <div className="text-xs text-[#6DA5C0] mt-1">1 active auditor connection verified.</div>
            </div>
            <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-[#6DA5C0] hover:text-[#E6F3F5] font-mono text-xs uppercase tracking-wider">Terminate</Button>
          </div>
        </CardContent>
      </Card>

      <Button variant="gradient" className="w-full h-12" leftIcon={<Save size={16} />}>
        Save Configuration settings
      </Button>
    </motion.div>
  )
}
