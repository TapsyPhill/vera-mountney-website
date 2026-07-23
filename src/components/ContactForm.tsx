import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { DateTimePicker } from './DateTimePicker'
import { inquiryServiceIds, getInquiryServiceLabel } from '../data/services'
import type { InquiryLanguage, PreferredContactMethod } from '../types/inquiry'
import { submitInquiry } from '../utils/submitInquiry'

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

const inputClass =
  'w-full min-h-[48px] rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base outline-none transition focus:border-accent-400 sm:text-sm light:border-brand-300 light:bg-white light:text-brand-900'

export function ContactForm() {
  const { t, i18n } = useTranslation()
  const [status, setStatus] = useState<FormStatus>('idle')
  const [selectedService, setSelectedService] = useState('')
  const [preferredContactMethod, setPreferredContactMethod] = useState<PreferredContactMethod>('email')
  const [appointmentRequest, setAppointmentRequest] = useState(false)
  const [preferredDateTime, setPreferredDateTime] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const language = (i18n.language === 'en' ? 'en' : 'de') as InquiryLanguage
  const showOtherService = selectedService === 'other'

  const contactMethods: PreferredContactMethod[] = ['email', 'phone', 'whatsapp', 'noPreference']

  const successMessage =
    preferredContactMethod === 'phone' || preferredContactMethod === 'whatsapp'
      ? t('contact.form.successPhone')
      : t('contact.form.success')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'loading') return

    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const message = String(data.get('message') || '').trim()
    const subject = String(data.get('subject') || '').trim()
    const address = String(data.get('address') || '').trim()
    const preferredDateTime = String(data.get('preferredDateTime') || '').trim()
    const otherService = String(data.get('otherService') || '').trim()

    if (!name || !email || !message || !selectedService || !preferredContactMethod) {
      setStatus('error')
      return
    }

    if (selectedService === 'other' && !otherService) {
      setStatus('error')
      return
    }

    setStatus('loading')

    const result = await submitInquiry({
      name,
      email,
      phone: phone || undefined,
      preferredContactMethod,
      selectedService: getInquiryServiceLabel(selectedService as (typeof inquiryServiceIds)[number], t),
      otherService: otherService || undefined,
      preferredDateTime: preferredDateTime || undefined,
      address: address || undefined,
      subject: subject || undefined,
      message,
      appointmentRequest,
      language,
      source: 'contact_form',
      botcheck: honeypot,
    })

    if (result.success) {
      setStatus('success')
      form.reset()
      setSelectedService('')
      setPreferredContactMethod('email')
      setPreferredDateTime('')
      setAppointmentRequest(false)
      return
    }

    setStatus('error')
  }

  return (
    <form onSubmit={handleSubmit} className="relative min-w-0 max-w-full overflow-hidden glass-card space-y-4 p-4 sm:space-y-5 sm:p-8" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="botcheck">Leave empty</label>
        <input
          id="botcheck"
          name="botcheck"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            {t('contact.form.name')} *
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            {t('contact.form.email')} *
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            {t('contact.form.phone')}
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="contactMethod" className="mb-1.5 block text-sm font-medium">
            {t('contact.form.contactMethod')} *
          </label>
          <select
            id="contactMethod"
            name="contactMethod"
            required
            value={preferredContactMethod}
            onChange={(e) => setPreferredContactMethod(e.target.value as PreferredContactMethod)}
            className={inputClass}
          >
            {contactMethods.map((method) => (
              <option key={method} value={method}>
                {t(`contact.form.contactMethods.${method}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="selectedService" className="mb-1.5 block text-sm font-medium">
          {t('contact.form.service')} *
        </label>
        <select
          id="selectedService"
          name="selectedService"
          required
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className={inputClass}
        >
          <option value="">{t('contact.form.servicePlaceholder')}</option>
          {inquiryServiceIds.map((id) => (
            <option key={id} value={id}>
              {getInquiryServiceLabel(id, t)}
            </option>
          ))}
        </select>
      </div>

      {showOtherService && (
        <div>
          <label htmlFor="otherService" className="mb-1.5 block text-sm font-medium">
            {t('contact.form.otherService')} *
          </label>
          <input id="otherService" name="otherService" type="text" required className={inputClass} />
        </div>
      )}

      <div className="min-w-0">
        <label className="mb-1.5 block text-sm font-medium">
          {t('contact.form.preferredDateTime')}
        </label>
        <DateTimePicker
          id="preferredDateTime"
          name="preferredDateTime"
          value={preferredDateTime}
          onChange={setPreferredDateTime}
        />
        <p className="mt-1.5 break-words text-xs leading-relaxed text-brand-400 light:text-brand-600">
          {t('contact.form.preferredDateTimeNote')}
        </p>
      </div>

      <div>
        <label htmlFor="address" className="mb-1.5 block text-sm font-medium">
          {t('contact.form.address')}
        </label>
        <input id="address" name="address" type="text" className={inputClass} />
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
          {t('contact.form.subject')}
        </label>
        <input id="subject" name="subject" type="text" className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          {t('contact.form.message')} *
        </label>
        <textarea id="message" name="message" rows={5} required autoComplete="off" className={inputClass} />
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={appointmentRequest}
          onChange={(e) => setAppointmentRequest(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-white/20 accent-brand-600"
        />
        <span>{t('contact.form.appointment')}</span>
      </label>

      {status === 'error' && (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300 light:text-red-700" role="alert">
          {t('contact.form.errorSend')}
        </p>
      )}
      {status === 'success' && (
        <p className="rounded-xl border border-accent-400/30 bg-accent-400/10 px-4 py-3 text-sm text-accent-glow light:text-brand-900" role="status">
          {successMessage}
        </p>
      )}

      <p className="text-xs text-brand-300 light:text-brand-700">
        <Trans
          i18nKey="contact.form.privacy"
          components={{
            privacyLink: (
              <Link
                to="/datenschutz"
                className="underline underline-offset-2 transition-colors hover:text-accent-400 light:hover:text-brand-800"
              />
            ),
          }}
        />
      </p>

      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full min-h-[48px] sm:w-auto disabled:opacity-60">
        {status === 'loading' ? t('contact.form.sending') : t('contact.form.submit')}
      </button>
    </form>
  )
}
