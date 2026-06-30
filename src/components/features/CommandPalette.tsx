import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, History, BarChart3, Settings, Info, Shield, Search, ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

const commands = [
  { id: 'dashboard', label: 'Go to Workspace', icon: LayoutDashboard, path: '/dashboard', group: 'Navigation' },
  { id: 'history', label: 'Verification History', icon: History, path: '/history', group: 'Navigation' },
  { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3, path: '/analytics', group: 'Navigation' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings', group: 'Navigation' },
  { id: 'about', label: 'About TrustLens', icon: Info, path: '/about', group: 'Navigation' },
  { id: 'verify', label: 'Start New Verification', icon: Shield, path: '/dashboard', group: 'Actions' },
]

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.group.toLowerCase().includes(query.toLowerCase())
  )

  const groups = [...new Set(filtered.map(c => c.group))]

  const handleSelect = useCallback((path: string) => {
    navigate(path)
    onClose()
    setQuery('')
  }, [navigate, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="rounded-xl border border-border bg-popover shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={16} className="text-muted-foreground flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  onKeyDown={e => e.key === 'Escape' && onClose()}
                />
                <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">ESC</kbd>
              </div>
              <div className="p-2 max-h-72 overflow-auto">
                {groups.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-6">No results found.</p>
                ) : (
                  groups.map(group => (
                    <div key={group} className="mb-2">
                      <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">{group}</p>
                      {filtered.filter(c => c.group === group).map(cmd => (
                        <button
                          key={cmd.id}
                          onClick={() => handleSelect(cmd.path)}
                          className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-accent transition-colors group')}
                        >
                          <cmd.icon size={16} className="text-muted-foreground" />
                          <span className="flex-1 text-left">{cmd.label}</span>
                          <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-border flex items-center gap-4">
                <span className="text-xs text-muted-foreground"><kbd className="border border-border rounded px-1">ESC</kbd> Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
