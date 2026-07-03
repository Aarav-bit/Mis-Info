import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { VerificationProvider } from './contexts/VerificationContext'
import { ToastProvider } from './components/ui/Toaster'
import { AppLayout } from './components/layout/AppLayout'

// ⚡ Bolt Performance Optimization:
// Why: The application bundle was >1MB because all pages were loaded synchronously.
// What: Implemented route-level code splitting using React.lazy() and Suspense.
// Impact: Reduces initial JS bundle size by loading page chunks on demand.
const LandingPage = React.lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ReportPage = React.lazy(() => import('./pages/ReportPage').then(m => ({ default: m.ReportPage })))
const HistoryPage = React.lazy(() => import('./pages/HistoryPage').then(m => ({ default: m.HistoryPage })))
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))

// Simple loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-screen bg-[#09070F]">
    <div className="w-8 h-8 rounded-full border-2 border-[#D0FF00]/30 border-t-[#D0FF00] animate-spin" />
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <VerificationProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<Suspense fallback={<PageLoader />}><LandingPage /></Suspense>} />
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
                <Route path="/report/:id" element={<Suspense fallback={<PageLoader />}><ReportPage /></Suspense>} />
                <Route path="/history" element={<Suspense fallback={<PageLoader />}><HistoryPage /></Suspense>} />
                <Route path="/analytics" element={<Suspense fallback={<PageLoader />}><AnalyticsPage /></Suspense>} />
                <Route path="/settings" element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
                <Route path="/about" element={<Suspense fallback={<PageLoader />}><AboutPage /></Suspense>} />
              </Route>
            </Routes>
          </ToastProvider>
        </VerificationProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
