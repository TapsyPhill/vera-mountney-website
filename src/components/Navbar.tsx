import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { NAV_LINKS } from '../utils/constants'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block py-1 transition-colors duration-200 hover:text-accent-400 ${
      isActive ? 'text-accent-glow' : 'text-inherit'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-dark/85 backdrop-blur-xl pt-[env(safe-area-inset-top,0px)] dark:bg-surface-dark/85 light:border-brand-200/60 light:bg-brand-50/90">
      <div className="container-narrow flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-wide text-white sm:text-xl light:text-brand-950"
        >
          Vera Mountney
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium lg:flex" aria-label="Main">
          {NAV_LINKS.map(({ key, path }) => (
            <NavLink key={key} to={path} className={navClass}>
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link to="/contact" className="btn-primary !px-5 !py-2.5 !text-xs">
            {t('nav.cta')}
          </Link>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/20 lg:hidden light:border-brand-300"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 px-4 py-4 lg:hidden light:border-brand-200/60 light:bg-brand-50/95">
          <nav className="flex flex-col gap-2 text-sm font-medium" aria-label="Mobile">
            {NAV_LINKS.map(({ key, path }) => (
              <NavLink
                key={key}
                to={path}
                className={navClass}
                onClick={() => setOpen(false)}
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              to="/contact"
              className="btn-primary w-full justify-center !px-4 !py-2.5 !text-xs sm:w-auto"
              onClick={() => setOpen(false)}
            >
              {t('nav.cta')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
