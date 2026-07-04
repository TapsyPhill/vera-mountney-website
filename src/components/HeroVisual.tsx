import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { PROFILE_IMAGE } from '../utils/constants'
import { prefersReducedMotion } from '../utils/animation'

gsap.registerPlugin(useGSAP)

export function HeroVisual() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

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

      gsap.from(imageRef.current, {
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
        ref={imageRef}
        className="relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl"
      >
        <img
          src={PROFILE_IMAGE}
          alt="Vera Mountney"
          className="aspect-[3/2] w-full object-cover"
          width={1536}
          height={1024}
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml,' +
              encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect fill="#4c1d95" width="600" height="400"/><text x="300" y="210" text-anchor="middle" fill="#e8c99b" font-family="Georgia,serif" font-size="28">Vera Mountney</text></svg>',
              )
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 via-transparent to-transparent" />
      </div>

      <div className="absolute -bottom-3 -right-3 hidden rounded-2xl border border-accent-400/30 bg-brand-900/90 px-4 py-3 shadow-xl backdrop-blur-md sm:block light:bg-white/90">
        <p className="font-display text-sm font-semibold text-accent-glow">
          {t('hero.badge')}
        </p>
        <p className="text-xs text-brand-200 light:text-brand-700">Verden, Germany</p>
      </div>
    </div>
  )
}
