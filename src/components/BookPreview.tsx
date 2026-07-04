import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { books } from '../data/bookLinks'

export function BookPreview() {
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(['en', 'de'] as const).map((lang) => {
        const book = books[lang]
        return (
          <article
            key={lang}
            className="glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-[3/4] max-h-48 overflow-hidden bg-brand-900/30 sm:max-h-none">
              <img
                src={book.cover}
                alt={book.title}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml,' +
                    encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280"><rect fill="#2e1065" width="200" height="280"/></svg>`,
                    )
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-display text-base font-semibold leading-snug">{book.title}</h3>
              <Link to="/book" className="mt-3 inline-block text-sm font-semibold text-accent-400 hover:underline">
                {t('book.ctaHome')} →
              </Link>
            </div>
          </article>
        )
      })}
    </div>
  )
}
