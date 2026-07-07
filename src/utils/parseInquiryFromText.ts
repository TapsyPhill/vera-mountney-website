import { type InquiryServiceId } from '../data/services'
import type { PreferredContactMethod } from '../types/inquiry'

export interface ParsedInquiry {
  name?: string
  email?: string
  phone?: string
  selectedService?: InquiryServiceId
  otherService?: string
  preferredContactMethod?: PreferredContactMethod
  preferredDateTime?: string
  message?: string
  appointmentRequest?: boolean
}

const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/

const phonePattern =
  /(?:\+49|0049|0)\s?(?:\(?\d{2,5}\)?[\s/-]?)?\d[\d\s/-]{5,12}\d/g

const namePatterns = [
  /(?:my name is|i am|i'm|this is|name is|name:)\s+([A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,40})/i,
  /(?:ich heiße|ich bin|mein name ist|name:)\s+([A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,40})/i,
  /^hi[,!]?\s+(?:i'm|i am|ich bin)\s+([A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ\s'-]{1,30})/i,
]

const serviceMatchers: Array<{ id: InquiryServiceId; patterns: RegExp[] }> = [
  {
    id: 'applicationHelp',
    patterns: [/cv|resume|bewerbung|lebenslauf|anschreiben|application help|application support/i],
  },
  {
    id: 'careerCoaching',
    patterns: [/career coach|karriere|career change|beruflich|job change/i],
  },
  {
    id: 'jobCoaching',
    patterns: [/job coach|jobsuche|job search|find a job|neuer job/i],
  },
  {
    id: 'consultation',
    patterns: [/consultation|beratung|advice|rat/i],
  },
  {
    id: 'intercultural',
    patterns: [/intercultural|interkulturell|integration|cultural training/i],
  },
  {
    id: 'germanTest',
    patterns: [/german test|deutschtest|deutsch prüfung|dtz|sprachprüfung/i],
  },
  { id: 'telc', patterns: [/\btelc\b/i] },
  { id: 'bsk', patterns: [/\bbsk\b/i] },
  {
    id: 'proofreading',
    patterns: [/proofread|lektorat|korrektur|text review|text prüfen/i],
  },
  {
    id: 'publishing',
    patterns: [/publish|verlag|publishing|manuscript/i],
  },
  {
    id: 'workshops',
    patterns: [/workshop|seminar|training session/i],
  },
]

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function extractEmail(text: string): string | undefined {
  const match = text.match(emailPattern)
  return match?.[0]
}

function extractPhone(text: string): string | undefined {
  const matches = text.match(phonePattern)
  if (!matches?.length) return undefined
  return normalizeWhitespace(matches[0])
}

function extractName(text: string): string | undefined {
  for (const pattern of namePatterns) {
    const match = text.match(pattern)
    if (match?.[1]) {
      const name = normalizeWhitespace(match[1].replace(/[,.\s]+$/, ''))
      if (name.length >= 2) return name
    }
  }
  return undefined
}

function extractService(text: string): InquiryServiceId | undefined {
  for (const { id, patterns } of serviceMatchers) {
    if (patterns.some((pattern) => pattern.test(text))) {
      return id
    }
  }
  return undefined
}

function extractContactMethod(text: string): PreferredContactMethod | undefined {
  const lower = text.toLowerCase()
  if (/\bwhatsapp\b/i.test(lower)) return 'whatsapp'
  if (/(call me|phone|telefon|anruf|rückruf|call back)/i.test(lower)) return 'phone'
  if (/(email|e-mail|mail me|per mail)/i.test(lower)) return 'email'
  if (/(no preference|egal|any method)/i.test(lower)) return 'noPreference'
  return undefined
}

function extractDateTime(text: string): string | undefined {
  const patterns = [
    /\b(?:mon|tue|wed|thu|fri|sat|sun|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)[a-z]*\s+\d{1,2}(?:[./-]\d{1,2})?(?:[./-]\d{2,4})?(?:\s+(?:at|um|@)\s*)?\d{1,2}[:.]\d{2}(?:\s*(?:am|pm|uhr))?/i,
    /\b\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?(?:\s+(?:at|um|@)\s*)?\d{1,2}[:.]\d{2}(?:\s*(?:am|pm|uhr))?/i,
    /\b(?:tomorrow|morgen|next week|nächste woche|next (?:mon|tue|wed|thu|fri)|nächsten (?:montag|dienstag|mittwoch|donnerstag|freitag))(?:\s+(?:at|um|@)\s*)?\d{1,2}[:.]\d{2}(?:\s*(?:am|pm|uhr))?/i,
    /\b(?:at|um|@)\s*\d{1,2}[:.]\d{2}(?:\s*(?:am|pm|uhr))?/i,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[0]) return normalizeWhitespace(match[0])
  }

  return undefined
}

function extractMessage(text: string, parsed: ParsedInquiry): string | undefined {
  let remainder = text

  if (parsed.email) remainder = remainder.replace(parsed.email, ' ')
  if (parsed.phone) remainder = remainder.replace(parsed.phone, ' ')
  if (parsed.name) {
    for (const pattern of namePatterns) {
      remainder = remainder.replace(pattern, ' ')
    }
  }

  const messageMatch = remainder.match(/(?:message|nachricht|anliegen|request|details):\s*(.+)$/i)
  if (messageMatch?.[1]) {
    return normalizeWhitespace(messageMatch[1])
  }

  remainder = normalizeWhitespace(
    remainder
      .replace(/\b(?:please|bitte|i need|i want|ich brauche|ich möchte|appointment|termin|inquiry|anfrage)\b/gi, ' ')
      .replace(/\s+/g, ' '),
  )

  if (remainder.length >= 12) return remainder
  return undefined
}

export function parseInquiryFromText(text: string): ParsedInquiry {
  const trimmed = text.trim()
  if (!trimmed) return {}

  const email = extractEmail(trimmed)
  const phone = extractPhone(trimmed)
  const name = extractName(trimmed)
  const selectedService = extractService(trimmed)
  const preferredContactMethod = extractContactMethod(trimmed)
  const preferredDateTime = extractDateTime(trimmed)
  const appointmentRequest = /(appointment|termin|book a session|session|meeting|treffen|buchen)/i.test(
    trimmed,
  )

  const partial: ParsedInquiry = {
    email,
    phone,
    name,
    selectedService,
    preferredContactMethod,
    preferredDateTime,
    appointmentRequest,
  }

  const message = extractMessage(trimmed, partial) || (trimmed.length > 40 ? trimmed : undefined)

  return { ...partial, message }
}

export function countParsedFields(parsed: ParsedInquiry): number {
  return [
    parsed.name,
    parsed.email,
    parsed.phone,
    parsed.selectedService,
    parsed.message,
    parsed.preferredContactMethod,
    parsed.preferredDateTime,
  ].filter(Boolean).length
}

export function looksLikeBulkInquiry(text: string, parsed: ParsedInquiry): boolean {
  if (countParsedFields(parsed) >= 2) return true
  if (parsed.email && parsed.name) return true
  if (parsed.email && parsed.message) return true
  if (text.length > 80 && (parsed.email || parsed.selectedService)) return true
  return false
}

export type InquiryField = 'service' | 'name' | 'email' | 'phone' | 'contactMethod' | 'message'

export function getMissingInquiryFields(parsed: ParsedInquiry): InquiryField[] {
  const missing: InquiryField[] = []
  if (!parsed.selectedService) missing.push('service')
  if (!parsed.name) missing.push('name')
  if (!parsed.email) missing.push('email')
  if (!parsed.preferredContactMethod) missing.push('contactMethod')
  if (!parsed.message) missing.push('message')
  return missing
}

export function isInquiryReady(parsed: ParsedInquiry): boolean {
  return getMissingInquiryFields(parsed).length === 0
}
