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
  '/about': 'About Mis·Info',
}

interface TopNavProps {
  onMenuClick: () => void
  onCommandOpen: () => void
}

export function TopNav({ onMenuClick, onCommandOpen }: TopNavProps) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const pageLabel = pageLabels[location.pathname] || 'Mis·Info AI'

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const idx = themes.indexOf(theme)
    setTheme(themes[(idx + 1) % themes.length])
  }

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <header className="h-16 border-b border-white/10 bg-[#1e272b] flex items-center gap-4 px-6 flex-shrink-0 z-10">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden text-[#A79E9C] hover:text-[#C9C0B9]">
        <Menu size={18} />
      </Button>

      <div className="flex-1">
        <h1 className="text-sm font-semibold text-[#C9C0B9]">{pageLabel}</h1>
        <p className="text-[11px] text-[#A79E9C] font-mono uppercase tracking-wider hidden sm:block">AI-Powered Misinformation Verification</p>
      </div>

      <button
        onClick={onCommandOpen}
        className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-white/10 bg-[#1a2225] text-xs text-[#A79E9C] hover:bg-white/5 hover:text-[#C9C0B9] transition-colors"
      >
        <Search size={14} />
        <span>Search past reports...</span>
        <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[9px] font-medium text-[#A79E9C]">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative text-[#A79E9C] hover:text-[#C9C0B9]">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#B58B63]" />
        </Button>
        <Button variant="ghost" size="icon" onClick={cycleTheme} className="text-[#A79E9C] hover:text-[#C9C0B9]">
          <ThemeIcon size={18} />
        </Button>
        <Link to="/settings" style={{ textDecoration: 'none' }}>
          <div className="w-8 h-8 rounded-full bg-[#B58B63]/20 border border-[#B58B63]/40 flex items-center justify-center cursor-pointer transition-transform hover:scale-105">
            <span className="text-xs font-bold text-[#B58B63]">MI</span>
          </div>
        </Link>
      </div>
    </header>
  )
}
