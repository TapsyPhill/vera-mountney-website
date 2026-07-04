import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageMeta } from '../components/PageMeta'
import { Hero } from '../components/Hero'
import { SpecialOfferBanner } from '../components/SpecialOfferBanner'
import { SectionHeading } from '../components/SectionHeading'
import { ServiceCard } from '../components/ServiceCard'
import { BookPreview } from '../components/BookPreview'
import { TrustHighlights } from '../components/TrustHighlights'
import { WorkedWithStrip } from '../components/WorkedWithStrip'
import { ScrollReveal } from '../components/ScrollReveal'
import { services } from '../data/services'

export function HomePage() {
  const { t } = useTranslation()
  const featuredServices = services.filter((s) => s.featured).slice(0, 6)

  return (
    <>
      <PageMeta titleKey="meta.home.title" descriptionKey="meta.home.description" />
      <Hero />
      <SpecialOfferBanner />

      <ScrollReveal className="section-padding">
        <div className="container-narrow">
          <SectionHeading
            title={t('home.servicesPreview')}
            subtitle={t('services.subtitle')}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 0.05}>
                <ServiceCard service={service} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/services" className="btn-secondary">
              {t('services.viewAll')}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section-padding bg-white/5 light:bg-brand-50/80">
        <div className="container-narrow grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              title={t('home.aboutPreview')}
              centered={false}
            />
            <p className="text-sm leading-relaxed text-brand-200 light:text-brand-700 sm:text-base">
              {t('home.aboutTeaser')}
            </p>
            <Link to="/about" className="btn-primary mt-6 inline-flex">
              {t('common.learnMore')}
            </Link>
          </div>
          <BookPreview />
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <TrustHighlights />
      </ScrollReveal>
      <ScrollReveal>
        <WorkedWithStrip />
      </ScrollReveal>

      <ScrollReveal className="section-padding">
        <div className="container-narrow text-center">
          <SectionHeading title={t('home.testimonials.title')} />
          <p className="text-sm text-brand-300 light:text-brand-600">
            {t('home.testimonials.comingSoon')}
          </p>
        </div>
      </ScrollReveal>

      <section className="section-padding bg-gradient-to-br from-brand-900/80 to-brand-950 light:from-brand-100 light:to-brand-50">
        <div className="container-narrow text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            {t('home.ctaSection.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-200 light:text-brand-700">
            {t('home.ctaSection.description')}
          </p>
          <Link to="/contact" className="btn-primary mt-8 inline-flex">
            {t('home.ctaSection.cta')}
          </Link>
        </div>
      </section>
    </>
  )
}
