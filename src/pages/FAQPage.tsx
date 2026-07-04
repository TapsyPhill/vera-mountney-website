import { PageMeta } from '../components/PageMeta'
import { FAQSection } from '../components/FAQSection'

export function FAQPage() {
  return (
    <>
      <PageMeta titleKey="meta.faq.title" descriptionKey="meta.faq.description" />
      <div className="hero-gradient">
        <FAQSection />
      </div>
    </>
  )
}
