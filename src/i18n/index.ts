import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import hi from './locales/hi.json'
import ta from './locales/ta.json'
import ar from './locales/ar.json'
import es from './locales/es.json'

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English',    nativeLabel: 'English',    flag: '🇺🇸', rtl: false },
  { code: 'hi', label: 'Hindi',      nativeLabel: 'हिंदी',       flag: '🇮🇳', rtl: false },
  { code: 'ta', label: 'Tamil',      nativeLabel: 'தமிழ்',       flag: '🇮🇳', rtl: false },
  { code: 'ar', label: 'Arabic',     nativeLabel: 'العربية',     flag: '🇸🇦', rtl: true  },
  { code: 'es', label: 'Spanish',    nativeLabel: 'Español',     flag: '🇪🇸', rtl: false },
]

export const RTL_LANGUAGES = new Set(['ar'])

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, hi: { translation: hi }, ta: { translation: ta }, ar: { translation: ar }, es: { translation: es } },
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'ta', 'ar', 'es'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  })

export default i18n
