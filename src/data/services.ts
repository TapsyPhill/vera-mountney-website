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

export interface Service {
  id: string
  icon: ServiceIcon
  featured?: boolean
}

export const services: Service[] = [
  { id: 'consultation', icon: 'consultation', featured: true },
  { id: 'coaching', icon: 'coaching', featured: true },
  { id: 'jobCoaching', icon: 'career', featured: true },
  { id: 'careerCoaching', icon: 'career' },
  { id: 'applicationHelp', icon: 'application', featured: true },
  { id: 'proofreading', icon: 'proofreading' },
  { id: 'integration', icon: 'integration', featured: true },
  { id: 'intercultural', icon: 'intercultural', featured: true },
  { id: 'workshops', icon: 'workshop' },
  { id: 'bookPresentation', icon: 'book' },
  { id: 'publishing', icon: 'publishing' },
  { id: 'zoomTraining', icon: 'zoom' },
  { id: 'germanTest', icon: 'german-test' },
  { id: 'telc', icon: 'telc' },
  { id: 'bsk', icon: 'bsk' },
  { id: 'specialOffer2026', icon: 'special', featured: true },
]
