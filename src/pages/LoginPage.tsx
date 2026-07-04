import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SignIn } from '@clerk/clerk-react'
import { useAuth } from '../contexts/AuthContext'
import { Shield, Mail, ArrowRight, Loader2, Info } from 'lucide-react'

// Check if Clerk publishable key is configured
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''
const IS_CLERK_ENABLED = PUBLISHABLE_KEY.trim().length > 0

export function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, loginWithGoogle, loginWithEmail, isMock } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    try {
      await loginWithGoogle()
    } catch (err) {
      setError('Google authentication failed.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await loginWithEmail(email)
    } catch (err) {
      setError('Email authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  if (IS_CLERK_ENABLED) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#09070F] text-white p-4">
        {/* Background Mesh */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-15" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
        <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield size={24} className="text-[#D0FF00]" />
            <span className="font-display font-bold text-xl tracking-tight text-white uppercase">
              MIS<span className="text-[#D0FF00]">·</span>INFO
            </span>
          </div>
          <SignIn signUpUrl="/signup" fallbackRedirectUrl="/dashboard" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#09070F] text-[#FEFFFC] relative p-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-15" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }} />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#D0FF00]/3 blur-[120px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Banner: Mock Mode Notice */}
        <div className="mb-6 flex gap-2.5 p-3 rounded-lg bg-[#f59e0b]/5 border border-[#f59e0b]/20 text-[11px] leading-relaxed text-[#f59e0b] font-mono">
          <Info size={14} className="flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">MOCK MODE ACTIVE</span>
            <p className="mt-0.5 opacity-80">Keys not configured. Logins will bypass live verification API checks.</p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#D0FF00]/10 border border-[#D0FF00]/30 flex items-center justify-center mx-auto mb-4">
            <Shield size={22} className="text-[#D0FF00]" />
          </div>
          <h1 className="text-xl font-display font-semibold text-white tracking-tight">Access verification Console</h1>
          <p className="text-[#8E8A9F] text-xs font-mono mt-1 uppercase">Enter credentials to proceed</p>
        </div>

        {/* Action Form */}
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full h-11 rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-white flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 size={16} className="animate-spin text-[#D0FF00] mr-2" />
            ) : (
              <svg className="w-4.5 h-4.5 mr-2.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Separator */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] font-mono text-[#8E8A9F] uppercase tracking-wider">or email gateway</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          {/* Email input Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                disabled={loading || googleLoading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="auditor@domain.com"
                className="w-full h-11 rounded-lg border border-white/10 bg-black/40 text-[#FEFFFC] pl-10 pr-4 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#D0FF00] placeholder:text-[#8E8A9F]/30 transition-all disabled:opacity-50"
              />
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8A9F]" />
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-11 rounded-lg bg-[#D0FF00] text-black font-display font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#b0d800] transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>
                  Connect Auditor Session
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-[10px] font-mono text-[#8E8A9F]">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-[#D0FF00] hover:underline uppercase tracking-wide">Register</Link>
        </div>
      </motion.div>
    </div>
  )
}
