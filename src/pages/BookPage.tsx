import { PageMeta } from '../components/PageMeta'
import { BookSection } from '../components/BookSection'

export function BookPage() {
  return (
    <>
      <PageMeta titleKey="meta.book.title" descriptionKey="meta.book.description" />
      <BookSection />
    </>
  )
}
