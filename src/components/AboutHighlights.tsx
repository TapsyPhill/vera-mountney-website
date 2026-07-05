import { useTranslation } from 'react-i18next'
import {
  studies,
  languages,
  languageLevels,
  internationalExperience,
} from '../data/profileDetails'

export function AboutHighlights() {
  const { t } = useTranslation()

  return (
    <div className="mt-14 space-y-6 sm:mt-16">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-900/40 to-brand-950/30 light:border-brand-200/60 light:from-brand-100/80 light:to-brand-50/90">
        <div className="border-b border-white/10 px-5 py-4 light:border-brand-200/60 sm:px-8">
          <h3 className="font-display text-xl font-semibold sm:text-2xl light:text-brand-950">
            {t('about.studiesTitle')}
          </h3>
        </div>
        <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 light:divide-brand-200/60">
          {studies.map((key, i) => (
            <div key={key} className="flex items-start gap-4 px-5 py-5 sm:px-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent-400/30 bg-accent-400/10 font-display text-sm font-semibold text-accent-glow">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="pt-1 text-sm leading-relaxed light:text-brand-800 sm:text-base">
                {t(`about.studies.${key}`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 light:border-brand-200/60 light:bg-brand-50/70">
        <div className="border-b border-white/10 px-5 py-4 light:border-brand-200/60 sm:px-8">
          <h3 className="font-display text-xl font-semibold sm:text-2xl light:text-brand-950">
            {t('about.languagesTitle')}
          </h3>
          <p className="mt-1 text-xs text-brand-300 light:text-brand-600 sm:text-sm">
            {t('about.languagesSubtitle')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 p-5 sm:gap-3 sm:p-8">
          {languages.map((key) => {
            const level = languageLevels[key]
            const isPrimary = key === 'german'
            return (
              <div
                key={key}
                className={`inline-flex flex-col rounded-2xl border px-4 py-3 transition-all ${
                  isPrimary
                    ? 'border-accent-400/50 bg-gradient-to-br from-brand-600/30 to-accent-400/10 shadow-md shadow-accent-400/10 light:border-accent-500/40 light:from-brand-100 light:to-brand-50'
                    : 'border-white/10 bg-white/5 light:border-brand-200/80 light:bg-white/80'
                }`}
              >
                <span
                  className={`font-display text-base font-semibold sm:text-lg ${
                    isPrimary ? 'text-accent-glow light:text-brand-900' : 'light:text-brand-900'
                  }`}
                >
                  {t(`about.languages.${key}`)}
                </span>
                <span className="mt-0.5 text-[10px] uppercase tracking-wider text-brand-400 light:text-brand-600 sm:text-xs">
                  {t(`about.languageLevels.${level}`)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 light:border-brand-200/60 light:bg-brand-50/70">
        <div className="border-b border-white/10 px-5 py-4 light:border-brand-200/60 sm:px-8">
          <h3 className="font-display text-xl font-semibold sm:text-2xl light:text-brand-950">
            {t('about.experienceTitle')}
          </h3>
        </div>
        <div className="relative px-5 py-6 sm:px-8 sm:py-8">
          <div className="absolute left-8 top-8 bottom-8 hidden w-px bg-gradient-to-b from-accent-400/60 via-brand-400/40 to-transparent sm:block" />
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {internationalExperience.map((key, i) => (
              <div
                key={key}
                className="group relative rounded-2xl border border-white/10 bg-brand-950/20 px-4 py-4 transition-all hover:border-accent-400/30 light:border-brand-200/80 light:bg-white/80 light:hover:border-accent-400/40"
              >
                <span className="mb-2 inline-block text-[10px] font-semibold uppercase tracking-widest text-accent-400/80">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-display text-lg font-medium light:text-brand-900">
                  {t(`about.experience.${key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
