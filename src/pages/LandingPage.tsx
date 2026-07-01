import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Shield, ArrowRight, ArrowUpRight, CheckCircle, Globe,
  Brain, Zap, FileText, Search, ScanLine, ChevronDown,
  Star, BookOpen, Activity
} from 'lucide-react'
import DotField from '../components/ui/DotField'

// #05161A  near-black background
// #072E33  dark teal (containers, structural)
// #6DA5C0  warm medium gray (secondary text)
// #E6F3F5  light warm beige (body text)
// #0F969C  copper accent (CTAs, glows, highlights)

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
          stroke="#0F969C"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
          {score}<span style={{ fontSize: 20, color: '#6DA5C0' }}>%</span>
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: '#0F969C', marginTop: 4, textTransform: 'uppercase' }}>
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
        background: 'radial-gradient(circle at center, rgba(15, 150, 156,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
        borderRadius: '50%',
      }} />

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 16,
        padding: 32,
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        minWidth: 360,
        maxWidth: 400,
      }}>
        {/* Window chrome */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['#072E33','#072E33','#072E33'].map((c, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6DA5C0', background: 'rgba(7, 46, 51,0.4)', padding: '4px 12px', borderRadius: 100, letterSpacing: '0.05em' }}>
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
            border: '1px solid rgba(15, 150, 156,0.35)',
            borderRadius: 100, padding: '6px 18px',
          }}>
            <CheckCircle size={14} style={{ color: '#0F969C' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Verified Truth
            </span>
          </div>
        </div>

        {/* Source citations */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6DA5C0', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
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
                background: 'rgba(7, 46, 51,0.18)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 6, padding: '10px 14px', marginBottom: 8,
                cursor: 'pointer', transition: 'border-color 0.2s',
              }}
              whileHover={{ borderColor: 'rgba(15, 150, 156,0.4)', x: 2 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <s.icon size={16} style={{ color: '#6DA5C0' }} />
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#E6F3F5', fontWeight: 500 }}>{s.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6DA5C0', marginTop: 2 }}>{s.sub}</div>
                </div>
              </div>
              <ArrowUpRight size={14} style={{ color: '#0F969C', opacity: 0.6 }} />
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
      whileHover={{ y: -4, borderColor: 'rgba(15, 150, 156,0.45)' }}
      style={{
        background: 'rgba(7, 46, 51,0.2)',
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
          background: 'rgba(15, 150, 156,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} style={{ color: '#0F969C' }} />
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#0F969C', letterSpacing: '0.12em', background: 'rgba(15, 150, 156,0.12)', padding: '3px 8px', borderRadius: 4 }}>
          {feature.tag}
        </span>
      </div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: '#E6F3F5', marginBottom: 10, lineHeight: 1.3 }}>
        {feature.title}
      </h3>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#6DA5C0', lineHeight: 1.7 }}>
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
          width: 1, background: 'linear-gradient(to bottom, rgba(15, 150, 156,0.4), rgba(15, 150, 156,0.05))',
        }} />
      )}
      {/* Number bubble */}
      <div style={{
        width: 44, height: 44, borderRadius: 8, flexShrink: 0,
        border: '1px solid rgba(15, 150, 156,0.4)',
        background: 'rgba(15, 150, 156,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 700, color: '#0F969C' }}>
          {step.num}
        </span>
      </div>
      {/* Text */}
      <div style={{ paddingBottom: 32 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: '#E6F3F5', marginBottom: 6 }}>
          {step.label}
        </div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#6DA5C0', lineHeight: 1.6, maxWidth: 380 }}>
          {step.desc}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Landing Page ───────────────────────────────────────────────────────
export function LandingPage() {
  const heroRef = useRef(null)

  return (
    <div style={{ minHeight: '100vh', background: '#05161A', overflowX: 'hidden', position: 'relative' }}>
      {/* Interactive DotField Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <DotField
          dotRadius={1.6}
          dotSpacing={18}
          bulgeStrength={65}
          glowRadius={240}
          sparkle={true}
          waveAmplitude={0}
          gradientFrom="rgba(15, 150, 156, 0.32)" // Highly visible copper
          gradientTo="rgba(7, 46, 51, 0.15)"     // Visible dark teal
          glowColor="rgba(15, 150, 156, 0.28)"    // Beautiful copper spotlight
        />
      </div>

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 64px', height: 80,
        background: 'rgba(26,26,26,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(15, 150, 156,0.2)', border: '1px solid rgba(15, 150, 156,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={16} style={{ color: '#0F969C' }} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: '#E6F3F5', letterSpacing: '-0.02em' }}>
            MIS<span style={{ color: '#0F969C' }}>·</span>INFO
          </span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          {['Features', 'How it Works', 'Trust Score'].map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(/\s/g, '-')}`} style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#6DA5C0',
              textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E6F3F5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6DA5C0')}
            >
              {link}
            </a>
          ))}
        </div>

        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <motion.button
            whileHover={{ backgroundColor: '#c9a07b', scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600,
              color: '#05161A', background: '#0F969C', border: 'none',
              padding: '10px 24px', borderRadius: 4, cursor: 'pointer',
              boxShadow: 'inset 0 1px rgba(255,255,255,0.2)',
            }}
          >
            Try Now
          </motion.button>
        </Link>
      </nav>

      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        id="hero"
        style={{
          position: 'relative', zIndex: 10,
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          padding: '140px 64px 100px',
          maxWidth: 1440, margin: '0 auto',
        }}
      >
        {/* Teal radial glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '-5%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(7, 46, 51,0.2) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', width: '100%' }}>
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
                color: '#0F969C', background: 'rgba(15, 150, 156,0.1)',
                border: '1px solid rgba(15, 150, 156,0.3)',
                padding: '6px 14px', borderRadius: 4, textTransform: 'uppercase',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0F969C', display: 'inline-block' }} />
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
                    color: i === 0 ? '#FFFFFF' : i === 1 ? '#0F969C' : '#6DA5C0',
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
                color: '#6DA5C0', maxWidth: 500,
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
              style={{ display: 'flex', gap: 16, alignItems: 'center' }}
            >
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ backgroundColor: '#c9a07b', scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 600,
                    color: '#05161A', background: '#0F969C',
                    border: 'none', padding: '14px 28px', borderRadius: 4, cursor: 'pointer',
                    boxShadow: '0 0 0 0 rgba(15, 150, 156,0.4)',
                    transition: 'all 0.25s',
                  }}
                >
                  Start Scanning
                  <ArrowRight size={18} />
                </motion.button>
              </Link>

              <a href="#how-it-works" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 500,
                    color: '#E6F3F5', background: 'transparent',
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
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 24, paddingTop: 32, marginTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {[
                { value: '10M+', label: 'Claims Verified' },
                { value: '98.3%', label: 'Accuracy', highlight: true },
                { value: '⬤ Live', label: 'Real-Time', dot: true },
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700,
                    color: stat.highlight ? '#0F969C' : '#FFFFFF',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    {stat.dot ? (
                      <>
                        <motion.span
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ width: 10, height: 10, borderRadius: '50%', background: '#0F969C', display: 'inline-block' }}
                        />
                        <span>Live</span>
                      </>
                    ) : stat.value}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6DA5C0', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
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
        style={{
          position: 'relative', zIndex: 10,
          padding: '120px 64px',
          maxWidth: 1440, margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span style={{
            display: 'inline-block',
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em',
            color: '#0F969C', textTransform: 'uppercase',
            background: 'rgba(15, 150, 156,0.1)', border: '1px solid rgba(15, 150, 156,0.25)',
            padding: '6px 14px', borderRadius: 4, marginBottom: 20,
          }}>
            Capabilities
          </span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 48, fontWeight: 700, color: '#E6F3F5', letterSpacing: '-0.02em', margin: '0 0 16px' }}>
            Built for Truth-Seekers
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: '#6DA5C0', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
            Every feature is engineered for clarity, speed, and explainability — because trust requires evidence.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
        </div>
      </section>

      {/* ── How It Works Section ──────────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          position: 'relative', zIndex: 10,
          padding: '120px 64px',
          background: 'rgba(7, 46, 51,0.08)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100, alignItems: 'start' }}>
          {/* Left — section header */}
          <div style={{ position: 'sticky', top: 120 }}>
            <span style={{
              display: 'inline-block',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.12em',
              color: '#0F969C', textTransform: 'uppercase',
              background: 'rgba(15, 150, 156,0.1)', border: '1px solid rgba(15, 150, 156,0.25)',
              padding: '6px 14px', borderRadius: 4, marginBottom: 24,
            }}>
              The Process
            </span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 48, fontWeight: 700, color: '#E6F3F5', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 20 }}>
              From Claim to<br />Verdict in<br /><span style={{ color: '#0F969C' }}>5 Stages</span>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: '#6DA5C0', lineHeight: 1.7, marginBottom: 40 }}>
              A rigorous, transparent pipeline ensures every verification is traceable, auditable, and explainable.
            </p>
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ backgroundColor: '#c9a07b' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600,
                  color: '#05161A', background: '#0F969C',
                  border: 'none', padding: '12px 24px', borderRadius: 4, cursor: 'pointer',
                }}
              >
                Try the Demo <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>

          {/* Right — Steps */}
          <div style={{ paddingTop: 8 }}>
            {steps.map((step, i) => (
              <Step key={i} step={step} index={i} isLast={i === steps.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Score CTA Section ─────────────────────────────────────── */}
      <section
        id="trust-score"
        style={{
          position: 'relative', zIndex: 10,
          padding: '120px 64px',
          maxWidth: 1440, margin: '0 auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{
            background: 'rgba(7, 46, 51,0.18)',
            border: '1px solid rgba(15, 150, 156,0.2)',
            borderRadius: 16, padding: 80,
            textAlign: 'center', position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Background copper glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 100%, rgba(15, 150, 156,0.12) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Star size={36} style={{ color: '#0F969C', marginBottom: 24 }} />
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 48, fontWeight: 700, color: '#E6F3F5', letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.2 }}>
              Start Verifying Today
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: '#6DA5C0', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.7 }}>
              Join thousands of journalists, researchers, and fact-checkers who rely on Mis·Info for the truth.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ backgroundColor: '#c9a07b', scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600,
                    color: '#05161A', background: '#0F969C',
                    border: 'none', padding: '16px 36px', borderRadius: 4, cursor: 'pointer',
                  }}
                >
                  Try Demo Free <ArrowRight size={18} />
                </motion.button>
              </Link>
              <Link to="/about" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 500,
                    color: '#E6F3F5', background: 'transparent',
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
      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '32px 64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(15, 150, 156,0.15)', border: '1px solid rgba(15, 150, 156,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={12} style={{ color: '#0F969C' }} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: '#6DA5C0' }}>
            MIS<span style={{ color: '#0F969C' }}>·</span>INFO
          </span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#6DA5C0', opacity: 0.6 }}>© 2025</span>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          {[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Analytics', to: '/analytics' },
            { label: 'About', to: '/about' },
            { label: 'Settings', to: '/settings' },
          ].map(({ label, to }) => (
            <Link key={to} to={to} style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13,
              color: '#6DA5C0', textDecoration: 'none', transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E6F3F5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6DA5C0')}
            >
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  )
}
