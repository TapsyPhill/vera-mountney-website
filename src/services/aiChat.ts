import { aiConfig, isAIConfigured } from './aiConfig'
import { buildSystemPrompt } from './chatContext'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

async function callOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string,
  headers: Record<string, string> = {},
): Promise<string> {
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...headers,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 400,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

async function callOllama(systemPrompt: string, userMessage: string): Promise<string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (aiConfig.ollamaApiKey) {
    headers.Authorization = `Bearer ${aiConfig.ollamaApiKey}`
  }

  const response = await fetch(`${aiConfig.ollamaBaseUrl}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: aiConfig.ollamaModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`)
  }

  const data = await response.json()
  return data.message?.content?.trim() || ''
}

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${aiConfig.geminiApiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }],
        },
      ],
      generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
}

async function callAnthropic(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': aiConfig.anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic request failed: ${response.status}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text?.trim() || ''
}

export async function getAIResponse(
  userMessage: string,
  language: 'de' | 'en',
  history: ChatMessage[] = [],
): Promise<string | null> {
  if (!isAIConfigured()) return null

  const systemPrompt = buildSystemPrompt(language)
  const contextPrefix =
    history.length > 0
      ? history
          .slice(-4)
          .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
          .join('\n') + '\n\n'
      : ''
  const fullMessage = contextPrefix + userMessage

  try {
    switch (aiConfig.provider) {
      case 'openai':
        return await callOpenAICompatible(
          'https://api.openai.com',
          aiConfig.openaiApiKey,
          'gpt-4o-mini',
          systemPrompt,
          fullMessage,
        )
      case 'groq':
        return await callOpenAICompatible(
          'https://api.groq.com/openai',
          aiConfig.groqApiKey,
          aiConfig.groqModel,
          systemPrompt,
          fullMessage,
        )
      case 'ollama':
        return await callOllama(systemPrompt, fullMessage)
      case 'gemini':
        return await callGemini(systemPrompt, fullMessage)
      case 'anthropic':
        return await callAnthropic(systemPrompt, fullMessage)
      default:
        return null
    }
  } catch {
    return null
  }
}
