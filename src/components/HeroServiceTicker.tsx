import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { services } from '../data/services'
import { ServiceIconDisplay } from './ServiceIconDisplay'
import { prefersReducedMotion } from '../utils/animation'

gsap.registerPlugin(useGSAP)

const featuredServices = services.filter((s) => s.featured)

export function HeroServiceTicker() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [index, setIndex] = useState(0)

  const service = featuredServices[index % featuredServices.length]
  const title = t(`services.${service.id}.title`)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % featuredServices.length)
    }, 3400)
    return () => window.clearInterval(timer)
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion() || !cardRef.current) return
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 14, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power2.out' },
      )
    },
    { scope: containerRef, dependencies: [index, t] },
  )

  if (prefersReducedMotion()) {
    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {featuredServices.slice(0, 4).map((s) => (
          <Link
            key={s.id}
            to="/services"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs light:border-brand-200 light:bg-white/80"
          >
            {t(`services.${s.id}.title`)}
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="hero-service-ticker relative mt-4 h-[4.5rem] max-w-md sm:mt-5">
      <Link
        ref={cardRef}
        to="/services"
        key={service.id}
        className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-2xl border border-accent-400/20 bg-white/5 px-3 py-2.5 shadow-lg shadow-brand-950/20 backdrop-blur-sm transition-colors hover:border-accent-400/40 light:border-brand-200/80 light:bg-white/90 light:shadow-brand-900/5 sm:px-4"
      >
        <div className="scale-75 sm:scale-90">
          <ServiceIconDisplay icon={service.icon} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold sm:text-base light:text-brand-950">
            {title}
          </p>
          <p className="truncate text-xs text-brand-300 light:text-brand-600">
            {t('hero.serviceTickerHint')}
          </p>
        </div>
        <span className="hidden shrink-0 text-xs font-semibold text-accent-glow sm:inline">
          {t('common.learnMore')}
        </span>
      </Link>
    </div>
  )
}
