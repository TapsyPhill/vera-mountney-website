import { profile } from '../data/profile'

export function WhatsAppButton() {
  const message = encodeURIComponent(
    'Hello / Hallo — I would like to get in touch regarding your services.',
  )
  const url = `https://wa.me/${profile.whatsapp}?text=${message}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg shadow-black/30 transition-all duration-300 hover:scale-110 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-6"
      aria-label="WhatsApp"
      title="WhatsApp"
    >
      💬
    </a>
  )
}
