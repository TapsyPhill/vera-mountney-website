import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { chatbotKnowledge } from '../data/chatbotKnowledge'
import { getAIResponse } from '../services/aiChat'
import { isAIConfigured } from '../services/aiConfig'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

function findLocalResponse(input: string, t: (key: string) => string): string | null {
  const normalized = input.toLowerCase().trim()
  if (!normalized) return null

  for (const entry of chatbotKnowledge) {
    if (entry.id === 'fallback') continue
    if (entry.keywords.some((kw) => normalized.includes(kw))) {
      return t(`chatbot.responses.${entry.id}`)
    }
  }

  return null
}

export function Chatbot() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const aiEnabled = isAIConfigured()
  const language = (i18n.language === 'en' ? 'en' : 'de') as 'de' | 'en'

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        text: t('chatbot.greeting'),
      },
    ])
  }, [language, t])

  const quickQuestions = useMemo(
    () => [
      t('faq.items.services.q'),
      t('faq.items.appointment.q'),
      t('faq.items.book.q'),
    ],
    [t],
  )

  const resolveResponse = async (text: string, history: Message[]): Promise<string> => {
    const local = findLocalResponse(text, t)
    if (local) return local

    if (aiEnabled) {
      const aiResponse = await getAIResponse(
        text,
        language,
        history.map((m) => ({ role: m.role, content: m.text })),
      )
      if (aiResponse) return aiResponse
    }

    return t('chatbot.responses.fallback')
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    const reply = await resolveResponse(trimmed, [...messages, userMsg])

    const assistantMsg: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: reply,
    }

    setMessages((prev) => [...prev, assistantMsg])
    setLoading(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed bottom-[5.5rem] right-5 z-50 flex w-[min(100vw-2.5rem,380px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-surface-dark-elevated shadow-2xl light:bg-white sm:bottom-[5.5rem]"
          role="dialog"
          aria-label={t('chatbot.title')}
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-brand-900/50 px-4 py-3 light:border-brand-200 light:bg-brand-50">
            <div>
              <p className="font-display text-lg font-semibold">{t('chatbot.title')}</p>
              <p className="text-xs text-brand-300 light:text-brand-600">
                {aiEnabled ? t('chatbot.subtitleAi') : t('chatbot.subtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-sm hover:bg-white/10"
              aria-label={t('chatbot.close')}
            >
              ✕
            </button>
          </div>

          <div className="flex max-h-72 flex-col gap-3 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto bg-brand-600 text-white'
                    : 'bg-white/10 light:bg-brand-50 light:text-brand-900'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-[85%] rounded-2xl bg-white/10 px-4 py-2.5 text-sm light:bg-brand-50">
                <span className="inline-flex gap-1">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse [animation-delay:150ms]">●</span>
                  <span className="animate-pulse [animation-delay:300ms]">●</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-2 light:border-brand-200">
            {quickQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="rounded-full border border-brand-400/30 px-3 py-1 text-xs transition hover:border-accent-400 disabled:opacity-50 light:text-brand-800"
              >
                {q.length > 40 ? `${q.slice(0, 40)}…` : q}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 p-3 light:border-brand-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent-400 disabled:opacity-50 light:border-brand-200 light:bg-white"
              aria-label={t('chatbot.placeholder')}
            />
            <button type="submit" disabled={loading} className="btn-primary !px-4 !py-2 !text-xs disabled:opacity-50">
              {t('chatbot.send')}
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 flex h-14 items-center gap-2 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 transition-all duration-300 hover:scale-105 hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
        aria-expanded={open}
        aria-label={open ? t('chatbot.close') : t('chatbot.open')}
      >
        <span className="text-lg">{aiEnabled ? '✨' : '💬'}</span>
        <span className="hidden sm:inline">{t('chatbot.title')}</span>
      </button>
    </>
  )
}
