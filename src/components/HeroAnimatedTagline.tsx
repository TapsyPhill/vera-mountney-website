import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/animation'

gsap.registerPlugin(useGSAP)

export function HeroAnimatedTagline() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const words = t('hero.taglineWords', { returnObjects: true }) as string[]

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return

      const items = gsap.utils.toArray<HTMLElement>('.hero-tagline-word')

      gsap.from(items, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.18,
        ease: 'power3.out',
        delay: 0.4,
      })

      gsap.to(items, {
        textShadow: '0 0 24px rgba(251, 191, 36, 0.55)',
        duration: 1.2,
        stagger: {
          each: 0.35,
          repeat: -1,
          yoyo: true,
        },
        ease: 'sine.inOut',
        delay: 1.2,
      })
    },
    { scope: ref, dependencies: [words.join('|')] },
  )

  return (
    <div ref={ref} className="hero-tagline mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:mt-4">
      {words.map((word, i) => (
        <span key={word} className="inline-flex items-baseline">
          <span className="hero-tagline-word font-display text-2xl font-semibold gradient-text sm:text-3xl lg:text-4xl">
            {word}
          </span>
          {i < words.length - 1 && (
            <span className="ml-2 text-accent-400/60" aria-hidden="true">
              .
            </span>
          )}
        </span>
      ))}
    </div>
  )
}
