import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { NAV_LINKS } from '../utils/constants'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const { t } = useTranslation()

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap transition-colors duration-200 hover:text-accent-400 ${
      isActive ? 'text-accent-glow' : 'text-inherit'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-dark/85 backdrop-blur-xl pt-[env(safe-area-inset-top,0px)] dark:bg-surface-dark/85 light:border-brand-200/60 light:bg-brand-50/90">
      <div className="container-narrow px-3 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4">
        {/* Mobile: logo + controls on top, nav links below */}
        <div className="flex items-center justify-between gap-2 lg:hidden">
          <Link
            to="/"
            className="font-display text-base font-semibold tracking-wide text-white light:text-brand-950"
          >
            Vera Mountney
          </Link>
          <div className="flex shrink-0 items-center gap-1.5">
            <LanguageSwitcher compact />
            <ThemeToggle compact />
            <Link to="/contact" className="btn-primary !min-h-[36px] !px-3 !py-1.5 !text-[11px]">
              {t('nav.cta')}
            </Link>
          </div>
        </div>

        <nav
          className="mt-2 flex items-center justify-center gap-4 overflow-x-auto text-xs font-medium [-ms-overflow-style:none] [scrollbar-width:none] lg:mt-0 lg:hidden [&::-webkit-scrollbar]:hidden"
          aria-label="Mobile"
        >
          {NAV_LINKS.map(({ key, path }) => (
            <NavLink key={key} to={path} className={navClass}>
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>

        {/* Desktop: single row */}
        <div className="hidden items-center justify-between gap-3 lg:flex">
          <Link
            to="/"
            className="font-display text-xl font-semibold tracking-wide text-white light:text-brand-950"
          >
            Vera Mountney
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium" aria-label="Main">
            {NAV_LINKS.map(({ key, path }) => (
              <NavLink key={key} to={path} className={navClass}>
                {t(`nav.${key}`)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link to="/contact" className="btn-primary !px-5 !py-2.5 !text-xs">
              {t('nav.cta')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
