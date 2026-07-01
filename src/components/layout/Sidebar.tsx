import React from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, History, BarChart3, Settings, Info,
  Shield, ChevronLeft, ChevronRight, Zap
} from 'lucide-react'
import { cn } from '../../lib/utils'
import GooeyNav from '../ui/GooeyNav'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Workspace' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/about', icon: Info, label: 'About' },
]


interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <motion.aside
      animate={{ width: open ? 190 : 56 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-full border-r border-white/10 bg-[#072e33] flex-shrink-0 overflow-hidden z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10 h-16 bg-[#05161a]">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#0F969C]/20 border border-[#0F969C]/40 flex items-center justify-center">
          <Shield size={16} className="text-[#0F969C]" />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col min-w-0"
            >
              <span className="font-bold text-sm text-[#E6F3F5] leading-none uppercase tracking-wide">
                MIS<span className="text-[#0F969C]">·</span>INFO
              </span>
              <span className="text-[10px] text-[#6DA5C0] font-mono tracking-widest mt-1">VERIFICATION</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items with GooeyNav */}
      <div className="flex-1 px-2 py-3 mt-4 overflow-x-hidden overflow-y-auto scrollbar-hide">
        <GooeyNav items={navItems} sidebarOpen={open} />
      </div>

      {/* Version */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-3 border-t border-white/10 bg-[#05161a]"
          >
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-[#0F969C] animate-pulse" />
              <span className="text-[10px] font-mono text-[#6DA5C0] uppercase tracking-wider">Mis·Info v1.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#05161A] border border-white/10 shadow-md flex items-center justify-center hover:bg-[#072E33] text-[#6DA5C0] hover:text-[#E6F3F5] transition-colors z-30"
      >
        {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </motion.aside>
  )
}
