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
  const [apiKey, setApiKey] = useState('tl_sk_demo_xxxxxxxxxxxxxxxxxxxx')
  const [notifications, setNotifications] = useState({ email: true, browser: false, weekly: true })

  const themes = [
    { id: 'light' as const, label: 'Light', icon: Sun },
    { id: 'dark' as const, label: 'Dark', icon: Moon },
    { id: 'system' as const, label: 'System', icon: Monitor },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your TrustLens AI preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User size={18} className="text-primary" /> Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center">
              <span className="text-2xl font-bold text-white">TL</span>
            </div>
            <div>
              <div className="font-semibold text-foreground">TrustLens Demo User</div>
              <div className="text-sm text-muted-foreground">demo@trustlens.ai</div>
              <Badge variant="info" className="mt-1">Beta Tester</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Sun size={18} className="text-primary" /> Appearance</CardTitle>
          <CardDescription>Choose your preferred theme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  theme === t.id ? 'border-primary bg-primary/10' : 'border-border hover:border-border/80 bg-background'
                }`}
              >
                <t.icon size={20} className={theme === t.id ? 'text-primary' : 'text-muted-foreground'} />
                <span className={`text-sm font-medium ${theme === t.id ? 'text-primary' : 'text-muted-foreground'}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Key size={18} className="text-primary" /> API Key</CardTitle>
          <CardDescription>Use this key to access the TrustLens API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={apiKeyVisible ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => setApiKeyVisible(p => !p)}>
              {apiKeyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
            <Button variant="outline" size="sm">Regenerate</Button>
          </div>
          <p className="text-xs text-muted-foreground">Keep this key secret. Never share it publicly.</p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell size={18} className="text-primary" /> Notifications</CardTitle>
          <CardDescription>Configure how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'email' as const, label: 'Email Notifications', desc: 'Receive verification reports via email' },
            { key: 'browser' as const, label: 'Browser Notifications', desc: 'Get real-time browser push notifications' },
            { key: 'weekly' as const, label: 'Weekly Digest', desc: 'Weekly summary of verification activity' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key] }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications[item.key] ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield size={18} className="text-primary" /> Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div>
              <div className="text-sm font-medium text-foreground">Two-Factor Authentication</div>
              <div className="text-xs text-muted-foreground">Add an extra layer of security</div>
            </div>
            <Badge variant="warning">Not Set Up</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div>
              <div className="text-sm font-medium text-foreground">Session Management</div>
              <div className="text-xs text-muted-foreground">1 active session</div>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </CardContent>
      </Card>

      <Button variant="gradient" className="w-full" leftIcon={<Save size={16} />}>Save Settings</Button>
    </motion.div>
  )
}
