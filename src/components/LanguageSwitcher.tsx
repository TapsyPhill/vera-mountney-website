import { useTranslation } from 'react-i18next'
import { changeLanguage } from '../hooks/useLanguageSync'
import type { SupportedLanguage } from '../content'

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation()
  const current = i18n.language as SupportedLanguage

  const setLang = (lang: SupportedLanguage) => {
    changeLanguage(lang)
    void i18n.changeLanguage(lang)
  }

  return (
    <div
      className={`flex rounded-full border border-brand-400/30 bg-white/5 font-semibold ${
        compact ? 'p-0.5 text-[10px]' : 'p-1 text-xs'
      }`}
      role="group"
      aria-label="Language switcher"
    >
      {(['de', 'en'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => setLang(lang)}
          className={`rounded-full uppercase transition-all duration-300 ${
            compact ? 'px-2 py-1' : 'px-3 py-1.5'
          } ${
            current === lang
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-brand-700 hover:bg-brand-50 dark:text-gray-300 dark:hover:bg-white/10'
          }`}
          aria-pressed={current === lang}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}
