import { useTheme } from '../hooks/useTheme'

function SunIcon({ compact }: { compact?: boolean }) {
  const size = compact ? 'h-4 w-4' : 'h-5 w-5'
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`${size} text-accent-400`} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon({ compact }: { compact?: boolean }) {
  const size = compact ? 'h-4 w-4' : 'h-5 w-5'
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`${size} text-accent-400`} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme()
  const sizeClass = compact ? 'h-8 w-8 min-h-8 min-w-8' : 'h-10 w-10'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex ${sizeClass} items-center justify-center rounded-full border border-brand-400/30 bg-white/5 transition-all duration-300 hover:border-accent-400/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 light:border-brand-300 light:bg-brand-100/80`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      {theme === 'dark' ? <SunIcon compact={compact} /> : <MoonIcon compact={compact} />}
    </button>
  )
}
