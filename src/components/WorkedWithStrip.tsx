import { useTranslation } from 'react-i18next'
import { organizations, workedWith } from '../data/profileDetails'
import { SectionHeading } from './SectionHeading'

export function WorkedWithStrip() {
  const { t } = useTranslation()

  return (
    <section className="section-padding bg-white/5 light:bg-brand-50/80">
      <div className="container-narrow space-y-16">
        <div>
          <SectionHeading title={t('organizations.title')} />
          <div className="flex flex-wrap justify-center gap-4">
            {organizations.map((key) => (
              <span
                key={key}
                className="glass-card px-5 py-3 text-sm font-medium transition-all duration-300 hover:border-accent-400/40"
              >
                {t(`organizations.${key}`)}
              </span>
            ))}
          </div>
        </div>

        <div>
          <SectionHeading
            title={t('workedWith.title')}
            subtitle={t('workedWith.subtitle')}
          />
          <div className="flex flex-wrap justify-center gap-4">
            {workedWith.map((key) => (
              <span
                key={key}
                className="rounded-full border border-brand-400/30 px-5 py-2 text-sm font-medium text-brand-200 light:border-brand-300 light:text-brand-800"
              >
                {t(`workedWith.${key}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
