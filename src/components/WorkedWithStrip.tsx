import { useTranslation } from 'react-i18next'
import { profile } from '../data/profile'
import { SectionHeading } from './SectionHeading'

export function WorkedWithStrip() {
  const { t } = useTranslation()

  return (
    <section className="section-padding bg-white/5 light:bg-[#F7F2FA]">
      <div className="container-narrow">
        <SectionHeading title={t('organizations.title')} />
        <p className="mx-auto max-w-xl text-center text-sm text-brand-300 light:text-[#5F4A6D]">
          {t('organizations.placeholder')}
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !text-sm"
          >
            {t('common.linkedinProfile')}
          </a>
        </div>
      </div>
    </section>
  )
}
