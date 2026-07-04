import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { profile } from '../data/profile'
import { NAV_LINKS } from '../utils/constants'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-surface-dark-elevated light:border-brand-200/50 light:bg-brand-50/50">
      <div className="container-narrow section-padding !py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-2xl font-semibold">Vera Mountney</p>
            <p className="mt-2 text-sm text-brand-300 light:text-brand-700">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent-400">
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
              <li>
                <Link to="/faq" className="transition-colors hover:text-accent-400 light:text-brand-800">
                  {t('nav.faq')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent-400">
              {t('footer.contact')}
            </p>
            <ul className="space-y-2 text-sm light:text-brand-800">
              <li>
                <a href={`mailto:${profile.email}`} className="hover:text-accent-400">
                  {profile.email}
                </a>
              </li>
              <li>
                <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="hover:text-accent-400">
                  {profile.phone}
                </a>
              </li>
              <li>{profile.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-gray-400 light:border-brand-200/50 light:text-brand-600">
          © {year} Vera Mountney. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}
