export const bookLinks = {
  buyUrlEn:
    import.meta.env.VITE_BOOK_BUY_URL_EN ||
    'https://verlag-kern.de/unsere-bucher/when-the-bats-fly-i-dream-of-nigeria/',
  buyUrlDe:
    import.meta.env.VITE_BOOK_BUY_URL_DE ||
    'https://verlag-kern.de/unsere-bucher/wenn-fledermaeuse-fliegen-traeume-ich-von-nigeria/',
  authorPageUrl:
    import.meta.env.VITE_BOOK_AUTHOR_URL ||
    'https://verlag-kern.de/autor/vera-mountney/',
} as const

export const books = {
  en: {
    title: 'When the Bats Fly, I Dream of Nigeria',
    subtitle: 'As a female teacher in Ibadan',
    cover: '/assets/images/books/when-the-bats-fly-i-dream-of-nigeria-en.jpg',
    buyUrl: bookLinks.buyUrlEn,
  },
  de: {
    title: 'Wenn Fledermäuse fliegen, träume ich von Nigeria',
    subtitle: 'Als Lehrerin in Ibadan',
    cover:
      '/assets/images/books/wenn-fledermaeuse-fliegen-traeume-ich-von-nigeria-de.jpg',
    buyUrl: bookLinks.buyUrlDe,
  },
} as const
