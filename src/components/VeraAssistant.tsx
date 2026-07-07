import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getInquiryServiceLabel,
  inquiryServiceIds,
  type InquiryServiceId,
} from '../data/services'
import type { InquiryLanguage, PreferredContactMethod } from '../types/inquiry'
import { submitInquiry } from '../utils/submitInquiry'
import { getAssistantReply, wantsInquiry } from '../utils/assistantBrain'
import { DateTimePickerPanel } from './DateTimePicker'

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

type Mode = 'chat' | 'inquiry'
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

const selectClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-base outline-none focus:border-accent-400 sm:text-sm light:border-brand-300 light:bg-white light:text-brand-900'

export function VeraAssistant() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('chat')
  const [inquiryStep, setInquiryStep] = useState<InquiryStep>('service')
  const [draft, setDraft] = useState<InquiryDraft>(emptyDraft)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [servicePick, setServicePick] = useState('')
  const [contactPick, setContactPick] = useState<PreferredContactMethod | ''>('')
  const [dateTimePick, setDateTimePick] = useState('')
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
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: 'user', text }])
  }

  const resetAssistant = () => {
    setMode('chat')
    setInquiryStep('service')
    setDraft(emptyDraft())
    setInput('')
    setServicePick('')
    setContactPick('')
    setDateTimePick('')
    setMessages([{ id: 'welcome', role: 'assistant', text: t('assistant.greeting') }])
  }

  useEffect(() => {
    resetAssistant()
  }, [language, t])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, inquiryStep, mode])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const beginInquiry = () => {
    setMode('inquiry')
    setDraft(emptyDraft())
    setInquiryStep('service')
    appendAssistant(t('assistant.askService'))
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

    const serviceLabel =
      draft.selectedService === 'other'
        ? draft.otherService || t('inquiryServices.other')
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

    setInquiryStep('confirm')
    appendAssistant(t('assistant.errorSend'))
  }

  const advanceInquiry = (value: string) => {
    const trimmed = value.trim()

    switch (inquiryStep) {
      case 'name':
        if (!trimmed) return
        appendUser(trimmed)
        setDraft((d) => ({ ...d, name: trimmed }))
        appendAssistant(t('assistant.askEmail'))
        setInquiryStep('email')
        break
      case 'email':
        if (!trimmed || !trimmed.includes('@')) {
          appendAssistant(t('assistant.invalidEmail'))
          return
        }
        appendUser(trimmed)
        setDraft((d) => ({ ...d, email: trimmed }))
        appendAssistant(t('assistant.askPhone'))
        setInquiryStep('phone')
        break
      case 'phone':
        appendUser(trimmed || (language === 'de' ? 'Keine Angabe' : 'Not provided'))
        setDraft((d) => ({ ...d, phone: trimmed }))
        appendAssistant(t('assistant.askContactMethod'))
        setInquiryStep('contactMethod')
        break
      case 'preferredDateTime':
        appendUser(trimmed || (language === 'de' ? 'Keine Angabe' : 'Not provided'))
        setDraft((d) => ({ ...d, preferredDateTime: trimmed }))
        appendAssistant(t('assistant.askMessage'))
        setInquiryStep('message')
        break
      case 'message':
        if (!trimmed) return
        appendUser(trimmed)
        setDraft((d) => ({ ...d, message: trimmed }))
        appendAssistant(t('assistant.askAppointment'))
        setInquiryStep('appointment')
        break
      case 'appointment': {
        const yes = ['yes', 'ja', 'y', 'j'].includes(trimmed.toLowerCase())
        appendUser(trimmed)
        setDraft((d) => ({ ...d, appointmentRequest: yes }))
        appendAssistant(buildSummary())
        appendAssistant(t('assistant.confirmQuestion'))
        setInquiryStep('confirm')
        break
      }
      case 'otherService':
        if (!trimmed) return
        appendUser(trimmed)
        setDraft((d) => ({ ...d, otherService: trimmed }))
        appendAssistant(t('assistant.askName'))
        setInquiryStep('name')
        break
      default:
        break
    }

    setInput('')
  }

  const handleServiceSelect = (id: InquiryServiceId) => {
    setServicePick(id)
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

  const handleContactSelect = (method: PreferredContactMethod) => {
    setContactPick(method)
    appendUser(t(`contact.form.contactMethods.${method}`))
    setDraft((d) => ({ ...d, preferredContactMethod: method }))
    setDateTimePick('')
    appendAssistant(t('assistant.askPreferredDateTime'))
    setInquiryStep('preferredDateTime')
  }

  const handleDateTimeConfirm = (value: string) => {
    appendUser(value)
    setDraft((d) => ({ ...d, preferredDateTime: value }))
    appendAssistant(t('assistant.askMessage'))
    setInquiryStep('message')
  }

  const handleDateTimeSkip = () => {
    const skipLabel = language === 'de' ? 'Keine Angabe' : 'Not specified'
    appendUser(skipLabel)
    setDraft((d) => ({ ...d, preferredDateTime: '' }))
    appendAssistant(t('assistant.askMessage'))
    setInquiryStep('message')
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || inquiryStep === 'submitting') return

    if (mode === 'inquiry' && !['service', 'contactMethod', 'confirm', 'done'].includes(inquiryStep)) {
      advanceInquiry(trimmed)
      return
    }

    appendUser(trimmed)

    if (mode === 'chat') {
      if (wantsInquiry(trimmed)) {
        beginInquiry()
      } else {
        appendAssistant(getAssistantReply(trimmed, t))
      }
    }

    setInput('')
  }

  const showTextInput =
    mode === 'chat' ||
    (mode === 'inquiry' &&
      !['service', 'contactMethod', 'preferredDateTime', 'confirm', 'submitting', 'done'].includes(
        inquiryStep
      ))

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col overflow-hidden border-accent-400/20 bg-surface-dark-elevated sm:inset-x-auto sm:inset-y-auto sm:right-5 sm:bottom-24 sm:top-auto sm:h-auto sm:max-h-[min(82dvh,620px)] sm:w-[min(100vw-2.5rem,400px)] sm:rounded-2xl sm:border light:border-brand-300/60 light:bg-brand-100"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
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

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-base leading-relaxed sm:text-sm ${
                  msg.role === 'user'
                    ? 'ml-auto rounded-br-md bg-brand-600 text-white shadow-md shadow-brand-900/30'
                    : 'rounded-bl-md border border-white/10 bg-white/8 text-brand-100 light:border-brand-200/80 light:bg-white light:text-brand-900'
                }`}
              >
                {msg.text}
              </div>
            ))}

            {mode === 'inquiry' && inquiryStep === 'service' && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 light:border-brand-200 light:bg-white">
                <label htmlFor="assistant-service" className="mb-2 block text-xs font-medium light:text-brand-800">
                  {t('contact.form.service')}
                </label>
                <select
                  id="assistant-service"
                  value={servicePick}
                  onChange={(e) => handleServiceSelect(e.target.value as InquiryServiceId)}
                  className={selectClass}
                >
                  <option value="">{t('contact.form.servicePlaceholder')}</option>
                  {inquiryServiceIds.map((id) => (
                    <option key={id} value={id}>
                      {getInquiryServiceLabel(id, t)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {mode === 'inquiry' && inquiryStep === 'contactMethod' && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 light:border-brand-200 light:bg-white">
                <label htmlFor="assistant-contact" className="mb-2 block text-xs font-medium light:text-brand-800">
                  {t('contact.form.contactMethod')}
                </label>
                <select
                  id="assistant-contact"
                  value={contactPick}
                  onChange={(e) => handleContactSelect(e.target.value as PreferredContactMethod)}
                  className={selectClass}
                >
                  <option value="">{t('contact.form.servicePlaceholder')}</option>
                  {contactMethods.map((method) => (
                    <option key={method} value={method}>
                      {t(`contact.form.contactMethods.${method}`)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {mode === 'inquiry' && inquiryStep === 'preferredDateTime' && (
              <DateTimePickerPanel
                value={dateTimePick}
                onChange={setDateTimePick}
                onConfirm={handleDateTimeConfirm}
                onSkip={handleDateTimeSkip}
              />
            )}

            {mode === 'inquiry' && inquiryStep === 'confirm' && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={submitInquiryRequest}
                  className="btn-primary min-h-[44px] !px-4 !py-2.5 !text-xs"
                >
                  {t('assistant.sendRequest')}
                </button>
                <button
                  type="button"
                  onClick={resetAssistant}
                  className="btn-secondary min-h-[44px] !px-4 !py-2.5 !text-xs"
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

            <div ref={messagesEndRef} />
          </div>

          {showTextInput && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="border-t border-white/10 bg-brand-950/30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] light:border-brand-200 light:bg-brand-200/50"
            >
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={inquiryStep === 'submitting'}
                  placeholder={t('chatbot.placeholder')}
                  className="max-h-28 min-h-[48px] flex-1 resize-none rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-base outline-none transition focus:border-accent-400/60 disabled:opacity-50 sm:text-sm light:border-brand-300 light:bg-white light:text-brand-900"
                  aria-label={t('chatbot.placeholder')}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || inquiryStep === 'submitting'}
                  className="btn-primary !h-11 !min-h-[44px] !min-w-[4.5rem] shrink-0 !px-4 !py-2 !text-xs disabled:opacity-50"
                >
                  {t('chatbot.send')}
                </button>
              </div>
            </form>
          )}

          {mode === 'inquiry' && inquiryStep === 'done' && (
            <div className="border-t border-white/10 p-3 light:border-brand-200">
              <button type="button" onClick={resetAssistant} className="btn-secondary w-full !py-2 !text-xs">
                {t('assistant.newRequest')}
              </button>
            </div>
          )}
        </div>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-50 flex h-14 min-h-[56px] items-center gap-2 rounded-full border border-accent-400/30 bg-brand-600 pl-3 pr-4 text-sm font-semibold text-white shadow-lg shadow-brand-900/40 transition-all duration-300 hover:scale-105 hover:border-accent-400/50 hover:bg-brand-500 sm:right-5 sm:pl-4 sm:pr-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 right-3 bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))]"
          aria-expanded={false}
          aria-label={t('chatbot.open')}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-400/20 text-accent-300">
            <ChatIcon />
          </span>
          <span className="hidden sm:inline">{t('chatbot.title')}</span>
        </button>
      )}
    </>
  )
}
