export const SITE_URL = 'https://vera-mountney.de'
export const DESIGN_CREDIT_URL = 'https://tech.kingstonegrace.com/'

export const NAV_LINKS = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'services', path: '/services' },
  { key: 'book', path: '/book' },
  { key: 'gallery', path: '/gallery' },
] as const

export const THEME_STORAGE_KEY = 'vera-theme'
export const LANGUAGE_STORAGE_KEY = 'vera-language'

export const PROFILE_IMAGE = '/assets/images/profile/vera-mountney-main.jpg'
export const PROFILE_IMAGE_RED = '/assets/images/profile/vera-red-portrait-main-01.jpg'

export const HERO_PORTRAITS = [PROFILE_IMAGE, PROFILE_IMAGE_RED] as const
