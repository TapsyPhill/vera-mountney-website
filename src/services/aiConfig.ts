export type AIProvider = 'local' | 'openai' | 'ollama' | 'gemini' | 'anthropic' | 'groq'

export const aiConfig = {
  enabled: import.meta.env.VITE_ENABLE_AI_CHAT === 'true',
  provider: (import.meta.env.VITE_AI_PROVIDER || 'local') as AIProvider,
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  ollamaBaseUrl: import.meta.env.VITE_OLLAMA_BASE_URL || 'http://localhost:11434',
  ollamaApiKey: import.meta.env.VITE_OLLAMA_API_KEY || '',
  ollamaModel: import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  anthropicApiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  groqModel: import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile',
} as const

export function isAIConfigured(): boolean {
  if (!aiConfig.enabled || aiConfig.provider === 'local') return false

  switch (aiConfig.provider) {
    case 'openai':
      return Boolean(aiConfig.openaiApiKey)
    case 'ollama':
      return Boolean(aiConfig.ollamaBaseUrl)
    case 'gemini':
      return Boolean(aiConfig.geminiApiKey)
    case 'anthropic':
      return Boolean(aiConfig.anthropicApiKey)
    case 'groq':
      return Boolean(aiConfig.groqApiKey)
    default:
      return false
  }
}
