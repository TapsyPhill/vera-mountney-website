/** Placeholder utilities for Phase 2 animation libraries (Framer Motion, GSAP, Lottie). */
export const animationConfig = {
  fadeIn: 'animate-fade-in',
  fadeInUp: 'animate-fade-in-up',
  fadeInDelay: (ms: number) => ({ animationDelay: `${ms}ms` }),
  transitionClass: 'transition-all duration-300 ease-out',
} as const

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
