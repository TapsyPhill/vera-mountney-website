import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PROFILE_IMAGE } from '../utils/constants'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="container-narrow section-padding grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="animate-fade-in-up order-2 lg:order-1">
          <p className="mb-4 inline-block rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-400">
            {t('hero.badge')}
          </p>
          <h1 className="font-display text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
            {t('hero.title')}
          </h1>
          <p className="mt-2 text-lg font-medium gradient-text sm:text-xl">
            {t('hero.tagline')}
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-100 light:text-brand-800 sm:text-lg">
            {t('hero.subtitle')}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-200/80 light:text-brand-700">
            {t('hero.description')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contact" className="btn-primary">
              {t('hero.ctaPrimary')}
            </Link>
            <Link to="/services" className="btn-secondary">
              {t('hero.ctaSecondary')}
            </Link>
            <Link to="/book" className="btn-secondary">
              {t('hero.ctaBook')}
            </Link>
          </div>
        </div>

        <div className="animate-fade-in order-1 lg:order-2">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-600/40 via-brand-500/20 to-accent-400/30 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
              <img
                src={PROFILE_IMAGE}
                alt="Vera Mountney"
                className="aspect-[4/5] w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml,' +
                    encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect fill="#4c1d95" width="400" height="500"/><text x="200" y="260" text-anchor="middle" fill="#e8c99b" font-family="Georgia,serif" font-size="28">Vera Mountney</text></svg>',
                    )
                }}
              />
            </div>
            <div
              className="mt-4 rounded-xl border border-dashed border-accent-400/30 bg-white/5 px-4 py-3 text-center text-xs text-brand-200 light:text-brand-600"
              aria-hidden="true"
            >
              {t('hero.animationPlaceholder')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
