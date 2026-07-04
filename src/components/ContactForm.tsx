import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { profile } from '../data/profile'

export function ContactForm() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()

    if (!name || !email || !message) {
      setStatus('error')
      return
    }

    const subject = String(data.get('subject') || 'Website enquiry')
    const phone = String(data.get('phone') || '')
    const contactMethod = String(data.get('contactMethod') || '')
    const address = String(data.get('address') || '')
    const appointment = data.get('appointment') ? 'Yes / Ja' : 'No / Nein'

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone && `Phone: ${phone}`,
      contactMethod && `Preferred contact: ${contactMethod}`,
      address && `Address: ${address}`,
      `Appointment request: ${appointment}`,
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n')

    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus('success')
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-5 p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            {t('contact.form.name')} *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-accent-400 light:border-brand-200 light:bg-white"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            {t('contact.form.email')} *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-accent-400 light:border-brand-200 light:bg-white"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
            {t('contact.form.phone')}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-accent-400 light:border-brand-200 light:bg-white"
          />
        </div>
        <div>
          <label htmlFor="contactMethod" className="mb-1.5 block text-sm font-medium">
            {t('contact.form.contactMethod')}
          </label>
          <select
            id="contactMethod"
            name="contactMethod"
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-accent-400 light:border-brand-200 light:bg-white"
            defaultValue="email"
          >
            <option value="email">{t('contact.form.contactMethods.email')}</option>
            <option value="phone">{t('contact.form.contactMethods.phone')}</option>
            <option value="whatsapp">{t('contact.form.contactMethods.whatsapp')}</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="address" className="mb-1.5 block text-sm font-medium">
          {t('contact.form.address')}
        </label>
        <input
          id="address"
          name="address"
          type="text"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-accent-400 light:border-brand-200 light:bg-white"
        />
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
          {t('contact.form.subject')}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-accent-400 light:border-brand-200 light:bg-white"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          {t('contact.form.message')} *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-accent-400 light:border-brand-200 light:bg-white"
        />
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="appointment"
          className="mt-1 h-4 w-4 rounded border-white/20 accent-brand-600"
        />
        <span>{t('contact.form.appointment')}</span>
      </label>

      {status === 'error' && (
        <p className="text-sm text-red-400" role="alert">
          {t('contact.form.error')}
        </p>
      )}
      {status === 'success' && (
        <p className="text-sm text-accent-400" role="status">
          {t('contact.form.success')}
        </p>
      )}

      <p className="text-xs text-brand-300 light:text-brand-600">{t('contact.form.privacy')}</p>

      <button type="submit" className="btn-primary w-full sm:w-auto">
        {t('contact.form.submit')}
      </button>
    </form>
  )
}
