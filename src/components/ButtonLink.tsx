import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface ButtonLinkProps {
  to?: string
  href?: string
  variant?: 'primary' | 'secondary'
  children: ReactNode
  className?: string
  external?: boolean
}

export function ButtonLink({
  to,
  href,
  variant = 'primary',
  children,
  className = '',
  external,
}: ButtonLinkProps) {
  const classes = `${variant === 'primary' ? 'btn-primary' : 'btn-secondary'} ${className}`

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    )
  }

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return <span className={classes}>{children}</span>
}
