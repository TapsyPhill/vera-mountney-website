import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { NAV_LINKS, OPTIONAL_NAV } from '../utils/constants'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 hover:text-accent-400 ${
      isActive ? 'text-accent-400' : 'text-inherit'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-dark/80 backdrop-blur-xl dark:bg-surface-dark/80 light:bg-white/85 light:border-brand-200/50">
      <div className="container-narrow flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="font-display text-xl font-semibold tracking-wide text-white light:text-brand-900"
        >
          Vera Mountney
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex" aria-label="Main">
          {NAV_LINKS.map(({ key, path }) => (
            <NavLink key={key} to={path} className={navClass}>
              {t(`nav.${key}`)}
            </NavLink>
          ))}
          <NavLink to="/faq" className={navClass}>
            {t('nav.faq')}
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link to="/contact" className="btn-primary !px-5 !py-2.5 !text-xs">
            {t('nav.cta')}
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className="text-xl">{open ? '✕' : '☰'}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden light:border-brand-200/50">
          <nav className="flex flex-col gap-3 text-sm font-medium" aria-label="Mobile">
            {[...NAV_LINKS, ...OPTIONAL_NAV.filter((l) => l.key === 'faq')].map(
              ({ key, path }) => (
                <NavLink
                  key={key}
                  to={path}
                  className={navClass}
                  onClick={() => setOpen(false)}
                >
                  {t(`nav.${key}`)}
                </NavLink>
              ),
            )}
          </nav>
          <div className="mt-4 flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link to="/contact" className="btn-primary !px-4 !py-2 !text-xs" onClick={() => setOpen(false)}>
              {t('nav.cta')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
