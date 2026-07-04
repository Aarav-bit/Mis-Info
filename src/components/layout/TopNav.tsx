import React, { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { Bell, Moon, Sun, Menu, Search, Monitor, LogOut, ShieldAlert } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../ui/Button'
import { LanguageSelector } from '../ui/LanguageSelector'
import { useAuth } from '../../contexts/AuthContext'
import { UserButton } from '@clerk/clerk-react'

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
  const { user, logout, isMock, isAuthenticated } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
    navigate('/login')
  }

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const idx = themes.indexOf(theme)
    setTheme(themes[(idx + 1) % themes.length])
  }

  const ThemeIcon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <header className="h-16 border-b border-white/10 bg-[#141021] flex items-center gap-4 px-6 flex-shrink-0 z-10">
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden text-[#8E8A9F] hover:text-[#FEFFFC]">
        <Menu size={18} />
      </Button>

      <div className="flex-1">
        <h1 className="text-sm font-semibold text-[#FEFFFC]">{pageLabel}</h1>
        <p className="text-[11px] text-[#8E8A9F] font-mono uppercase tracking-wider hidden sm:block">AI-Powered Misinformation Verification</p>
      </div>

      <button
        onClick={onCommandOpen}
        className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-white/10 bg-[#09070f] text-xs text-[#8E8A9F] hover:bg-white/5 hover:text-[#FEFFFC] transition-colors"
      >
        <Search size={14} />
        <span>Search past reports...</span>
        <kbd className="pointer-events-none ml-2 inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[9px] font-medium text-[#8E8A9F]">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCommandOpen}
          className="flex sm:hidden text-[#8E8A9F] hover:text-[#FEFFFC]"
        >
          <Search size={18} />
        </Button>
        <LanguageSelector />
        <Button variant="ghost" size="icon" className="relative text-[#8E8A9F] hover:text-[#FEFFFC]">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D0FF00]" />
        </Button>
        <Button variant="ghost" size="icon" onClick={cycleTheme} className="text-[#8E8A9F] hover:text-[#FEFFFC]">
          <ThemeIcon size={18} />
        </Button>
        {isMock && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f59e0b]/5 border border-[#f59e0b]/20 font-mono text-[9px] text-[#f59e0b] uppercase tracking-wider select-none">
            <ShieldAlert size={10} className="animate-pulse" />
            <span>Mock Auth</span>
          </div>
        )}

        {isAuthenticated && (
          isMock ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(p => !p)}
                className="w-8 h-8 rounded-full bg-[#D0FF00]/20 border border-[#D0FF00]/40 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 overflow-hidden"
              >
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-[#D0FF00]">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'A'}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-white/10 bg-[#141021] p-4 shadow-2xl z-50 text-left space-y-3 font-sans">
                    <div>
                      <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
                      <div className="text-[10px] text-[#8E8A9F] font-mono truncate">{user?.email}</div>
                      <div className="text-[9px] text-[#D0FF00] font-mono mt-1.5 uppercase tracking-wider bg-[#D0FF00]/10 border border-[#D0FF00]/25 px-2 py-0.5 rounded w-fit">
                        {user?.role}
                      </div>
                    </div>
                    <div className="h-px bg-white/5" />
                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 text-xs text-[#8E8A9F] hover:text-white transition-colors py-1.5"
                      style={{ textDecoration: 'none' }}
                    >
                      Account settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors py-1.5 border-t border-white/5 pt-2 text-left cursor-pointer"
                    >
                      <LogOut size={12} />
                      Sign Out Auditor
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <UserButton afterSignOutUrl="/login" />
          )
        )}
      </div>
    </header>
  )
}
