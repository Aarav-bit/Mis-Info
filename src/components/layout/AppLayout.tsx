import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { CommandPalette } from '../features/CommandPalette'
import { useCommandPalette } from '../../hooks/useCommandPalette'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { open: cmdOpen, setOpen: setCmdOpen } = useCommandPalette()

  // Responsive initialization
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }, [])

  return (
    <div className="flex h-screen bg-[#09070F] text-[#FEFFFC] overflow-hidden relative">
      {/* Mesh Grid Overlay (Background) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-15" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />
      
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[#D0FF00]/3 blur-[120px] pointer-events-none z-0" />

      {/* Sidebar backdrop for mobile/tablet screens */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden cursor-pointer transition-opacity"
        />
      )}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(p => !p)} />

      {/* Main Body */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <TopNav onMenuClick={() => setSidebarOpen(p => !p)} onCommandOpen={() => setCmdOpen(true)} />
        <main className="flex-1 overflow-auto p-4 sm:p-8 scrollbar-hide">
          <Outlet />
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  )
}
