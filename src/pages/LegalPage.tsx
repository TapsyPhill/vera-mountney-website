import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PageMeta } from '../components/PageMeta'
import { SectionHeading } from '../components/SectionHeading'
import { profile } from '../data/profile'

type LegalPageKind = 'impressum' | 'privacy'

interface LegalSection {
  title: string
  paragraphs: string[]
}

export function LegalPage({ kind }: { kind: LegalPageKind }) {
  const { t, i18n } = useTranslation()
  const base = `legal.${kind}`
  const sections = t(`${base}.sections`, { returnObjects: true }) as LegalSection[]
  const country = i18n.language === 'de' ? profile.address.countryDe : profile.address.countryEn

  return (
    <>
      <PageMeta titleKey={`${base}.meta.title`} descriptionKey={`${base}.meta.description`} />
      <section className="section-padding hero-gradient">
        <div className="container-narrow max-w-3xl">
          <SectionHeading title={t(`${base}.heading`)} subtitle={t(`${base}.subtitle`, { defaultValue: '' }) || undefined} />

          {kind === 'impressum' && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 light:border-brand-300/40 light:bg-white sm:p-8">
              <h2 className="font-display text-lg font-semibold light:text-brand-950">
                {t('legal.impressum.ddgHeading')}
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-brand-200 light:text-brand-800">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-400 light:text-brand-600">
                    {t('legal.impressum.providerLabel')}
                  </p>
                  <p className="mt-1">
                    {profile.name}
                    <br />
                    {profile.address.street}
                    <br />
                    {profile.address.postalCode} {profile.address.city}
                    <br />
                    {country}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-400 light:text-brand-600">
                    {t('legal.impressum.contactLabel')}
                  </p>
                  <p className="mt-1">
                    {t('legal.impressum.emailLabel')}:{' '}
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-accent-glow underline-offset-2 hover:underline light:text-brand-700"
                    >
                      {profile.email}
                    </a>
                    <br />
                    {t('legal.impressum.phoneLabel')}:{' '}
                    <a
                      href={`tel:${profile.phoneTel}`}
                      className="text-accent-glow underline-offset-2 hover:underline light:text-brand-700"
                    >
                      {profile.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {kind === 'privacy' && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 light:border-brand-300/40 light:bg-white sm:p-8">
              <h2 className="font-display text-lg font-semibold light:text-brand-950">
                {t('legal.privacy.responsibleHeading')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-200 light:text-brand-800">
                {profile.name}
                <br />
                {profile.address.street}
                <br />
                {profile.address.postalCode} {profile.address.city}
                <br />
                {country}
                <br />
                {t('legal.impressum.emailLabel')}:{' '}
                <a
                  href={`mailto:${profile.email}`}
                  className="text-accent-glow underline-offset-2 hover:underline light:text-brand-700"
                >
                  {profile.email}
                </a>
                <br />
                {t('legal.impressum.phoneLabel')}:{' '}
                <a
                  href={`tel:${profile.phoneTel}`}
                  className="text-accent-glow underline-offset-2 hover:underline light:text-brand-700"
                >
                  {profile.phone}
                </a>
              </p>
            </div>
          )}

          <div className="space-y-8">
            {sections.map((section) => (
              <article key={section.title}>
                <h2 className="font-display text-lg font-semibold light:text-brand-950">{section.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-brand-200 light:text-brand-800">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          {kind === 'privacy' && (
            <p className="mt-10 text-xs text-brand-400 light:text-brand-600">
              {t('legal.privacy.updated')}
            </p>
          )}

          <p className="mt-8 text-sm text-brand-300 light:text-brand-700">
            <Link to="/contact" className="text-accent-glow underline-offset-2 hover:underline light:text-brand-700">
              {t('legal.backToContact')}
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
