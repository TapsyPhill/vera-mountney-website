import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00',
]

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-accent-400 light:border-brand-300 light:bg-white light:text-brand-900'

interface DateTimePickerProps {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  compact?: boolean
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatSelection(date: Date, time: string, locale: string): string {
  const datePart = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
  return `${datePart}, ${time}`
}

export function DateTimePicker({ id, name, value, onChange, compact = false }: DateTimePickerProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === 'de' ? 'de-DE' : 'en-GB'
  const today = useMemo(() => startOfDay(new Date()), [])

  const days = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      return d
    })
  }, [today])

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('10:00')
  const [manualMode, setManualMode] = useState(false)
  const [manualValue, setManualValue] = useState(value)

  const weekLabel = (date: Date) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)

  const applyPicker = (date: Date, time: string) => {
    onChange(formatSelection(date, time, locale))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    applyPicker(date, selectedTime)
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    if (selectedDate) {
      applyPicker(selectedDate, time)
    }
  }

  const handleManualChange = (text: string) => {
    setManualValue(text)
    onChange(text)
  }

  const padding = compact ? 'p-3' : 'p-4'
  const dayBtnClass = (active: boolean) =>
    `flex min-w-[4.25rem] shrink-0 flex-col items-center rounded-xl border px-2 py-2.5 text-center transition touch-manipulation ${
      active
        ? 'border-accent-400/60 bg-brand-600/40 text-white shadow-md shadow-brand-900/30 light:border-accent-500 light:bg-brand-600 light:text-white'
        : 'border-white/15 bg-white/5 hover:border-accent-400/40 light:border-brand-300 light:bg-white light:hover:border-brand-500'
    }`

  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 ${padding} light:border-brand-200 light:bg-white`}>
      <input type="hidden" id={id} name={name} value={value} readOnly />

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-brand-200 light:text-brand-800">
          {t('contact.form.pickDate')}
        </p>
        <button
          type="button"
          onClick={() => {
            setManualMode(!manualMode)
            if (!manualMode) {
              setManualValue(value)
            } else if (selectedDate) {
              applyPicker(selectedDate, selectedTime)
            }
          }}
          className="text-xs text-accent-glow underline-offset-2 hover:underline light:text-brand-700"
        >
          {manualMode ? t('contact.form.useCalendar') : t('contact.form.customDateTime')}
        </button>
      </div>

      {manualMode ? (
        <input
          type="text"
          value={manualValue}
          onChange={(e) => handleManualChange(e.target.value)}
          placeholder={t('contact.form.customDateTimePlaceholder')}
          className={inputClass}
        />
      ) : (
        <>
          <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {days.map((date) => {
              const active = selectedDate ? isSameDay(date, selectedDate) : false
              const isToday = isSameDay(date, today)
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleDateClick(date)}
                  className={`${dayBtnClass(active)} snap-start`}
                  aria-pressed={active}
                >
                  <span className="text-[10px] uppercase tracking-wide opacity-80">{weekLabel(date)}</span>
                  <span className="mt-0.5 text-base font-semibold leading-none">{date.getDate()}</span>
                  <span className="mt-1 text-[10px] opacity-75">
                    {new Intl.DateTimeFormat(locale, { month: 'short' }).format(date)}
                  </span>
                  {isToday && (
                    <span className="mt-1 text-[9px] font-medium text-accent-300 light:text-accent-600">
                      {t('contact.form.today')}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mt-4">
            <label htmlFor={`${id || 'dt'}-time`} className="mb-1.5 block text-xs font-medium text-brand-200 light:text-brand-800">
              {t('contact.form.pickTime')}
            </label>
            <select
              id={`${id || 'dt'}-time`}
              value={selectedTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={!selectedDate}
              className={`${inputClass} disabled:opacity-50`}
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {value && selectedDate && (
            <p className="mt-3 rounded-lg border border-accent-400/20 bg-accent-400/10 px-3 py-2 text-xs text-accent-glow light:text-brand-900">
              {value}
            </p>
          )}
        </>
      )}
    </div>
  )
}

interface DateTimePickerActionsProps {
  onConfirm: (value: string) => void
  onSkip: () => void
  compact?: boolean
}

export function DateTimePickerPanel({
  value,
  onChange,
  onConfirm,
  onSkip,
  compact = true,
}: DateTimePickerProps & DateTimePickerActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      <DateTimePicker value={value} onChange={onChange} compact={compact} />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onConfirm(value)}
          disabled={!value.trim()}
          className="btn-primary !px-4 !py-2 !text-xs disabled:opacity-50"
        >
          {t('contact.form.confirmDateTime')}
        </button>
        <button type="button" onClick={onSkip} className="btn-secondary !px-4 !py-2 !text-xs">
          {t('contact.form.skipDateTime')}
        </button>
      </div>
    </div>
  )
}
