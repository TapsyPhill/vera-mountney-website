import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_STORAGE_KEY } from '../utils/constants'
import type { SupportedLanguage } from '../content'

export function useLanguageSync() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null
    if (stored && stored !== i18n.language) {
      void i18n.changeLanguage(stored)
    }
    document.documentElement.lang = i18n.language
  }, [i18n, i18n.language])
}

export function changeLanguage(lang: SupportedLanguage) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  document.documentElement.lang = lang
}
