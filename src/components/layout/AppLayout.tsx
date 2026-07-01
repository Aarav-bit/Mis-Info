import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { CommandPalette } from '../features/CommandPalette'
import { useCommandPalette } from '../../hooks/useCommandPalette'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { open: cmdOpen, setOpen: setCmdOpen } = useCommandPalette()

  return (
    <div className="flex h-screen bg-[#05161A] text-[#E6F3F5] overflow-hidden relative">
      {/* Mesh Grid Overlay (Background) */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-15" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />
      
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[#0F969C]/3 blur-[120px] pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(p => !p)} />

      {/* Main Body */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-10">
        <TopNav onMenuClick={() => setSidebarOpen(p => !p)} onCommandOpen={() => setCmdOpen(true)} />
        <main className="flex-1 overflow-auto p-8 scrollbar-hide">
          <Outlet />
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  )
}
