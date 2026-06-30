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
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(p => !p)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav onMenuClick={() => setSidebarOpen(p => !p)} onCommandOpen={() => setCmdOpen(true)} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  )
}
