import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { HeroVisual } from './HeroVisual'
import { prefersReducedMotion } from '../utils/animation'

gsap.registerPlugin(useGSAP)

export function Hero() {
  const { t } = useTranslation()
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-badge', { opacity: 0, y: 20, duration: 0.6 })
        .from('.hero-title', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
        .from('.hero-tagline', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('.hero-text', { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 }, '-=0.3')
        .from('.hero-cta', { opacity: 0, y: 16, duration: 0.5, stagger: 0.08 }, '-=0.2')
    },
    { scope: contentRef },
  )

  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="container-narrow section-padding grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div ref={contentRef} className="order-2 lg:order-1">
          <p className="hero-badge mb-4 inline-block rounded-full border border-accent-400/30 bg-accent-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-400">
            {t('hero.badge')}
          </p>
          <h1 className="hero-title font-display text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
            {t('hero.title')}
          </h1>
          <p className="hero-tagline mt-2 text-lg font-medium gradient-text sm:text-xl">
            {t('hero.tagline')}
          </p>
          <p className="hero-text mt-6 max-w-xl text-base leading-relaxed text-brand-100 light:text-brand-800 sm:text-lg">
            {t('hero.subtitle')}
          </p>
          <p className="hero-text mt-4 max-w-xl text-sm leading-relaxed text-brand-200/80 light:text-brand-700">
            {t('hero.description')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/contact" className="hero-cta btn-primary">
              {t('hero.ctaPrimary')}
            </Link>
            <Link to="/services" className="hero-cta btn-secondary">
              {t('hero.ctaSecondary')}
            </Link>
            <Link to="/book" className="hero-cta btn-secondary">
              {t('hero.ctaBook')}
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}
