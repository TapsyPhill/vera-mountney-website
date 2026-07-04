import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageMeta } from '../components/PageMeta'
import { SectionHeading } from '../components/SectionHeading'
import { PROFILE_IMAGE } from '../utils/constants'
import {
  studies,
  languages,
  internationalExperience,
  organizations,
} from '../data/profileDetails'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <>
      <PageMeta titleKey="meta.about.title" descriptionKey="meta.about.description" />
      <section className="section-padding hero-gradient">
        <div className="container-narrow">
          <SectionHeading title={t('about.title')} subtitle={t('about.subtitle')} />

          <div className="grid items-start gap-12 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
                <img
                  src={PROFILE_IMAGE}
                  alt="Vera Mountney"
                  className="aspect-[4/5] w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </div>

            <div className="space-y-6 lg:col-span-3">
              <p className="text-lg leading-relaxed">{t('about.intro')}</p>
              <p className="leading-relaxed text-brand-200 light:text-brand-700">
                {t('about.bio1')}
              </p>
              <p className="leading-relaxed text-brand-200 light:text-brand-700">
                {t('about.bio2')}
              </p>
              <p className="leading-relaxed text-brand-200 light:text-brand-700">
                {t('about.bio3')}
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="glass-card p-6">
              <h3 className="font-display text-xl font-semibold">{t('about.studiesTitle')}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {studies.map((key) => (
                  <li key={key} className="flex gap-2">
                    <span className="text-accent-400">•</span>
                    {t(`about.studies.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display text-xl font-semibold">{t('about.languagesTitle')}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {languages.map((key) => (
                  <li key={key} className="flex gap-2">
                    <span className="text-accent-400">•</span>
                    {t(`about.languages.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display text-xl font-semibold">
                {t('about.experienceTitle')}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {internationalExperience.map((key) => (
                  <li key={key} className="flex gap-2">
                    <span className="text-accent-400">•</span>
                    {t(`about.experience.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="mb-4 text-center font-display text-2xl font-semibold">
              {t('organizations.title')}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {organizations.map((key) => (
                <span key={key} className="glass-card px-4 py-2 text-sm">
                  {t(`organizations.${key}`)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/contact" className="btn-primary">
              {t('about.cta')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
