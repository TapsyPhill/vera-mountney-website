import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
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

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M5 4h14a2 2 0 012 2v10a2 2 0 01-2 2H9l-4 3V6a2 2 0 012-2z" />
    </svg>
  )
}

export function Chatbot() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

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

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-x-4 bottom-20 z-50 flex max-h-[min(70vh,520px)] flex-col overflow-hidden rounded-2xl border border-accent-400/20 bg-surface-dark-elevated shadow-2xl shadow-brand-950/50 sm:inset-x-auto sm:right-5 sm:bottom-24 sm:w-[min(100vw-2.5rem,400px)] light:border-brand-300/60 light:bg-brand-50"
          role="dialog"
          aria-label={t('chatbot.title')}
        >
          <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-brand-900/80 to-brand-800/60 px-4 py-4 light:border-brand-200 light:from-brand-100 light:to-brand-50">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent-400/30 bg-brand-600/30 text-accent-400">
              <ChatIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-semibold leading-tight">{t('chatbot.title')}</p>
              <p className="truncate text-xs text-brand-300 light:text-brand-600">
                {aiEnabled ? t('chatbot.subtitleAi') : t('chatbot.subtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/10 light:border-brand-200 light:hover:bg-brand-100"
              aria-label={t('chatbot.close')}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto rounded-br-md bg-brand-600 text-white shadow-md shadow-brand-900/30'
                    : 'rounded-bl-md border border-white/10 bg-white/8 text-brand-100 light:border-brand-200/80 light:bg-white light:text-brand-900 light:shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-white/10 bg-white/8 px-4 py-3 light:border-brand-200 light:bg-white">
                <span className="inline-flex gap-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent-400" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent-400 [animation-delay:300ms]" />
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 bg-brand-950/30 p-3 light:border-brand-200 light:bg-brand-100/50"
          >
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder={t('chatbot.placeholder')}
                className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none transition focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/20 disabled:opacity-50 light:border-brand-300 light:bg-white light:text-brand-900"
                aria-label={t('chatbot.placeholder')}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-primary !h-11 !min-w-[4.5rem] !px-4 !py-2 !text-xs disabled:opacity-50"
              >
                {t('chatbot.send')}
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-4 z-50 flex h-14 items-center gap-2.5 rounded-full border border-accent-400/30 bg-brand-600 px-4 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 transition-all duration-300 hover:scale-105 hover:border-accent-400/50 hover:bg-brand-500 sm:right-5 sm:px-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
        aria-expanded={open}
        aria-label={open ? t('chatbot.close') : t('chatbot.open')}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-400/20 text-accent-300">
          <ChatIcon />
        </span>
        <span className="hidden xs:inline sm:inline">{t('chatbot.title')}</span>
      </button>
    </>
  )
}
