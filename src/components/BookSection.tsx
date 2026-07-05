import { useTranslation } from 'react-i18next'
import { books, bookLinks, type BookLang } from '../data/bookLinks'
import { SectionHeading } from './SectionHeading'
import { ButtonLink } from './ButtonLink'

interface BookSectionProps {
  compact?: boolean
}

function BookMetaTags({ lang }: { lang: BookLang }) {
  const { t } = useTranslation()
  const book = books[lang]

  return (
    <div className="mt-4 space-y-3 border-t border-white/10 pt-4 light:border-brand-200/60">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-400 light:text-brand-600">
          {t('book.categoriesLabel')}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {book.categories.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-brand-400/25 bg-brand-600/15 px-2.5 py-1 text-[11px] text-brand-100 light:border-brand-300 light:bg-brand-100 light:text-brand-800"
            >
              {t(`book.categories.${cat}`)}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-400 light:text-brand-600">
          {t('book.keywordsLabel')}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {book.keywords.map((kw) => (
            <span
              key={kw}
              className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-brand-300 light:bg-brand-100/80 light:text-brand-700"
            >
              {t(`book.keywords.${kw}`)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
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
        <p className="mx-auto mb-10 max-w-3xl text-center text-sm leading-relaxed text-brand-200 light:text-brand-800">
          {t('book.description')}
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {(['en', 'de'] as const).map((lang) => {
            const book = books[lang]
            return (
              <article
                key={lang}
                className="glass-card card-shine overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
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
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-accent-glow">
                      {lang === 'en' ? 'English' : 'Deutsch'}
                    </p>
                    <div className="text-right">
                      <p className="font-display text-2xl font-semibold text-accent-glow light:text-brand-900">
                        {book.price}
                      </p>
                      <p className="text-[10px] text-brand-400 light:text-brand-600">
                        {t('book.inclVat')}
                      </p>
                    </div>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold light:text-brand-950">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm italic text-brand-300 light:text-brand-700">
                    {book.subtitle}
                  </p>
                  <p className="mt-2 inline-block rounded-full border border-accent-400/25 bg-accent-400/10 px-3 py-1 text-[11px] font-medium text-accent-glow">
                    {t(`book.formats.${book.formatKey}`)}
                  </p>
                  <p className="mt-2 text-[11px] text-brand-400 light:text-brand-600">
                    ISBN {book.isbn}
                  </p>
                  <p className="mt-1 text-[11px] text-brand-400 light:text-brand-600">
                    {bookLinks.publisher}
                  </p>

                  {!compact && <BookMetaTags lang={lang} />}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <ButtonLink href={book.buyUrl} external variant="primary">
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
