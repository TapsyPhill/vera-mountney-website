import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { HERO_PORTRAITS } from '../utils/constants'
import { prefersReducedMotion } from '../utils/animation'

gsap.registerPlugin(useGSAP)

const ROTATION_MS = 5000

export function HeroVisual() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = prefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return

      const orbs = gsap.utils.toArray<HTMLElement>('.hero-orb')
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          y: `+=${20 + i * 8}`,
          x: `+=${10 - i * 5}`,
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        })
      })

      gsap.from(frameRef.current, {
        opacity: 0,
        scale: 0.92,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2,
      })

      gsap.to('.hero-glow', {
        opacity: 0.6,
        scale: 1.05,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    },
    { scope: containerRef },
  )

  useEffect(() => {
    if (reducedMotion || paused) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_PORTRAITS.length)
    }, ROTATION_MS)

    return () => window.clearInterval(timer)
  }, [paused, reducedMotion])

  return (
    <div ref={containerRef} className="relative mx-auto max-w-md lg:max-w-none">
      <div
        className="hero-orb pointer-events-none absolute -left-6 top-8 h-24 w-24 rounded-full bg-brand-500/30 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="hero-orb pointer-events-none absolute -right-4 top-1/3 h-32 w-32 rounded-full bg-accent-400/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="hero-orb pointer-events-none absolute bottom-12 left-1/4 h-20 w-20 rounded-full bg-blue-500/20 blur-2xl"
        aria-hidden="true"
      />

      <div className="hero-glow absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-600/40 via-brand-500/20 to-accent-400/30 blur-2xl" />

      <div
        ref={frameRef}
        className="relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="relative aspect-[4/5] w-full sm:aspect-[3/4] lg:aspect-[4/5]">
          {HERO_PORTRAITS.map((src, index) => (
            <img
              key={src}
              src={src}
              alt="Vera Mountney"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1400ms] ease-in-out ${
                index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
              }`}
              style={{ transitionProperty: 'opacity, transform' }}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/45 via-transparent to-transparent" />

        {!reducedMotion && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {HERO_PORTRAITS.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`Portrait ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition ${
                  index === activeIndex
                    ? 'bg-white shadow-sm'
                    : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="absolute -bottom-3 -right-3 hidden rounded-2xl border border-accent-400/30 bg-brand-900/90 px-4 py-3 shadow-xl backdrop-blur-md sm:block light:border-brand-300/50 light:bg-white/95">
        <p className="font-display text-sm font-semibold text-accent-glow light:text-brand-800">
          {t('hero.badge')}
        </p>
        <p className="text-xs text-brand-200 light:text-[#5F4A6D]">Verden, Germany</p>
      </div>
    </div>
  )
}
