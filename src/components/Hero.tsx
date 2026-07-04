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
      <div className="container-narrow section-padding grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div ref={contentRef} className="order-2 lg:order-1">
          <p className="hero-badge mb-4 inline-block rounded-full border border-accent-400/40 bg-accent-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-glow">
            {t('hero.badge')}
          </p>
          <h1 className="hero-title font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-7xl light:text-brand-950">
            {t('hero.title')}
          </h1>
          <p className="hero-tagline mt-2 text-base font-medium gradient-text sm:text-lg lg:text-xl">
            {t('hero.tagline')}
          </p>
          <p className="hero-text mt-5 max-w-xl text-sm leading-relaxed text-brand-100 light:text-brand-800 sm:mt-6 sm:text-base lg:text-lg">
            {t('hero.subtitle')}
          </p>
          <p className="hero-text mt-3 max-w-xl text-sm leading-relaxed text-brand-200/90 light:text-brand-700 sm:mt-4">
            {t('hero.description')}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link to="/contact" className="hero-cta btn-primary w-full justify-center sm:w-auto">
              {t('nav.cta')}
            </Link>
            <Link to="/services" className="hero-cta btn-secondary w-full justify-center sm:w-auto">
              {t('hero.ctaSecondary')}
            </Link>
            <Link to="/book" className="hero-cta btn-secondary w-full justify-center sm:w-auto">
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
