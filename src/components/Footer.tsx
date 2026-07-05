import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { profile } from '../data/profile'
import { NAV_LINKS } from '../utils/constants'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-surface-dark-elevated light:border-brand-200/60 light:bg-brand-100/80">
      <div className="container-narrow section-padding !py-10 sm:!py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
          <div>
            <p className="font-display text-xl font-semibold sm:text-2xl light:text-brand-950">Vera Mountney</p>
            <p className="mt-2 text-sm text-brand-300 light:text-brand-700">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent-glow">
              {t('footer.quickLinks')}
            </p>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map(({ key, path }) => (
                <li key={key}>
                  <Link
                    to={path}
                    className="transition-colors hover:text-accent-400 light:text-brand-800"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent-glow">
              {t('footer.contact')}
            </p>
            <ul className="space-y-2 text-sm light:text-brand-800">
              <li>
                <Link to="/contact" className="hover:text-accent-400">
                  {t('footer.contactForm')}
                </Link>
              </li>
              <li>
                <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="hover:text-accent-400">
                  {profile.phone}
                </a>
              </li>
              <li>{profile.location}</li>
              <li>
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-400"
                >
                  Instagram {profile.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-gray-400 light:border-brand-200/50 light:text-brand-600 sm:mt-10">
          © {year} Vera Mountney. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}
