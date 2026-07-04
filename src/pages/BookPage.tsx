import { useTranslation } from 'react-i18next'
import { PageMeta } from '../components/PageMeta'
import { BookSection } from '../components/BookSection'

export function BookPage() {
  const { t } = useTranslation()

  return (
    <>
      <PageMeta titleKey="meta.book.title" descriptionKey="meta.book.description" />
      <section className="section-padding hero-gradient pt-8">
        <div className="container-narrow mx-auto max-w-3xl pb-8 text-center">
          <p className="text-sm leading-relaxed text-brand-200 light:text-brand-700">
            {t('book.descriptionExtended')}
          </p>
        </div>
      </section>
      <BookSection />
    </>
  )
}
