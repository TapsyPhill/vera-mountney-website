import { bookLinks, books } from '../data/bookLinks'
import { profile } from '../data/profile'
import type { InquiryServiceId } from '../data/services'

export type AssistantActionType = 'route' | 'link' | 'inquiry' | 'phone' | 'whatsapp'

export interface AssistantAction {
  id: string
  type: AssistantActionType
  labelKey: string
  path?: string
  href?: string
  service?: InquiryServiceId
  phone?: string
}

const defaultActionIds = ['sendInquiry', 'services', 'bookPage', 'linkedin'] as const

export function getDefaultActions(): AssistantAction[] {
  return defaultActionIds.map((id) => actionById(id)).filter(Boolean) as AssistantAction[]
}

function actionById(id: string): AssistantAction | null {
  switch (id) {
    case 'sendInquiry':
      return { id, type: 'inquiry', labelKey: 'assistant.actions.sendInquiry' }
    case 'services':
      return { id, type: 'route', labelKey: 'assistant.actions.services', path: '/services' }
    case 'bookPage':
      return { id, type: 'route', labelKey: 'assistant.actions.bookPage', path: '/book' }
    case 'about':
      return { id, type: 'route', labelKey: 'assistant.actions.about', path: '/about' }
    case 'contact':
      return { id, type: 'route', labelKey: 'assistant.actions.contact', path: '/contact' }
    case 'linkedin':
      return {
        id,
        type: 'link',
        labelKey: 'common.linkedinProfile',
        href: profile.linkedin,
      }
    case 'buyBookEn':
      return {
        id,
        type: 'link',
        labelKey: 'assistant.actions.buyBookEn',
        href: books.en.buyUrl,
      }
    case 'buyBookDe':
      return {
        id,
        type: 'link',
        labelKey: 'assistant.actions.buyBookDe',
        href: books.de.buyUrl,
      }
    case 'authorPage':
      return {
        id,
        type: 'link',
        labelKey: 'assistant.actions.authorPage',
        href: bookLinks.authorPageUrl,
      }
    case 'call':
      return {
        id,
        type: 'phone',
        labelKey: 'assistant.actions.call',
        phone: profile.phone.replace(/\s/g, ''),
      }
    case 'whatsapp':
      return {
        id,
        type: 'whatsapp',
        labelKey: 'assistant.actions.whatsapp',
        phone: profile.whatsapp,
      }
    case 'inquiryCv':
      return {
        id,
        type: 'inquiry',
        labelKey: 'assistant.actions.inquiryCv',
        service: 'applicationHelp',
      }
    case 'inquiryCareer':
      return {
        id,
        type: 'inquiry',
        labelKey: 'assistant.actions.inquiryCareer',
        service: 'careerCoaching',
      }
    case 'inquiryGermanTest':
      return {
        id,
        type: 'inquiry',
        labelKey: 'assistant.actions.inquiryGermanTest',
        service: 'testPreparation',
      }
    case 'inquiryAssessment':
      return {
        id,
        type: 'inquiry',
        labelKey: 'assistant.actions.inquiryAssessment',
        service: 'assessmentCenter',
      }
    case 'inquiryBusiness':
      return {
        id,
        type: 'inquiry',
        labelKey: 'assistant.actions.inquiryBusiness',
        service: 'businessCoaching',
      }
    case 'inquiryAppointment':
      return {
        id,
        type: 'inquiry',
        labelKey: 'assistant.actions.inquiryAppointment',
        service: 'consultation',
      }
    default:
      return null
  }
}

const topicActions: Record<string, string[]> = {
  whoIsVera: ['about', 'linkedin', 'services', 'sendInquiry'],
  services: ['services', 'sendInquiry', 'contact'],
  coaching: ['sendInquiry', 'services', 'contact'],
  cvHelp: ['inquiryCv', 'services', 'sendInquiry'],
  career: ['inquiryCareer', 'services', 'sendInquiry'],
  intercultural: ['sendInquiry', 'services', 'about'],
  germanTest: ['inquiryGermanTest', 'services', 'sendInquiry'],
  testPreparation: ['inquiryGermanTest', 'services', 'sendInquiry'],
  assessmentCenter: ['inquiryAssessment', 'services', 'sendInquiry'],
  businessCoaching: ['inquiryBusiness', 'services', 'about'],
  proofreading: ['sendInquiry', 'services', 'contact'],
  pricing: ['sendInquiry', 'contact', 'services'],
  onlineSessions: ['sendInquiry', 'services', 'contact'],
  appointment: ['inquiryAppointment', 'contact', 'sendInquiry'],
  contact: ['contact', 'call', 'whatsapp', 'linkedin'],
  book: ['bookPage', 'buyBookEn', 'buyBookDe', 'authorPage'],
  linkedin: ['linkedin', 'about', 'bookPage'],
  languages: ['about', 'services', 'sendInquiry'],
  location: ['contact', 'services', 'sendInquiry'],
  englishSite: ['about', 'services', 'bookPage'],
  specialOffer: ['sendInquiry', 'services', 'contact'],
  greeting: ['sendInquiry', 'services', 'bookPage', 'linkedin'],
  thanks: ['sendInquiry', 'services', 'bookPage'],
  fallback: defaultActionIds.slice(),
  unclear: ['sendInquiry', 'services', 'bookPage', 'inquiryAppointment'],
  offTopic: ['sendInquiry', 'services', 'bookPage'],
}

export function getActionsForTopic(topicId: string | null): AssistantAction[] {
  const ids = topicActions[topicId || 'fallback'] || topicActions.fallback
  return ids.map((id) => actionById(id)).filter(Boolean) as AssistantAction[]
}

export function getActionsForUserMessage(input: string): AssistantAction[] {
  const lower = input.toLowerCase()

  if (/\b(linkedin|linked.?in|profil)\b/i.test(lower)) {
    return getActionsForTopic('linkedin')
  }
  if (/\b(buy|kaufen|purchase|bestellen|verlag|isbn)\b/i.test(lower)) {
    return getActionsForTopic('book')
  }
  if (/\b(termin|appointment|session|meeting|buchen)\b/i.test(lower)) {
    return getActionsForTopic('appointment')
  }
  if (/\b(buch|book|nigeria|bats|fledermäus)\b/i.test(lower)) {
    return getActionsForTopic('book')
  }
  if (/\b(bewerbung|cv|resume|lebenslauf)\b/i.test(lower)) {
    return getActionsForTopic('cvHelp')
  }
  if (/\b(karriere|career|job coach)\b/i.test(lower)) {
    return getActionsForTopic('career')
  }
  if (/\b(assessment center|assessment centre|assessmentcenter)\b/i.test(lower)) {
    return getActionsForTopic('assessmentCenter')
  }
  if (/\b(business coach|business coaching|unternehmenscoach)\b/i.test(lower)) {
    return getActionsForTopic('businessCoaching')
  }
  if (/\b(test prep|testvorbereitung|test preparation)\b/i.test(lower)) {
    return getActionsForTopic('testPreparation')
  }
  if (/\b(kontakt|contact|phone|telefon|whatsapp|anruf)\b/i.test(lower)) {
    return getActionsForTopic('contact')
  }

  return getDefaultActions()
}
