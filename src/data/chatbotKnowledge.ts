export interface ChatbotEntry {
  id: string
  keywords: string[]
}

export const chatbotKnowledge: ChatbotEntry[] = [
  {
    id: 'whoIsVera',
    keywords: [
      'who is vera',
      'wer ist vera',
      'about vera',
      'über vera',
      'vera mountney',
    ],
  },
  {
    id: 'services',
    keywords: [
      'services',
      'leistungen',
      'angebot',
      'what do you offer',
      'was bietet',
    ],
  },
  {
    id: 'coaching',
    keywords: ['coaching', 'coach', 'training', 'trainer'],
  },
  {
    id: 'cvHelp',
    keywords: [
      'cv',
      'resume',
      'application',
      'bewerbung',
      'lebenslauf',
      'anschreiben',
    ],
  },
  {
    id: 'intercultural',
    keywords: [
      'intercultural',
      'interkulturell',
      'integration',
      'cultural',
    ],
  },
  {
    id: 'appointment',
    keywords: [
      'appointment',
      'termin',
      'book a session',
      'session',
      'meeting',
    ],
  },
  {
    id: 'contact',
    keywords: [
      'contact',
      'kontakt',
      'email',
      'phone',
      'telefon',
      'whatsapp',
      'reach',
    ],
  },
  {
    id: 'book',
    keywords: ['book', 'buch', 'buy', 'kaufen', 'nigeria', 'bats', 'fledermäuse'],
  },
  {
    id: 'languages',
    keywords: ['language', 'sprache', 'sprachen', 'speak', 'sprechen'],
  },
  {
    id: 'englishSite',
    keywords: ['english', 'englisch', 'german', 'deutsch', 'language switch'],
  },
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'hallo', 'guten tag', 'good morning'],
  },
  {
    id: 'thanks',
    keywords: ['thank', 'danke', 'thanks', 'vielen dank'],
  },
  {
    id: 'fallback',
    keywords: [],
  },
]
