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
      <section className="section-padding hero-gradient overflow-x-hidden">
        <div className="container-narrow min-w-0">
          <SectionHeading title={t('contact.title')} subtitle={t('contact.subtitle')} />
          <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-brand-200 light:text-brand-800 sm:mb-10">
            {t('contact.description')}
          </p>

          <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-5 lg:gap-10">
            <div className="order-2 space-y-4 sm:space-y-6 lg:order-1 lg:col-span-2">
              <div className="glass-card p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold sm:text-xl light:text-brand-950">
                  {t('contact.email')}
                </h3>
                <p className="mt-2 text-sm text-brand-200 light:text-brand-800">
                  {t('contact.formHint')}
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-3 block text-accent-glow underline-offset-2 hover:underline"
                >
                  {profile.email}
                </a>
              </div>

              <div className="glass-card p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold sm:text-xl light:text-brand-950">
                  {t('contact.phone')}
                </h3>
                <a
                  href={`tel:${profile.phoneTel}`}
                  className="mt-2 block text-accent-glow hover:underline"
                >
                  {profile.phone}
                </a>
                <a
                  href={`tel:${profile.phoneTel}`}
                  className="btn-secondary mt-4 inline-flex text-xs"
                >
                  {t('contact.callNow')}
                </a>
              </div>

              <div className="glass-card p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold sm:text-xl light:text-[#24152F]">
                  {t('contact.appointment')}
                </h3>
                <p className="mt-2 text-sm text-brand-200 light:text-[#5F4A6D]">
                  {t('contact.appointmentNote')}
                </p>
              </div>

              <div className="glass-card p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold sm:text-xl light:text-[#24152F]">
                  LinkedIn
                </h3>
                <p className="mt-2 text-sm text-brand-200 light:text-[#5F4A6D]">
                  {t('contact.linkedinNote')}
                </p>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary mt-4 inline-flex text-xs"
                >
                  {t('common.linkedinProfile')}
                </a>
              </div>
            </div>

            <div className="order-1 min-w-0 lg:order-2 lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
