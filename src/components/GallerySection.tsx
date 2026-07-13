import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { galleryImages, type GalleryImageId } from '../data/gallery'
import { SectionHeading } from './SectionHeading'

const LIKED_KEY_PREFIX = 'vera-gallery-liked-'

async function fetchLikes(): Promise<Record<string, number>> {
  const response = await fetch('/api/gallery-likes.php')
  if (!response.ok) throw new Error('Failed to load likes')
  const data = await response.json()
  return data.likes ?? {}
}

async function incrementLike(imageId: GalleryImageId): Promise<number> {
  const response = await fetch('/api/gallery-likes.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageId }),
  })
  if (!response.ok) throw new Error('Failed to update like')
  const data = await response.json()
  return data.likes as number
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${filled ? 'fill-current text-brand-500' : 'fill-none stroke-current'}`}
      strokeWidth="1.75"
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

export function GallerySection() {
  const { t } = useTranslation()
  const [likes, setLikes] = useState<Record<string, number>>({})
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [lightboxId, setLightboxId] = useState<GalleryImageId | null>(null)

  const lightboxImage = lightboxId
    ? galleryImages.find((image) => image.id === lightboxId)
    : null

  useEffect(() => {
    const stored = new Set<string>()
    for (const image of galleryImages) {
      if (localStorage.getItem(`${LIKED_KEY_PREFIX}${image.id}`)) {
        stored.add(image.id)
      }
    }
    setLikedIds(stored)

    fetchLikes()
      .then(setLikes)
      .catch(() => {
        const fallback: Record<string, number> = {}
        for (const image of galleryImages) {
          fallback[image.id] = image.defaultLikes
        }
        setLikes(fallback)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleLike = useCallback(
    async (imageId: GalleryImageId) => {
      if (likedIds.has(imageId) || pendingId) return

      setPendingId(imageId)
      try {
        const newCount = await incrementLike(imageId)
        setLikes((prev) => ({ ...prev, [imageId]: newCount }))
        localStorage.setItem(`${LIKED_KEY_PREFIX}${imageId}`, '1')
        setLikedIds((prev) => new Set(prev).add(imageId))
      } catch {
        setLikes((prev) => ({
          ...prev,
          [imageId]: (prev[imageId] ?? 0) + 1,
        }))
        localStorage.setItem(`${LIKED_KEY_PREFIX}${imageId}`, '1')
        setLikedIds((prev) => new Set(prev).add(imageId))
      } finally {
        setPendingId(null)
      }
    },
    [likedIds, pendingId],
  )

  return (
    <section className="section-padding hero-gradient bg-white/5 light:bg-[#F7F2FA]">
      <div className="container-narrow">
        <SectionHeading title={t('gallery.title')} subtitle={t('gallery.intro')} />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {galleryImages.map((image) => {
            const count = likes[image.id] ?? image.defaultLikes
            const isLiked = likedIds.has(image.id)

            return (
              <article
                key={image.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg transition duration-300 hover:border-brand-400/30 light:border-brand-300/50 light:bg-white light:shadow-brand-900/5"
              >
                <button
                  type="button"
                  onClick={() => setLightboxId(image.id)}
                  className="relative block aspect-[4/3] w-full overflow-hidden text-left"
                  aria-label={t('gallery.viewImage')}
                >
                  <img
                    src={image.src}
                    alt={t(`gallery.items.${image.id}.title`)}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-3 pt-10">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-white/80">
                      {t(`gallery.items.${image.id}.category`)}
                    </p>
                  </div>
                </button>

                <div className="space-y-2 p-4 sm:p-5">
                  <h3 className="font-display text-lg font-semibold leading-snug light:text-[#24152F]">
                    {t(`gallery.items.${image.id}.title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-brand-200 light:text-[#5F4A6D]">
                    {t(`gallery.items.${image.id}.caption`)}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleLike(image.id)}
                    disabled={isLiked || pendingId === image.id || loading}
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium transition hover:border-brand-400/40 disabled:cursor-default disabled:opacity-70 light:border-brand-300/60 light:text-[#24152F] light:hover:border-brand-500/50 light:hover:bg-brand-50"
                    aria-pressed={isLiked}
                    aria-label={t('gallery.like')}
                  >
                    <HeartIcon filled={isLiked} />
                    <span>{loading ? '…' : count}</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t(`gallery.items.${lightboxImage.id}.title`)}
          onClick={() => setLightboxId(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-brand-950 shadow-2xl light:border-brand-300/40 light:bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxId(null)}
              className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm light:border-brand-300/50 light:bg-white/90 light:text-[#24152F]"
            >
              {t('gallery.close')}
            </button>
            <img
              src={lightboxImage.src}
              alt={t(`gallery.items.${lightboxImage.id}.title`)}
              className="max-h-[70vh] w-full object-contain bg-black/20"
            />
            <div className="space-y-1 p-4 sm:p-5">
              <h3 className="font-display text-lg font-semibold light:text-[#24152F]">
                {t(`gallery.items.${lightboxImage.id}.title`)}
              </h3>
              <p className="text-sm text-brand-200 light:text-[#5F4A6D]">
                {t(`gallery.items.${lightboxImage.id}.caption`)}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
