import type { ServiceIcon } from '../data/services'

const icons: Record<ServiceIcon, string> = {
  consultation: '💬',
  coaching: '🎯',
  career: '📈',
  application: '📄',
  proofreading: '✍️',
  integration: '🌍',
  intercultural: '🤝',
  workshop: '👥',
  book: '📚',
  publishing: '📖',
  zoom: '💻',
  'german-test': '🎓',
  telc: '🏆',
  bsk: '📋',
  special: '✨',
}

interface ServiceIconDisplayProps {
  icon: ServiceIcon
}

export function ServiceIconDisplay({ icon }: ServiceIconDisplayProps) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 text-2xl light:bg-brand-100">
      {icons[icon]}
    </span>
  )
}
