import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { faqItems } from '../data/faq'
import { SectionHeading } from './SectionHeading'

export function FAQSection() {
  const { t } = useTranslation()
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null)

  return (
    <section className="section-padding">
      <div className="container-narrow max-w-3xl">
        <SectionHeading title={t('faq.title')} subtitle={t('faq.subtitle')} />
        <div className="space-y-3">
          {faqItems.map((item) => {
            const isOpen = openId === item.id
            return (
              <article key={item.id} className="glass-card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/5"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg font-semibold">
                    {t(`faq.items.${item.id}.q`)}
                  </span>
                  <span className="text-accent-400">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-white/10 px-5 pb-5 pt-3 text-sm leading-relaxed text-brand-200 light:border-brand-200/50 light:text-brand-700">
                    {t(`faq.items.${item.id}.a`)}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
