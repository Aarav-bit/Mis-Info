import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Shield, ArrowRight, ArrowUpRight, CheckCircle, Globe,
  Brain, Zap, FileText, Search, ScanLine, ChevronDown,
  Star, BookOpen, Activity, Menu, X
} from 'lucide-react'
import DotField from '../components/ui/DotField'

// #09070F  near-black background
// #141021  dark teal (containers, structural)
// #8E8A9F  warm medium gray (secondary text)
// #FEFFFC  light warm beige (body text)
// #D0FF00  copper accent (CTAs, glows, highlights)

// ─── Data ───────────────────────────────────────────────────────────────────
const features = [
  {
    icon: ScanLine,
    title: 'Multi-Format Analysis',
    description: 'Submit plain text, URLs, or screenshot images. Our engine ingests all formats and extracts verifiable claims automatically.',
    tag: 'INGESTION',
  },
  {
    icon: Activity,
    title: '5-Stage Pipeline',
    description: 'A structured verification lifecycle — Extract → Search → Evaluate → Score → Report — ensures nothing is missed.',
    tag: 'PIPELINE',
  },
  {
    icon: Brain,
    title: 'Trust Score Engine',
    description: 'Proprietary rule-based scoring combines keyword weights, negation penalties, and source rarity to calibrate confidence.',
    tag: 'SCORING',
  },
  {
    icon: Globe,
    title: 'Source Cross-Reference',
    description: '50+ trusted outlets, government databases, and academic repositories are queried in parallel for corroboration.',
    tag: 'SOURCES',
  },
  {
    icon: BookOpen,
    title: 'Explainable Reports',
    description: 'Every verdict includes structural reasoning, credibility factors, and supporting evidence — never a black box.',
    tag: 'REPORTS',
  },
  {
    icon: Zap,
    title: 'Real-Time Speed',
    description: 'Comprehensive verification in under 10 seconds. Built for journalists and researchers who work on deadline.',
    tag: 'PERFORMANCE',
  },
]

const steps = [
  { num: '01', label: 'Submit', desc: 'Paste text, a URL, or drop a screenshot.' },
  { num: '02', label: 'Extract', desc: 'AI isolates the core verifiable claim.' },
  { num: '03', label: 'Search', desc: 'Cross-references 50+ trusted databases.' },
  { num: '04', label: 'Evaluate', desc: 'Credibility factors are weighed and scored.' },
  { num: '05', label: 'Report', desc: 'Full reasoning and verdict delivered instantly.' },
]

// ─── Animated Trust Score Gauge ──────────────────────────────────────────────
function TrustGauge({ score = 87 }: { score?: number }) {
  const [animated, setAnimated] = useState(false)
  const ref = useRef<SVGCircleElement>(null)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative flex items-center justify-center" style={{ width: 192, height: 192 }}>
      <svg className="transform -rotate-90" width="192" height="192" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle
          ref={ref}
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="#D0FF00"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
          {score}<span style={{ fontSize: 20, color: '#8E8A9F' }}>%</span>
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: '#D0FF00', marginTop: 4, textTransform: 'uppercase' }}>
          Trust Score
        </span>
      </div>
    </div>
  )
}

// ─── Glass Analysis Card ─────────────────────────────────────────────────────
function AnalysisCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: 0.6, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        perspective: 1000,
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Copper glow behind card */}
      <div style={{
        position: 'absolute', inset: -40,
        background: 'radial-gradient(circle at center, rgba(208, 255, 0,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
        borderRadius: '50%',
      }} />

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 16,
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        maxWidth: 400,
      }}
      className="w-full min-w-0 sm:min-w-[360px] p-4 sm:p-8"
      >
        {/* Window chrome */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['#141021','#141021','#141021'].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#8E8A9F', background: 'rgba(20, 16, 33,0.4)', padding: '4px 12px', borderRadius: 100, letterSpacing: '0.05em' }}>
            ANALYSIS COMPLETE
          </span>
        </div>

        {/* Gauge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <TrustGauge score={87} />
        </div>

        {/* Verdict badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, marginTop: -12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(22,19,16,0.85)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(208, 255, 0,0.35)',
            borderRadius: 100, padding: '6px 18px',
          }}>
            <CheckCircle size={14} style={{ color: '#D0FF00' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Verified Truth
            </span>
          </div>
        </div>

        {/* Source citations */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#8E8A9F', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            Source Citations
          </div>
          {[
            { icon: FileText, name: 'Associated Press Archive', sub: 'Primary Source Match' },
            { icon: BookOpen, name: 'Nature Journal Vol. 14', sub: 'Data Corroboration' },
            { icon: Globe, name: 'Reuters Fact Check', sub: 'Cross-Reference' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.15 }}
              className="group"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(20, 16, 33,0.18)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 6, padding: '10px 14px', marginBottom: 8,
                cursor: 'pointer', transition: 'border-color 0.2s',
              }}
              whileHover={{ borderColor: 'rgba(208, 255, 0,0.4)', x: 2 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <s.icon size={16} style={{ color: '#8E8A9F' }} />
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#FEFFFC', fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#8E8A9F', marginTop: 2 }}>{s.sub}</div>
                </div>
              </div>
              <ArrowUpRight size={14} style={{ color: '#D0FF00', opacity: 0.6 }} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, borderColor: 'rgba(208, 255, 0,0.45)' }}
      style={{
        background: 'rgba(20, 16, 33,0.2)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 28,
        cursor: 'default',
        transition: 'border-color 0.3s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 8,
          background: 'rgba(208, 255, 0,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} style={{ color: '#D0FF00' }} />
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#D0FF00', letterSpacing: '0.12em', background: 'rgba(208, 255, 0,0.12)', padding: '3px 8px', borderRadius: 4 }}>
          {feature.tag}
        </span>
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: '#FEFFFC', marginBottom: 10, lineHeight: 1.3 }}>
        {feature.title}
      </h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#8E8A9F', lineHeight: 1.7 }}>
        {feature.description}
      </p>
    </motion.div>
  )
}

// ─── Step Component ──────────────────────────────────────────────────────────
function Step({ step, index, isLast }: { step: typeof steps[0]; index: number; isLast: boolean }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      style={{ display: 'flex', gap: 24, position: 'relative' }}
    >
      {/* Connector line */}
      {!isLast && (
        <div style={{
          position: 'absolute', left: 20, top: 52, bottom: -32,
          width: 1, background: 'linear-gradient(to bottom, rgba(208, 255, 0,0.4), rgba(208, 255, 0,0.05))',
        }} />
      )}
      {/* Number bubble */}
      <div style={{
        width: 44, height: 44, borderRadius: 8, flexShrink: 0,
        border: '1px solid rgba(208, 255, 0,0.4)',
        background: 'rgba(208, 255, 0,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: '#D0FF00' }}>
          {step.num}
        </span>
      </div>
      {/* Text */}
      <div style={{ paddingBottom: 32 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: '#FEFFFC', marginBottom: 6 }}>
          {step.label}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#8E8A9F', lineHeight: 1.6, maxWidth: 380 }}>
          {step.desc}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Landing Page ───────────────────────────────────────────────────────
export function LandingPage() {
  const heroRef = useRef(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: '#09070F', overflowX: 'hidden', position: 'relative' }}>
      {/* Interactive DotField Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <DotField
          dotRadius={1.6}
          dotSpacing={18}
          bulgeStrength={65}
          glowRadius={240}
          sparkle={true}
          waveAmplitude={0}
          gradientFrom="rgba(208, 255, 0, 0.32)" // Highly visible copper
          gradientTo="rgba(20, 16, 33, 0.15)"     // Visible dark teal
          glowColor="rgba(208, 255, 0, 0.28)"    // Beautiful copper spotlight
        />
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 md:px-16 h-20 bg-[#1a1a1a]/85 backdrop-blur-xl border-b border-white/5">
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(208, 255, 0,0.2)', border: '1px solid rgba(208, 255, 0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={16} style={{ color: '#D0FF00' }} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#FEFFFC', letterSpacing: '-0.02em' }}>
            MIS<span style={{ color: '#D0FF00' }}>·</span>INFO
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-10">
          {['Features', 'How it Works', 'Trust Score'].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s/g, '-')}`} style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#8E8A9F',
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FEFFFC')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8E8A9F')}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/dashboard" style={{ textDecoration: 'none' }} className="hidden sm:block">
            <motion.button
              whileHover={{ backgroundColor: '#c9a07b', scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600,
                color: '#09070F', background: '#D0FF00', border: 'none',
                padding: '10px 24px', borderRadius: 4, cursor: 'pointer',
                boxShadow: 'inset 0 1px rgba(255,255,255,0.2)',
              }}
            >
              Try Now
            </motion.button>
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(p => !p)}
            className="lg:hidden p-2 text-[#8E8A9F] hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-0 right-0 z-40 bg-[#141021] border-b border-white/10 px-6 py-8 flex flex-col gap-6 lg:hidden shadow-2xl"
          >
            {['Features', 'How it Works', 'Trust Score'].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="font-sans text-base text-[#8E8A9F] hover:text-[#FEFFFC] transition-colors"
              >
                {link}
              </a>
            ))}
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full" style={{ textDecoration: 'none' }}>
              <button className="w-full font-display text-sm font-semibold text-[#09070F] bg-[#D0FF00] py-3 rounded hover:bg-[#c9a07b] transition-colors cursor-pointer">
                Try Now
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        id="hero"
        className="relative z-10 min-h-screen flex items-center px-4 sm:px-8 md:px-16 py-28 md:py-36 max-w-[1440px] mx-auto"
      >
        {/* Teal radial glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '-5%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 16, 33,0.2) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          {/* Left — Hero copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em',
                color: '#D0FF00', background: 'rgba(208, 255, 0,0.1)',
                border: '1px solid rgba(208, 255, 0,0.3)',
                padding: '6px 14px', borderRadius: 4, textTransform: 'uppercase',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D0FF00', display: 'inline-block' }} />
                AI-Powered Verification Engine
              </span>
            </motion.div>

            {/* Headline */}
            <div>
              {['Detect.', 'Verify.', 'Trust.'].map((word, i) => (
                <motion.div
                  key={word}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(56px, 7vw, 96px)',
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: '-0.04em',
                    color: i === 0 ? '#FFFFFF' : i === 1 ? '#D0FF00' : '#8E8A9F',
                  }}
                >
                  {word}
                </motion.div>
              ))}
            </div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: 18, lineHeight: 1.7,
                color: '#8E8A9F', maxWidth: 500,
              }}
            >
              AI-powered scanning to dismantle misinformation in real-time. Built for researchers,
              journalists, and high-stakes decision-makers who demand absolute clarity.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 items-center"
            >
              <Link to="/dashboard" style={{ textDecoration: 'none' }} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ backgroundColor: '#c9a07b', scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600,
                    color: '#09070F', background: '#D0FF00',
                    border: 'none', padding: '14px 28px', borderRadius: 4, cursor: 'pointer',
                    boxShadow: '0 0 0 0 rgba(208, 255, 0,0.4)',
                    transition: 'all 0.25s',
                  }}
                >
                  Start Scanning
                  <ArrowRight size={18} />
                </motion.button>
              </Link>

              <a href="#how-it-works" style={{ textDecoration: 'none' }} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 500,
                    color: '#FEFFFC', background: 'transparent',
                    border: '1px solid rgba(201,192,185,0.4)',
                    padding: '14px 28px', borderRadius: 4, cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  See How It Works
                  <ChevronDown size={18} />
                </motion.button>
              </a>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
              className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 mt-2 border-t border-white/10"
            >
              {[
                { value: '10M+', label: 'Claims Verified' },
                { value: '98.3%', label: 'Accuracy', highlight: true },
                { value: '⬤ Live', label: 'Real-Time', dot: true },
              ].map((stat, i) => (
                <div key={i}>
                  <div 
                    className="font-display text-lg sm:text-2xl font-bold flex items-center gap-1.5 sm:gap-2"
                    style={{ color: stat.highlight ? '#D0FF00' : '#FFFFFF' }}
                  >
                    {stat.dot ? (
                      <>
                        <motion.span
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ width: 8, height: 8, borderRadius: '50%', background: '#D0FF00', display: 'inline-block' }}
                        />
                        <span>Live</span>
                      </>
                    ) : stat.value}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#8E8A9F', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }} className="sm:text-[10px]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Analysis Card */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <AnalysisCard />
          </div>
        </div>
      </section>

      {/* ── Features Section ───────────────────────────────────────────── */}
      <section
        id="features"
        className="relative z-10 px-4 sm:px-8 md:px-16 py-24 max-w-[1440px] mx-auto"
      >
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{
            display: 'inline-block',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em',
            color: '#D0FF00', textTransform: 'uppercase',
            background: 'rgba(208, 255, 0,0.1)', border: '1px solid rgba(208, 255, 0,0.25)',
            padding: '6px 14px', borderRadius: 4, marginBottom: 20,
          }}>
            Capabilities
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Built for Truth-Seekers
          </h2>
          <p className="font-sans text-sm sm:text-base md:text-lg text-[#8E8A9F] max-w-[540px] mx-auto leading-relaxed">
            Every feature is engineered for clarity, speed, and explainability — because trust requires evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
        </div>
      </section>

      {/* ── How It Works Section ──────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="relative z-10 px-4 sm:px-8 md:px-16 py-24 bg-[#141021]/5 border-y border-white/5"
      >
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left — section header */}
          <div className="lg:sticky lg:top-32">
            <span style={{
              display: 'inline-block',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em',
              color: '#D0FF00', textTransform: 'uppercase',
              background: 'rgba(208, 255, 0,0.1)', border: '1px solid rgba(208, 255, 0,0.25)',
              padding: '6px 14px', borderRadius: 4, marginBottom: 24,
            }}>
              The Process
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-6">
              From Claim to<br />Verdict in<br /><span style={{ color: '#D0FF00' }}>5 Stages</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#8E8A9F] leading-relaxed mb-10 max-w-[480px]">
              A rigorous, transparent pipeline ensures every verification is traceable, auditable, and explainable.
            </p>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ backgroundColor: '#c9a07b' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600,
                  color: '#09070F', background: '#D0FF00',
                  border: 'none', padding: '12px 24px', borderRadius: 4, cursor: 'pointer',
                }}
              >
                Try the Demo <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>

          {/* Right — Steps */}
          <div className="w-full mt-4 lg:mt-0">
            {steps.map((step, i) => (
              <Step key={i} step={step} index={i} isLast={i === steps.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Score CTA Section ─────────────────────────────────────── */}
      <section
        id="trust-score"
        className="relative z-10 px-4 sm:px-8 md:px-16 py-24 max-w-[1440px] mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-[#141021]/18 border border-[#D0FF00]/20 rounded-2xl p-6 sm:p-12 md:p-20 text-center relative overflow-hidden"
        >
          {/* Background copper glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 100%, rgba(208, 255, 0,0.12) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Star size={36} style={{ color: '#D0FF00', marginBottom: 24 }} className="mx-auto" />
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Start Verifying Today
            </h2>
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#8E8A9F] max-w-[480px] mx-auto mb-8 sm:mb-12 leading-relaxed">
              Join thousands of journalists, researchers, and fact-checkers who rely on Mis·Info for the truth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard" style={{ textDecoration: 'none' }} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ backgroundColor: '#c9a07b', scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600,
                    color: '#09070F', background: '#D0FF00',
                    border: 'none', padding: '16px 36px', borderRadius: 4, cursor: 'pointer',
                  }}
                >
                  Try Demo Free <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/about" style={{ textDecoration: 'none' }} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  className="w-full sm:w-auto"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 500,
                    color: '#FEFFFC', background: 'transparent',
                    border: '1px solid rgba(201,192,185,0.35)',
                    padding: '16px 36px', borderRadius: 4, cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 px-4 sm:px-8 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(208, 255, 0,0.15)', border: '1px solid rgba(208, 255, 0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={12} style={{ color: '#D0FF00' }} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: '#8E8A9F' }}>
            MIS<span style={{ color: '#D0FF00' }}>·</span>INFO
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8E8A9F', opacity: 0.6 }}>© 2025</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Analytics', to: '/analytics' },
            { label: 'About', to: '/about' },
            { label: 'Settings', to: '/settings' },
          ].map(({ label, to }) => (
            <Link key={to} to={to} style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13,
              color: '#8E8A9F', textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FEFFFC')}
            onMouseLeave={e => (e.currentTarget.style.color = '#8E8A9F')}
            >
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
