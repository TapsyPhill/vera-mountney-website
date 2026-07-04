import { useTranslation } from 'react-i18next'
import type { Service } from '../data/services'
import { ServiceIconDisplay } from './ServiceIconDisplay'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { t } = useTranslation()
  const title = t(`services.${service.id}.title`)
  const description = t(`services.${service.id}.description`)

  return (
    <article className="glass-card group p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-400/30 hover:shadow-xl hover:shadow-brand-900/20">
      <ServiceIconDisplay icon={service.icon} />
      <h3 className="mt-4 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-200 light:text-brand-700">
        {description}
      </p>
      {service.featured && (
        <span className="mt-4 inline-block rounded-full bg-accent-400/15 px-3 py-1 text-xs font-semibold text-accent-400">
          ★
        </span>
      )}
    </article>
  )
}
