import { PageMeta } from '../components/PageMeta'
import { GallerySection } from '../components/GallerySection'

export function GalleryPage() {
  return (
    <>
      <PageMeta titleKey="meta.gallery.title" descriptionKey="meta.gallery.description" />
      <GallerySection />
    </>
  )
}
