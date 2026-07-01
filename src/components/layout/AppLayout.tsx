import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { CommandPalette } from '../features/CommandPalette'
import { useCommandPalette } from '../../hooks/useCommandPalette'
import DotField from '../ui/DotField'

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { open: cmdOpen, setOpen: setCmdOpen } = useCommandPalette()

  return (
    <div className="flex h-screen bg-[#1A1A1A] text-[#C9C0B9] overflow-hidden relative">
      {/* Interactive DotField Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <DotField
          dotRadius={1.2}
          dotSpacing={16}
          bulgeStrength={50}
          glowRadius={200}
          sparkle={true}
          waveAmplitude={0}
          gradientFrom="rgba(181, 139, 99, 0.07)" // Copper Accent
          gradientTo="rgba(61, 77, 85, 0.03)"     // Dark Teal
          glowColor="#1A1A1A"
        />
      </div>
      
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-[#B58B63]/2 blur-[120px] pointer-events-none z-0" />

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
