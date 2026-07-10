export type ServiceIcon =
  | 'consultation'
  | 'coaching'
  | 'career'
  | 'application'
  | 'proofreading'
  | 'integration'
  | 'intercultural'
  | 'workshop'
  | 'book'
  | 'publishing'
  | 'zoom'
  | 'german-test'
  | 'telc'
  | 'bsk'
  | 'special'
  | 'business'

export interface Service {
  id: string
  icon: ServiceIcon
  featured?: boolean
}

export const services: Service[] = [
  { id: 'consultation', icon: 'consultation', featured: true },
  { id: 'coaching', icon: 'coaching', featured: true },
  { id: 'jobCoaching', icon: 'career', featured: true },
  { id: 'careerCoaching', icon: 'career', featured: true },
  { id: 'applicationHelp', icon: 'application', featured: true },
  { id: 'integration', icon: 'integration', featured: true },
  { id: 'intercultural', icon: 'intercultural', featured: true },
  { id: 'assessmentCenter', icon: 'career' },
  { id: 'testPreparation', icon: 'german-test', featured: true },
  { id: 'telc', icon: 'telc' },
  { id: 'bsk', icon: 'bsk' },
  { id: 'businessCoaching', icon: 'business', featured: true },
  { id: 'bookInquiry', icon: 'book' },
  { id: 'proofreading', icon: 'proofreading' },
  { id: 'workshops', icon: 'workshop' },
  { id: 'bookPresentation', icon: 'book' },
  { id: 'publishing', icon: 'publishing' },
  { id: 'zoomTraining', icon: 'zoom' },
  { id: 'specialOffer2026', icon: 'special' },
]

/** Shared service list for contact form and Vera Assistant inquiries */
export const inquiryServiceIds = [
  'consultation',
  'coaching',
  'jobCoaching',
  'applicationHelp',
  'integration',
  'intercultural',
  'careerCoaching',
  'assessmentCenter',
  'testPreparation',
  'telc',
  'bsk',
  'businessCoaching',
  'bookInquiry',
  'other',
] as const

export type InquiryServiceId = (typeof inquiryServiceIds)[number]

export function getInquiryServiceLabel(
  id: InquiryServiceId,
  t: (key: string) => string,
): string {
  if (id === 'other') return t('inquiryServices.other')
  return t(`services.${id}.title`)
}
