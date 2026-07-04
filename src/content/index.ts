import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import de from './de'
import en from './en'

export const defaultLanguage = 'de'
export const supportedLanguages = ['de', 'en'] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

const resources = {
  de: { translation: de },
  en: { translation: en },
}

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
