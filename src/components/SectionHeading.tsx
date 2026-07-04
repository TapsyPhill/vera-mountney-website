interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeading({
  title,
  subtitle,
  centered = true,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-base text-brand-200 light:text-brand-700 sm:text-lg">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-brand-500 to-accent-400 ${
          centered ? 'mx-auto' : ''
        }`}
        aria-hidden="true"
      />
    </div>
  )
}
