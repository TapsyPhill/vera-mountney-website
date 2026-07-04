export const SITE_URL = 'https://vera-mountney.de'

export const NAV_LINKS = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'services', path: '/services' },
  { key: 'book', path: '/book' },
  { key: 'contact', path: '/contact' },
] as const

export const OPTIONAL_NAV = [
  { key: 'faq', path: '/faq' },
  { key: 'testimonials', path: '/#testimonials' },
  { key: 'guestbook', path: '/#guestbook' },
  { key: 'blog', path: '/#blog' },
] as const

export const THEME_STORAGE_KEY = 'vera-theme'
export const LANGUAGE_STORAGE_KEY = 'vera-language'

export const PROFILE_IMAGE = '/assets/images/profile/vera-mountney-main.jpg'
