import { useTranslation } from 'react-i18next'
import { books } from '../data/bookLinks'
import { SectionHeading } from './SectionHeading'
import { ButtonLink } from './ButtonLink'

interface BookSectionProps {
  compact?: boolean
}

export function BookSection({ compact = false }: BookSectionProps) {
  const { t } = useTranslation()

  return (
    <section className={`section-padding ${compact ? '' : 'bg-white/5 light:bg-brand-50/50'}`}>
      <div className="container-narrow">
        <SectionHeading
          title={t('book.title')}
          subtitle={compact ? undefined : t('book.subtitle')}
        />
        <p className="mx-auto mb-10 max-w-3xl text-center text-sm leading-relaxed text-brand-200 light:text-brand-700">
          {t('book.description')}
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {(['en', 'de'] as const).map((lang) => {
            const book = books[lang]
            return (
              <article
                key={lang}
                className="glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="aspect-[7/10] overflow-hidden bg-brand-900/30">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,' +
                        encodeURIComponent(
                          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect fill="#2e1065" width="300" height="400"/><text x="150" y="200" text-anchor="middle" fill="#e8c99b" font-family="Georgia,serif" font-size="14">${lang.toUpperCase()} Edition</text></svg>`,
                        )
                    }}
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent-400">
                    {lang === 'en' ? 'English' : 'Deutsch'}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold">{book.title}</h3>
                  <p className="mt-1 text-sm italic text-brand-300 light:text-brand-600">
                    {book.subtitle}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <ButtonLink
                      href={book.buyUrl}
                      external
                      variant="primary"
                    >
                      {lang === 'en' ? t('book.buyEn') : t('book.buyDe')}
                    </ButtonLink>
                    <ButtonLink href={book.buyUrl} external variant="secondary">
                      {lang === 'en' ? t('book.viewEn') : t('book.viewDe')}
                    </ButtonLink>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {!compact && (
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-brand-300 light:text-brand-600">
            {t('book.externalNote')}
          </p>
        )}
      </div>
    </section>
  )
}
