import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageMeta } from '../components/PageMeta'
import { Hero } from '../components/Hero'
import { SectionHeading } from '../components/SectionHeading'
import { ServiceCard } from '../components/ServiceCard'
import { BookPreview } from '../components/BookPreview'
import { TrustHighlights } from '../components/TrustHighlights'
import { GallerySection } from '../components/GallerySection'
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

      <ScrollReveal className="section-padding">
        <div className="container-narrow">
          <SectionHeading
            title={t('home.servicesPreview')}
            subtitle={t('services.subtitle')}
          />
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {featuredServices.map((service, i) => (
              <ScrollReveal key={service.id} delay={i * 0.05}>
                <ServiceCard service={service} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-8 text-center sm:mt-10">
            <Link to="/services" className="btn-secondary">
              {t('services.viewAll')}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="section-padding bg-white/5 light:bg-brand-100/40">
        <div className="container-narrow grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div>
            <SectionHeading
              title={t('home.aboutPreview')}
              centered={false}
            />
            <p className="text-sm leading-relaxed text-brand-200 light:text-brand-800 sm:text-base">
              {t('home.aboutTeaser')}
            </p>
            <Link to="/about" className="btn-secondary mt-6 inline-flex">
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
        <GallerySection />
      </ScrollReveal>
      <ScrollReveal>
        <WorkedWithStrip />
      </ScrollReveal>

      <section className="section-padding bg-gradient-to-br from-brand-900/80 to-brand-950 light:from-brand-200/60 light:to-brand-100/80">
        <div className="container-narrow text-center">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl lg:text-4xl light:text-brand-950">
            {t('home.ctaSection.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-brand-200 light:text-brand-800 sm:text-base">
            {t('home.ctaSection.description')}
          </p>
          <Link to="/contact" className="btn-primary mt-6 inline-flex sm:mt-8">
            {t('nav.cta')}
          </Link>
        </div>
      </section>
    </>
  )
}
