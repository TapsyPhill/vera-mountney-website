import { useMemo, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { chatbotKnowledge } from '../data/chatbotKnowledge'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

function findResponse(input: string, t: (key: string) => string): string {
  const normalized = input.toLowerCase().trim()
  if (!normalized) return t('chatbot.responses.fallback')

  for (const entry of chatbotKnowledge) {
    if (entry.id === 'fallback') continue
    if (entry.keywords.some((kw) => normalized.includes(kw))) {
      return t(`chatbot.responses.${entry.id}`)
    }
  }

  return t('chatbot.responses.fallback')
}

export function Chatbot() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      text: t('chatbot.greeting'),
    },
  ])

  const quickQuestions = useMemo(
    () => [
      t('faq.items.services.q'),
      t('faq.items.appointment.q'),
      t('faq.items.book.q'),
    ],
    [t],
  )

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    }
    const assistantMsg: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: findResponse(trimmed, t),
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
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
          className="fixed bottom-36 right-5 z-50 flex w-[min(100vw-2.5rem,380px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-surface-dark-elevated shadow-2xl light:bg-white sm:bottom-24"
          role="dialog"
          aria-label={t('chatbot.title')}
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-brand-900/50 px-4 py-3 light:border-brand-200 light:bg-brand-50">
            <div>
              <p className="font-display text-lg font-semibold">{t('chatbot.title')}</p>
              <p className="text-xs text-brand-300 light:text-brand-600">
                {t('chatbot.subtitle')}
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
          </div>

          <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-2 light:border-brand-200">
            {quickQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="rounded-full border border-brand-400/30 px-3 py-1 text-xs transition hover:border-accent-400 light:text-brand-800"
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
              placeholder={t('chatbot.placeholder')}
              className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none focus:border-accent-400 light:border-brand-200 light:bg-white"
              aria-label={t('chatbot.placeholder')}
            />
            <button type="submit" className="btn-primary !px-4 !py-2 !text-xs">
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
        <span className="text-lg">🤖</span>
        <span className="hidden sm:inline">{t('chatbot.title')}</span>
      </button>
    </>
  )
}
