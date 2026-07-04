import { useTranslation } from 'react-i18next'
import { PageMeta } from '../components/PageMeta'
import { SectionHeading } from '../components/SectionHeading'
import { ServiceCard } from '../components/ServiceCard'
import { SpecialOfferBanner } from '../components/SpecialOfferBanner'
import { services } from '../data/services'

export function ServicesPage() {
  const { t } = useTranslation()
  const featured = services.filter((s) => s.featured)
  const others = services.filter((s) => !s.featured)

  return (
    <>
      <PageMeta titleKey="meta.services.title" descriptionKey="meta.services.description" />
      <SpecialOfferBanner />
      <section className="section-padding hero-gradient">
        <div className="container-narrow">
          <SectionHeading title={t('services.title')} subtitle={t('services.subtitle')} />

          <h3 className="mb-6 font-display text-2xl font-semibold">{t('services.featured')}</h3>
          <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
