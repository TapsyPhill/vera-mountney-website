import { useTranslation } from 'react-i18next'
import { PageMeta } from '../components/PageMeta'
import { SectionHeading } from '../components/SectionHeading'
import { ContactForm } from '../components/ContactForm'
import { profile } from '../data/profile'

export function ContactPage() {
  const { t } = useTranslation()

  return (
    <>
      <PageMeta titleKey="meta.contact.title" descriptionKey="meta.contact.description" />
      <section className="section-padding hero-gradient">
        <div className="container-narrow">
          <SectionHeading title={t('contact.title')} subtitle={t('contact.subtitle')} />
          <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-brand-200 light:text-brand-800 sm:mb-10">
            {t('contact.description')}
          </p>

          <div className="grid gap-6 lg:grid-cols-5 lg:gap-10">
            <div className="space-y-4 sm:space-y-6 lg:col-span-2">
              <div className="glass-card p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold sm:text-xl light:text-brand-950">
                  {t('contact.email')}
                </h3>
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-2 block break-all text-accent-glow hover:underline"
                >
                  {profile.email}
                </a>
                <a href={`mailto:${profile.email}`} className="btn-secondary mt-4 inline-flex text-xs">
                  {t('contact.writeEmail')}
                </a>
              </div>

              <div className="glass-card p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold sm:text-xl light:text-brand-950">
                  {t('contact.phone')}
                </h3>
                <a
                  href={`tel:${profile.phone.replace(/\s/g, '')}`}
                  className="mt-2 block text-accent-glow hover:underline"
                >
                  {profile.phone}
                </a>
                <a
                  href={`tel:${profile.phone.replace(/\s/g, '')}`}
                  className="btn-secondary mt-4 inline-flex text-xs"
                >
                  {t('contact.callNow')}
                </a>
              </div>

              <div className="glass-card p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold sm:text-xl light:text-brand-950">
                  {t('contact.appointment')}
                </h3>
                <p className="mt-2 text-sm text-brand-200 light:text-brand-800">
                  {t('contact.appointmentNote')}
                </p>
              </div>
            </div>

            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
