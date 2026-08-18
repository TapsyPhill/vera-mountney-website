import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { OG_IMAGE, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, SITE_URL } from '../utils/constants'

interface PageMetaProps {
  titleKey: string
  descriptionKey: string
  image?: string
}

export function PageMeta({ titleKey, descriptionKey, image = OG_IMAGE }: PageMetaProps) {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const title = t(titleKey)
    const description = t(descriptionKey)
    const imageUrl = `${SITE_URL}${image}`
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
    setMeta('og:site_name', 'Vera Mountney', true)
    setMeta('og:image', imageUrl, true)
    setMeta('og:image:secure_url', imageUrl, true)
    setMeta('og:image:type', 'image/jpeg', true)
    setMeta('og:image:width', String(OG_IMAGE_WIDTH), true)
    setMeta('og:image:height', String(OG_IMAGE_HEIGHT), true)
    setMeta('og:image:alt', t('meta.home.ogImageAlt'), true)
    setMeta('og:locale', i18n.language === 'de' ? 'de_DE' : 'en_US', true)
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
    setMeta('twitter:image', imageUrl)
    setMeta('twitter:image:alt', t('meta.home.ogImageAlt'))
  }, [t, i18n.language, titleKey, descriptionKey, image])

  return null
}
