import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageMeta } from '../components/PageMeta'
import { SectionHeading } from '../components/SectionHeading'
import { AboutHighlights } from '../components/AboutHighlights'
import { PROFILE_IMAGE } from '../utils/constants'
import { profile } from '../data/profile'

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
              <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl light:border-brand-300/40">
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
              <p className="text-base leading-relaxed sm:text-lg light:text-[#24152F]">
                {t('about.intro')}
              </p>
              <p className="leading-relaxed text-brand-200 light:text-[#5F4A6D]">
                {t('about.bio1')}
              </p>
              <p className="leading-relaxed text-brand-200 light:text-[#5F4A6D]">
                {t('about.bio2')}
              </p>
              <p className="leading-relaxed text-brand-200 light:text-[#5F4A6D]">
                {t('about.bio3')}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 light:border-brand-300/40 light:bg-white sm:p-8">
            <h3 className="font-display text-xl font-semibold light:text-[#24152F]">
              {t('about.businessCoachTitle')}
            </h3>
            <p className="mt-3 leading-relaxed text-brand-200 light:text-[#5F4A6D]">
              {t('about.businessCoach')}
            </p>
          </div>

          <AboutHighlights />

          <div className="mt-10 flex flex-wrap justify-center gap-4 sm:mt-12">
            <Link to="/contact" className="btn-primary">
              {t('nav.cta')}
            </Link>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              {t('common.linkedinProfile')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
