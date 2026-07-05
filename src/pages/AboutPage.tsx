import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageMeta } from '../components/PageMeta'
import { SectionHeading } from '../components/SectionHeading'
import { AboutHighlights } from '../components/AboutHighlights'
import { PROFILE_IMAGE } from '../utils/constants'
import { organizations } from '../data/profileDetails'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <>
      <PageMeta titleKey="meta.about.title" descriptionKey="meta.about.description" />
      <section className="section-padding hero-gradient">
        <div className="container-narrow">
          <SectionHeading title={t('about.title')} subtitle={t('about.subtitle')} />

          <div className="grid items-start gap-8 lg:grid-cols-5 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
                <img
                  src={PROFILE_IMAGE}
                  alt="Vera Mountney"
                  className="aspect-[3/2] w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </div>

            <div className="space-y-5 lg:col-span-3 lg:space-y-6">
              <p className="text-base leading-relaxed sm:text-lg light:text-brand-900">
                {t('about.intro')}
              </p>
              <p className="leading-relaxed text-brand-200 light:text-brand-800">
                {t('about.bio1')}
              </p>
              <p className="leading-relaxed text-brand-200 light:text-brand-800">
                {t('about.bio2')}
              </p>
              <p className="leading-relaxed text-brand-200 light:text-brand-800">
                {t('about.bio3')}
              </p>
            </div>
          </div>

          <AboutHighlights />

          <div className="mt-12">
            <h3 className="mb-4 text-center font-display text-xl font-semibold sm:text-2xl light:text-brand-950">
              {t('organizations.title')}
            </h3>
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
              {organizations.map((key) => (
                <span
                  key={key}
                  className="rounded-full border border-accent-400/20 bg-white/5 px-4 py-2 text-sm light:border-brand-200 light:bg-white/80 light:text-brand-800"
                >
                  {t(`organizations.${key}`)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center sm:mt-12">
            <Link to="/contact" className="btn-primary">
              {t('nav.cta')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
