import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Bell, Moon, Sun, Menu, Search, Monitor } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../ui/Button'

const pageLabels: Record<string, string> = {
  '/dashboard': 'Verification Workspace',
  '/history': 'Verification History',
  '/analytics': 'Analytics Dashboard',
  '/settings': 'Settings',
  '/about': 'About TrustLens',
}

interface TopNavProps {
  onMenuClick: () => void
  onCommandOpen: () => void
}

export function TopNav({ onMenuClick, onCommandOpen }: TopNavProps) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const pageLabel = pageLabels[location.pathname] || 'TrustLens AI'

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const idx = themes.indexOf(theme)
    setTheme(themes[(idx + 1) % themes.length])
  }

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <header className="h-16 border-b border-border bg-card flex items-center gap-4 px-4 flex-shrink-0">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
        <Menu size={18} />
      </Button>

      <div className="flex-1">
        <h1 className="text-sm font-semibold text-foreground">{pageLabel}</h1>
        <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Misinformation Verification</p>
      </div>

      <button
        onClick={onCommandOpen}
        className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-input bg-background text-sm text-muted-foreground hover:bg-accent transition-colors"
      >
        <Search size={14} />
        <span>Search...</span>
        <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500" />
        </Button>
        <Button variant="ghost" size="icon" onClick={cycleTheme}>
          <ThemeIcon size={18} />
        </Button>
        <Link to="/settings">
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center cursor-pointer">
            <span className="text-xs font-bold text-white">TL</span>
          </div>
        </Link>
      </div>
    </header>
  )
}
