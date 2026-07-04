import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SITE_URL, PROFILE_IMAGE } from '../utils/constants'

interface PageMetaProps {
  titleKey: string
  descriptionKey: string
  image?: string
}

export function PageMeta({ titleKey, descriptionKey, image = PROFILE_IMAGE }: PageMetaProps) {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const title = t(titleKey)
    const description = t(descriptionKey)
    document.title = title

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name'
      let tag = document.querySelector(`meta[${attr}="${name}"]`)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attr, name)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:type', 'website', true)
    setMeta('og:url', SITE_URL, true)
    setMeta('og:image', `${SITE_URL}${image}`, true)
    setMeta('og:locale', i18n.language === 'de' ? 'de_DE' : 'en_US', true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', `${SITE_URL}${image}`)
  }, [t, i18n.language, titleKey, descriptionKey, image])

  return null
}
