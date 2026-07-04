import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Globe } from 'lucide-react'
import { SUPPORTED_LANGUAGES, RTL_LANGUAGES } from '../../i18n'

export function LanguageSelector() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) ?? SUPPORTED_LANGUAGES[0]

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code)
    // Apply/remove RTL on document root
    document.documentElement.dir = RTL_LANGUAGES.has(code) ? 'rtl' : 'ltr'
    document.documentElement.lang = code
    setOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Sync dir on mount
  useEffect(() => {
    document.documentElement.dir = RTL_LANGUAGES.has(i18n.language) ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10 border border-white/10 text-[#FEFFFC]"
        title="Change language"
      >
        <Globe size={14} className="text-[#D0FF00]" />
        <span className="hidden sm:inline">{current.flag} {current.nativeLabel}</span>
        <span className="sm:hidden">{current.flag}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 z-50 min-w-[180px] rounded-xl border border-white/10 bg-[#141021] shadow-2xl overflow-hidden">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                lang.code === i18n.language
                  ? 'bg-[#D0FF00]/10 text-[#D0FF00] font-semibold'
                  : 'text-[#FEFFFC]'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <div className="flex flex-col items-start">
                <span className="leading-tight">{lang.nativeLabel}</span>
                <span className="text-xs text-[#8E8A9F] leading-tight">{lang.label}</span>
              </div>
              {lang.code === i18n.language && (
                <span className="ml-auto text-[#D0FF00] text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
