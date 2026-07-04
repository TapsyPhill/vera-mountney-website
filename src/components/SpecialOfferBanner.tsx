import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export function SpecialOfferBanner() {
  const { t } = useTranslation()

  return (
    <section className="border-y border-accent-400/20 bg-gradient-to-r from-brand-900/80 via-brand-800/60 to-brand-900/80 light:from-brand-100 light:via-brand-50 light:to-brand-100">
      <div className="container-narrow flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent-400">
            {t('specialOffer.label')}
          </p>
          <p className="font-display text-xl font-semibold sm:text-2xl">
            {t('specialOffer.title')}
          </p>
          <p className="mt-1 max-w-xl text-sm text-brand-200 light:text-brand-700">
            {t('specialOffer.description')}
          </p>
        </div>
        <Link to="/contact" className="btn-primary shrink-0">
          {t('specialOffer.cta')}
        </Link>
      </div>
    </section>
  )
}
