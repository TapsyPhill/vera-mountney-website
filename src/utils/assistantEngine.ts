import { chatbotKnowledge } from '../data/chatbotKnowledge'

type Language = 'de' | 'en'

interface ScoredMatch {
  id: string
  score: number
}

const offTopicPatterns = [
  /\b(weather|wetter|rain|regen)\b/i,
  /\b(pizza|recipe|rezept|football|fußball|soccer)\b/i,
  /\b(bitcoin|crypto|stock|aktie|politics|politik)\b/i,
  /\b(who are you|who made you|chatgpt|gpt|ai bot|robot)\b/i,
  /\b(wer bist du|bist du ki|künstliche intelligenz)\b/i,
]

const unclearPatterns = [
  /^[\?\!\.]+$/,
  /^(hi+|hey+|hallo+|ok+|okay+|hm+|hmm+|na+|yo+)$/i,
  /^.{1,2}$/,
]

const inquiryHints = [
  'appointment',
  'termin',
  'anfrage',
  'inquiry',
  'contact',
  'kontakt',
  'send',
  'schicken',
  'request',
  'buchen',
  'book a session',
  'anmelden',
  'schreiben',
  'message',
  'nachricht',
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\säöüß]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text: string): string[] {
  return normalize(text).split(' ').filter(Boolean)
}

export function wantsInquiry(text: string): boolean {
  const n = normalize(text)
  return inquiryHints.some((kw) => n.includes(normalize(kw)))
}

function scoreEntry(input: string, tokens: string[], keywords: string[]): number {
  const normalizedInput = normalize(input)
  let score = 0

  for (const keyword of keywords) {
    const normalizedKeyword = normalize(keyword)
    if (!normalizedKeyword) continue

    if (normalizedInput === normalizedKeyword) {
      score += 12
      continue
    }

    if (normalizedInput.includes(normalizedKeyword)) {
      score += normalizedKeyword.length >= 8 ? 10 : 7
      continue
    }

    const keywordTokens = normalizedKeyword.split(' ')
    if (keywordTokens.length > 1 && keywordTokens.every((part) => normalizedInput.includes(part))) {
      score += 8
      continue
    }

    for (const token of tokens) {
      if (token === normalizedKeyword) score += 6
      else if (token.length >= 4 && normalizedKeyword.includes(token)) score += 3
      else if (normalizedKeyword.length >= 4 && token.includes(normalizedKeyword)) score += 2
    }
  }

  return score
}

function findBestMatch(input: string): ScoredMatch | null {
  const tokens = tokenize(input)
  if (tokens.length === 0) return null

  let best: ScoredMatch | null = null

  for (const entry of chatbotKnowledge) {
    if (entry.id === 'fallback') continue
    const score = scoreEntry(input, tokens, entry.keywords)
    if (score <= 0) continue
    if (!best || score > best.score) {
      best = { id: entry.id, score }
    }
  }

  if (!best || best.score < 4) return null
  return best
}

function isOffTopic(input: string): boolean {
  return offTopicPatterns.some((pattern) => pattern.test(input))
}

function isUnclear(input: string): boolean {
  const trimmed = input.trim()
  return unclearPatterns.some((pattern) => pattern.test(trimmed))
}

export interface AssistantReply {
  text: string
  topicId: string | null
}

export function getAssistantReply(
  input: string,
  _language: Language,
  t: (key: string) => string,
): AssistantReply {
  const trimmed = input.trim()
  if (!trimmed) {
    return { text: t('assistant.emptyInput'), topicId: 'unclear' }
  }

  if (wantsInquiry(trimmed)) {
    return { text: t('assistant.inquiryIntro'), topicId: 'appointment' }
  }

  const match = findBestMatch(trimmed)
  if (match) {
    return { text: t(`chatbot.responses.${match.id}`), topicId: match.id }
  }

  if (isOffTopic(trimmed)) {
    return { text: t('assistant.offTopic'), topicId: 'offTopic' }
  }

  if (isUnclear(trimmed)) {
    return { text: t('assistant.unclear'), topicId: 'unclear' }
  }

  return { text: t('assistant.gentleFallback'), topicId: 'fallback' }
}

export function detectTopicId(input: string): string | null {
  const match = findBestMatch(input.trim())
  return match?.id ?? null
}

export function buildConversationHistory(
  messages: Array<{ role: 'user' | 'assistant'; text: string }>,
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages.slice(-8).map((message) => ({
    role: message.role,
    content: message.text,
  }))
}
