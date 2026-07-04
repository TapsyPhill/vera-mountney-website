import { useTranslation } from 'react-i18next'
import { credentials } from '../data/profileDetails'
import { SectionHeading } from './SectionHeading'

export function TrustHighlights() {
  const { t } = useTranslation()

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <SectionHeading title={t('trust.title')} subtitle={t('trust.subtitle')} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((key) => (
            <li
              key={key}
              className="glass-card flex items-start gap-3 p-5 text-sm leading-relaxed transition-all duration-300 hover:border-accent-400/30"
            >
              <span className="mt-0.5 text-accent-400" aria-hidden="true">
                ✓
              </span>
              <span>{t(`credentials.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
