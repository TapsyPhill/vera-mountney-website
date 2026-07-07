import { chatbotKnowledge } from '../data/chatbotKnowledge'

const inquiryKeywords = [
  'appointment',
  'termin',
  'anfrage',
  'inquiry',
  'contact',
  'kontakt',
  'send',
  'schicken',
  'request',
  'anmelden',
  'buchen',
  'book a session',
  'senden',
  'absenden',
  'nachricht senden',
  'get in touch',
  'reach out',
  'melden',
  'rückruf',
  'callback',
  'call me',
]

const offTopicKeywords = [
  'weather',
  'wetter',
  'football',
  'soccer',
  'recipe',
  'rezept',
  'joke',
  'witz',
  'bitcoin',
  'crypto',
  'movie',
  'film',
  'netflix',
  'game',
  'pizza',
  'restaurant',
  'news',
  'nachrichten',
  'politics',
  'politik',
  'who is president',
  'wer ist präsident',
  'chatgpt',
  'openai',
  'write me a',
  'schreib mir',
]

export function normalizeInput(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
}

export function wantsInquiry(text: string): boolean {
  const n = normalizeInput(text)
  return inquiryKeywords.some((kw) => n.includes(kw))
}

export function isOffTopic(text: string): boolean {
  const n = normalizeInput(text)
  return offTopicKeywords.some((kw) => n.includes(kw))
}

export function isUnclear(text: string): boolean {
  const n = normalizeInput(text)
  if (n.length < 2) return true
  const words = n.split(' ').filter(Boolean)
  if (words.length === 1 && words[0].length < 4) return true
  return false
}

function scoreTopic(input: string, keywords: string[]): number {
  const n = normalizeInput(input)
  let score = 0

  for (const keyword of keywords) {
    const normalizedKeyword = normalizeInput(keyword)
    if (normalizedKeyword && n.includes(normalizedKeyword)) {
      score += normalizedKeyword.split(' ').length
    }
  }

  return score
}

export function findBestTopic(input: string): string | null {
  let best: { id: string; score: number } | null = null

  for (const entry of chatbotKnowledge) {
    if (entry.id === 'fallback' || entry.id === 'offTopic' || entry.id === 'unclear') {
      continue
    }

    const score = scoreTopic(input, entry.keywords)
    if (score > 0 && (!best || score > best.score)) {
      best = { id: entry.id, score }
    }
  }

  return best && best.score >= 1 ? best.id : null
}

export function getAssistantReply(
  input: string,
  t: (key: string) => string,
): string {
  const trimmed = input.trim()
  if (!trimmed) {
    return t('chatbot.responses.unclear')
  }

  if (isUnclear(trimmed)) {
    return t('chatbot.responses.unclear')
  }

  if (isOffTopic(trimmed)) {
    return t('chatbot.responses.offTopic')
  }

  const topic = findBestTopic(trimmed)
  if (topic) {
    return t(`chatbot.responses.${topic}`)
  }

  return t('chatbot.responses.conversational')
}
