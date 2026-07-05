import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { chatbotKnowledge } from '../data/chatbotKnowledge'
import {
  getInquiryServiceLabel,
  inquiryServiceIds,
  type InquiryServiceId,
} from '../data/services'
import type { InquiryLanguage, PreferredContactMethod } from '../types/inquiry'
import { submitInquiry } from '../utils/submitInquiry'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
}

interface InquiryDraft {
  selectedService: InquiryServiceId | ''
  otherService: string
  name: string
  email: string
  phone: string
  preferredContactMethod: PreferredContactMethod | ''
  preferredDateTime: string
  message: string
  appointmentRequest: boolean
}

type Mode = 'menu' | 'chat' | 'inquiry'
type InquiryStep =
  | 'service'
  | 'otherService'
  | 'name'
  | 'email'
  | 'phone'
  | 'contactMethod'
  | 'preferredDateTime'
  | 'message'
  | 'appointment'
  | 'confirm'
  | 'submitting'
  | 'done'

const emptyDraft = (): InquiryDraft => ({
  selectedService: '',
  otherService: '',
  name: '',
  email: '',
  phone: '',
  preferredContactMethod: '',
  preferredDateTime: '',
  message: '',
  appointmentRequest: false,
})

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

export function VeraAssistant() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('menu')
  const [inquiryStep, setInquiryStep] = useState<InquiryStep>('service')
  const [draft, setDraft] = useState<InquiryDraft>(emptyDraft)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [submitError, setSubmitError] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const language = (i18n.language === 'en' ? 'en' : 'de') as InquiryLanguage
  const contactMethods: PreferredContactMethod[] = ['email', 'phone', 'whatsapp', 'noPreference']

  const appendAssistant = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `assistant-${Date.now()}-${Math.random()}`, role: 'assistant', text },
    ])
  }

  const appendUser = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', text },
    ])
  }

  const resetAssistant = () => {
    setMode('menu')
    setInquiryStep('service')
    setDraft(emptyDraft())
    setInput('')
    setSubmitError(false)
    setMessages([{ id: 'welcome', role: 'assistant', text: t('assistant.greeting') }])
  }

  useEffect(() => {
    resetAssistant()
  }, [language, t])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, inquiryStep, mode])

  const startInquiry = (service?: InquiryServiceId) => {
    setMode('inquiry')
    setDraft({ ...emptyDraft(), selectedService: service || '' })
    appendAssistant(t('assistant.inquiryIntro'))
    if (!service) {
      appendAssistant(t('assistant.askService'))
      setInquiryStep('service')
    } else if (service === 'other') {
      appendAssistant(t('assistant.askOtherService'))
      setInquiryStep('otherService')
    } else {
      appendAssistant(t('assistant.askName'))
      setInquiryStep('name')
    }
  }

  const buildSummary = () => {
    const serviceLabel =
      draft.selectedService === 'other'
        ? draft.otherService
        : draft.selectedService
          ? getInquiryServiceLabel(draft.selectedService, t)
          : '-'

    return [
      t('assistant.summaryTitle'),
      '',
      `${t('contact.form.name')}: ${draft.name}`,
      `${t('contact.form.email')}: ${draft.email}`,
      `${t('contact.form.phone')}: ${draft.phone || '-'}`,
      `${t('contact.form.contactMethod')}: ${
        draft.preferredContactMethod
          ? t(`contact.form.contactMethods.${draft.preferredContactMethod}`)
          : '-'
      }`,
      `${t('contact.form.service')}: ${serviceLabel}`,
      `${t('contact.form.preferredDateTime')}: ${draft.preferredDateTime || '-'}`,
      `${t('contact.form.message')}: ${draft.message}`,
      `${t('contact.form.appointment')}: ${draft.appointmentRequest ? (language === 'de' ? 'Ja' : 'Yes') : language === 'de' ? 'Nein' : 'No'}`,
    ].join('\n')
  }

  const submitInquiryRequest = async () => {
    setInquiryStep('submitting')
    setSubmitError(false)

    const serviceLabel =
      draft.selectedService === 'other'
        ? t('inquiryServices.other')
        : getInquiryServiceLabel(draft.selectedService as InquiryServiceId, t)

    const result = await submitInquiry({
      name: draft.name,
      email: draft.email,
      phone: draft.phone || undefined,
      preferredContactMethod: draft.preferredContactMethod,
      selectedService: serviceLabel,
      otherService: draft.otherService || undefined,
      preferredDateTime: draft.preferredDateTime || undefined,
      message: draft.message,
      appointmentRequest: draft.appointmentRequest,
      language,
      source: 'vera_assistant',
    })

    if (result.success) {
      setInquiryStep('done')
      const isPhone =
        draft.preferredContactMethod === 'phone' || draft.preferredContactMethod === 'whatsapp'
      appendAssistant(isPhone ? t('assistant.successPhone') : t('assistant.success'))
      return
    }

    setSubmitError(true)
    setInquiryStep('confirm')
    appendAssistant(t('assistant.errorSend'))
  }

  const advanceInquiry = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed && inquiryStep !== 'preferredDateTime') return

    appendUser(trimmed || (language === 'de' ? 'Überspringen' : 'Skip'))

    switch (inquiryStep) {
      case 'service': {
        const match = inquiryServiceIds.find(
          (id) => getInquiryServiceLabel(id, t).toLowerCase() === trimmed.toLowerCase(),
        )
        const serviceId = (match || trimmed) as InquiryServiceId
        setDraft((d) => ({ ...d, selectedService: serviceId }))
        if (serviceId === 'other') {
          appendAssistant(t('assistant.askOtherService'))
          setInquiryStep('otherService')
        } else {
          appendAssistant(t('assistant.askName'))
          setInquiryStep('name')
        }
        break
      }
      case 'otherService':
        setDraft((d) => ({ ...d, otherService: trimmed }))
        appendAssistant(t('assistant.askName'))
        setInquiryStep('name')
        break
      case 'name':
        setDraft((d) => ({ ...d, name: trimmed }))
        appendAssistant(t('assistant.askEmail'))
        setInquiryStep('email')
        break
      case 'email':
        setDraft((d) => ({ ...d, email: trimmed }))
        appendAssistant(t('assistant.askPhone'))
        setInquiryStep('phone')
        break
      case 'phone':
        setDraft((d) => ({ ...d, phone: trimmed }))
        appendAssistant(t('assistant.askContactMethod'))
        setInquiryStep('contactMethod')
        break
      case 'contactMethod': {
        const method = contactMethods.find(
          (m) => t(`contact.form.contactMethods.${m}`).toLowerCase() === trimmed.toLowerCase(),
        )
        if (!method) {
          appendAssistant(t('assistant.invalidContactMethod'))
          return
        }
        setDraft((d) => ({ ...d, preferredContactMethod: method }))
        appendAssistant(t('assistant.askPreferredDateTime'))
        setInquiryStep('preferredDateTime')
        break
      }
      case 'preferredDateTime':
        setDraft((d) => ({ ...d, preferredDateTime: trimmed }))
        appendAssistant(t('assistant.askMessage'))
        setInquiryStep('message')
        break
      case 'message':
        setDraft((d) => ({ ...d, message: trimmed }))
        appendAssistant(t('assistant.askAppointment'))
        setInquiryStep('appointment')
        break
      case 'appointment': {
        const yes = ['yes', 'ja', 'y', 'j'].includes(trimmed.toLowerCase())
        setDraft((d) => ({ ...d, appointmentRequest: yes }))
        appendAssistant(buildSummary())
        appendAssistant(t('assistant.confirmQuestion'))
        setInquiryStep('confirm')
        break
      }
      default:
        break
    }

    setInput('')
  }

  const handleFreeText = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    if (mode === 'inquiry' && inquiryStep !== 'confirm' && inquiryStep !== 'submitting' && inquiryStep !== 'done') {
      advanceInquiry(trimmed)
      return
    }

    if (mode === 'chat' || mode === 'menu') {
      appendUser(trimmed)
      const reply = findLocalResponse(trimmed, t) || t('chatbot.responses.fallback')
      appendAssistant(reply)
      setInput('')
    }
  }

  const handleServicePick = (id: InquiryServiceId) => {
    appendUser(getInquiryServiceLabel(id, t))
    setDraft((d) => ({ ...d, selectedService: id }))
    if (id === 'other') {
      appendAssistant(t('assistant.askOtherService'))
      setInquiryStep('otherService')
    } else {
      appendAssistant(t('assistant.askName'))
      setInquiryStep('name')
    }
  }

  const handleContactMethodPick = (method: PreferredContactMethod) => {
    appendUser(t(`contact.form.contactMethods.${method}`))
    setDraft((d) => ({ ...d, preferredContactMethod: method }))
    appendAssistant(t('assistant.askPreferredDateTime'))
    setInquiryStep('preferredDateTime')
  }

  const menuOptions: { labelKey: string; action: () => void }[] = [
    { labelKey: 'assistant.menu.cv', action: () => startInquiry('applicationHelp') },
    { labelKey: 'assistant.menu.career', action: () => startInquiry('careerCoaching') },
    { labelKey: 'assistant.menu.germanTest', action: () => startInquiry('germanTest') },
    { labelKey: 'assistant.menu.intercultural', action: () => startInquiry('intercultural') },
    {
      labelKey: 'assistant.menu.book',
      action: () => {
        setMode('chat')
        appendAssistant(t('chatbot.responses.book'))
      },
    },
    { labelKey: 'assistant.menu.appointment', action: () => startInquiry() },
    { labelKey: 'assistant.menu.other', action: () => startInquiry('other') },
  ]

  const showTextInput =
    mode === 'chat' ||
    (mode === 'inquiry' &&
      !['service', 'contactMethod', 'confirm', 'submitting', 'done'].includes(inquiryStep))

  return (
    <>
      {open && (
        <div
          className="fixed inset-x-4 bottom-20 z-50 flex max-h-[min(75vh,560px)] flex-col overflow-hidden rounded-2xl border border-accent-400/20 bg-surface-dark-elevated shadow-2xl shadow-brand-950/50 sm:inset-x-auto sm:right-5 sm:bottom-24 sm:w-[min(100vw-2.5rem,420px)] light:border-brand-300/60 light:bg-brand-100"
          role="dialog"
          aria-label={t('chatbot.title')}
        >
          <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-brand-900/80 to-brand-800/60 px-4 py-4 light:border-brand-200 light:from-brand-200/80 light:to-brand-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent-400/30 bg-brand-600/30 text-accent-400">
              <ChatIcon />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-semibold leading-tight light:text-brand-950">
                {t('chatbot.title')}
              </p>
              <p className="truncate text-xs text-brand-300 light:text-brand-700">
                {t('assistant.subtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/10 light:border-brand-300 light:hover:bg-brand-200"
              aria-label={t('chatbot.close')}
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto rounded-br-md bg-brand-600 text-white shadow-md shadow-brand-900/30'
                    : 'rounded-bl-md border border-white/10 bg-white/8 text-brand-100 light:border-brand-200/80 light:bg-white light:text-brand-900'
                }`}
              >
                {msg.text}
              </div>
            ))}

            {mode === 'menu' && messages.length <= 1 && (
              <div className="flex flex-col gap-2 pt-1">
                {menuOptions.map((opt) => (
                  <button
                    key={opt.labelKey}
                    type="button"
                    onClick={opt.action}
                    className="rounded-xl border border-brand-400/25 bg-white/5 px-3 py-2.5 text-left text-sm transition hover:border-accent-400/40 hover:bg-white/10 light:border-brand-300 light:bg-white/80 light:text-brand-900 light:hover:border-accent-400/50"
                  >
                    {t(opt.labelKey)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setMode('chat')
                    appendAssistant(t('assistant.freeChatHint'))
                  }}
                  className="text-xs text-accent-glow underline-offset-2 hover:underline"
                >
                  {t('assistant.freeChatLink')}
                </button>
              </div>
            )}

            {mode === 'inquiry' && inquiryStep === 'service' && (
              <div className="flex flex-wrap gap-2">
                {inquiryServiceIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleServicePick(id)}
                    className="rounded-full border border-brand-400/30 px-3 py-1.5 text-xs transition hover:border-accent-400 light:border-brand-300 light:bg-white/80 light:text-brand-900"
                  >
                    {getInquiryServiceLabel(id, t)}
                  </button>
                ))}
              </div>
            )}

            {mode === 'inquiry' && inquiryStep === 'contactMethod' && (
              <div className="flex flex-wrap gap-2">
                {contactMethods.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => handleContactMethodPick(method)}
                    className="rounded-full border border-brand-400/30 px-3 py-1.5 text-xs transition hover:border-accent-400 light:border-brand-300 light:bg-white/80 light:text-brand-900"
                  >
                    {t(`contact.form.contactMethods.${method}`)}
                  </button>
                ))}
              </div>
            )}

            {mode === 'inquiry' && inquiryStep === 'preferredDateTime' && (
              <button
                type="button"
                onClick={() => advanceInquiry('')}
                className="self-start rounded-full border border-brand-400/30 px-3 py-1.5 text-xs light:border-brand-300 light:bg-white/80"
              >
                {t('assistant.skip')}
              </button>
            )}

            {mode === 'inquiry' && inquiryStep === 'appointment' && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => advanceInquiry(language === 'de' ? 'Ja' : 'Yes')}
                  className="rounded-full border border-brand-400/30 px-4 py-1.5 text-xs light:border-brand-300 light:bg-white/80"
                >
                  {language === 'de' ? 'Ja' : 'Yes'}
                </button>
                <button
                  type="button"
                  onClick={() => advanceInquiry(language === 'de' ? 'Nein' : 'No')}
                  className="rounded-full border border-brand-400/30 px-4 py-1.5 text-xs light:border-brand-300 light:bg-white/80"
                >
                  {language === 'de' ? 'Nein' : 'No'}
                </button>
              </div>
            )}

            {mode === 'inquiry' && inquiryStep === 'confirm' && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={submitInquiryRequest}
                  className="btn-primary !px-4 !py-2 !text-xs"
                >
                  {t('assistant.sendRequest')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInquiryStep('name')
                    appendAssistant(t('assistant.askName'))
                  }}
                  className="btn-secondary !px-4 !py-2 !text-xs"
                >
                  {t('assistant.editDetails')}
                </button>
                <button
                  type="button"
                  onClick={resetAssistant}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs light:border-brand-300"
                >
                  {t('assistant.cancel')}
                </button>
              </div>
            )}

            {inquiryStep === 'submitting' && (
              <div className="inline-flex gap-1.5 px-2 py-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent-400" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-accent-400 [animation-delay:300ms]" />
              </div>
            )}

            {submitError && inquiryStep === 'confirm' && (
              <p className="text-xs text-red-400 light:text-red-700">{t('assistant.errorSend')}</p>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showTextInput && inquiryStep !== 'done' && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleFreeText()
              }}
              className="border-t border-white/10 bg-brand-950/30 p-3 light:border-brand-200 light:bg-brand-200/50"
            >
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={inquiryStep === 'submitting'}
                  placeholder={t('chatbot.placeholder')}
                  className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm outline-none transition focus:border-accent-400/60 disabled:opacity-50 light:border-brand-300 light:bg-white light:text-brand-900"
                  aria-label={t('chatbot.placeholder')}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || inquiryStep === 'submitting'}
                  className="btn-primary !h-11 !min-w-[4.5rem] !px-4 !py-2 !text-xs disabled:opacity-50"
                >
                  {t('chatbot.send')}
                </button>
              </div>
            </form>
          )}

          {(mode === 'inquiry' && inquiryStep === 'done') && (
            <div className="border-t border-white/10 p-3 light:border-brand-200">
              <button type="button" onClick={resetAssistant} className="btn-secondary w-full !py-2 !text-xs">
                {t('assistant.newRequest')}
              </button>
            </div>
          )}
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
        <span className="hidden sm:inline">{t('chatbot.title')}</span>
      </button>
    </>
  )
}
