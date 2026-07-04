import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface PageMetaProps {
  titleKey: string
  descriptionKey: string
}

export function PageMeta({ titleKey, descriptionKey }: PageMetaProps) {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const title = t(titleKey)
    const description = t(descriptionKey)
    document.title = title

    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)

    const setOg = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('property', property)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    setOg('og:title', title)
    setOg('og:description', description)
    setOg('og:type', 'website')
    setOg('og:locale', i18n.language === 'de' ? 'de_DE' : 'en_US')
  }, [t, i18n.language, titleKey, descriptionKey])

  return null
}
