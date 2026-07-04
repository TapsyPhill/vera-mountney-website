import type { ReactNode } from 'react'
import type { ServiceIcon } from '../data/services'

const iconPaths: Record<ServiceIcon, ReactNode> = {
  consultation: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
  ),
  coaching: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17" />
  ),
  career: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-4 4 4 6-8M4 20h16" />
  ),
  application: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 4h6l1 2h4v14H4V6h4l1-2zm0 8h6M9 12h4" />
  ),
  proofreading: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h9l3 3v13H6V4zm3 8h6M9 14h4" />
  ),
  integration: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z" />
  ),
  intercultural: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8M4 12a8 8 0 1016 0 8 8 0 00-16 0z" />
  ),
  workshop: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 18v-4a4 4 0 014-4h8a4 4 0 014 4v4M8 10V6a4 4 0 118 0v4" />
  ),
  book: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h10a2 2 0 012 2v14l-7-3-7 3V6a2 2 0 012-2z" />
  ),
  publishing: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12M4 4h16v16H4V4z" />
  ),
  zoom: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4-2v8l-4-2v-4zM4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
  ),
  'german-test': (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.5 7.5H22l-6 4.5 2.5 7.5L12 18l-6.5 4.5L8 15 2 10.5h7.5L12 3z" />
  ),
  telc: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.5 4.2l1.4 2.8 3.1.5-2.2 2.1.5 3.1-2.8-1.5-2.8 1.5.5-3.1-2.2-2.1 3.1-.5 1.4-2.8z" />
  ),
  bsk: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  ),
  special: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.5 4.5H18l-3.8 2.8 1.5 4.5L12 12l-3.7 2.8 1.5-4.5L6 7.5h4.5L12 3z" />
  ),
}

interface ServiceIconDisplayProps {
  icon: ServiceIcon
}

export function ServiceIconDisplay({ icon }: ServiceIconDisplayProps) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent-400/20 bg-gradient-to-br from-brand-600/25 to-accent-400/10 shadow-sm shadow-accent-400/10 light:border-brand-200 light:from-brand-100 light:to-brand-50">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-6 w-6 text-accent-400"
        aria-hidden="true"
      >
        {iconPaths[icon]}
      </svg>
    </span>
  )
}
