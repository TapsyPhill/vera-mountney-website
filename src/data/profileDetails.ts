export const languages = [
  'german',
  'english',
  'italian',
  'spanish',
  'portuguese',
  'french',
] as const

export const languageLevels: Record<(typeof languages)[number], 'native' | 'fluent' | 'basic'> = {
  german: 'native',
  english: 'fluent',
  italian: 'fluent',
  spanish: 'fluent',
  portuguese: 'basic',
  french: 'basic',
}

export const credentials = [
  'aevo',
  'systemicCoach',
  'communication',
  'bamf',
  'certifications',
  'biqEsf',
  'telc',
  'supervisor',
  'socialEngagement',
  'intercultural',
] as const

export const organizations = [
  'ebnBremen',
  'fmksKiel',
  'heartkids',
  'whoIsWho',
] as const

export const workedWith = [
  'focke',
  'mars',
  'marella',
  'olitra',
] as const

export const internationalExperience = [
  'italy',
  'spain',
  'southAfrica',
  'nigeria',
  'asia',
] as const

export const studies = ['linguistics', 'psychology', 'pedagogy'] as const
