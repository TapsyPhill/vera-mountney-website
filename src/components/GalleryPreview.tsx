import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { galleryImages } from '../data/gallery'
import { SectionHeading } from './SectionHeading'

const PREVIEW_IDS = ['appreciation', 'classroom', 'travel'] as const

export function GalleryPreview() {
  const { t } = useTranslation()
  const previews = PREVIEW_IDS.map((id) => galleryImages.find((img) => img.id === id)).filter(Boolean)

  return (
    <section className="section-padding bg-white/5 light:bg-[#F7F2FA]">
      <div className="container-narrow">
        <SectionHeading title={t('gallery.title')} subtitle={t('home.galleryTeaser')} />

        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {previews.map((image) =>
            image ? (
              <Link
                key={image.id}
                to="/gallery"
                className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-md transition hover:border-brand-400/40 light:border-brand-300/50 light:bg-white light:shadow-brand-900/5"
              >
                <img
                  src={image.src}
                  alt={t(`gallery.items.${image.id}.title`)}
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-3 pt-8">
                  <p className="font-display text-sm font-semibold text-white">
                    {t(`gallery.items.${image.id}.title`)}
                  </p>
                </div>
              </Link>
            ) : null,
          )}
        </div>

        <div className="mt-6 text-center sm:mt-8">
          <Link to="/gallery" className="btn-primary inline-flex">
            {t('home.galleryCta')}
          </Link>
        </div>
      </div>
    </section>
  )
}
