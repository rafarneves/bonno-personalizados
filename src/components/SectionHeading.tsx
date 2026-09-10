import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  /** Trecho final do título, destacado em azul com o rabisco por baixo. */
  highlight?: string;
  description?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}

/** Rabisco desenhado à mão que assina os títulos da marca. */
function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`pointer-events-none absolute -bottom-2 left-0 h-3.5 w-full text-brand-600 ${className}`}
      viewBox="0 0 500 40"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M.58,16s93-15.56,303-12c118,2,180,12,180,12" />
      <path d="M29.83,33.28S111.54,17.1,296.13,20.8c103.71,2.08,158.2,12.48,158.2,12.48" />
    </svg>
  );
}

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = 'center',
  tone = 'light',
  className = '',
}: SectionHeadingProps) {
  const isDark = tone === 'dark';

  return (
    <div
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : 'text-left'} ${className}`}
    >
      {eyebrow && (
        <span
          className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${
            isDark
              ? 'border-white/15 bg-white/5 text-brand-200'
              : 'border-brand-100 bg-brand-50 text-brand-700'
          }`}
        >
          <span className="size-1.5 rounded-full bg-brand-500" />
          {eyebrow}
        </span>
      )}

      <h2
        className={`font-display text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          isDark ? 'text-white' : 'text-ink-950'
        }`}
      >
        {title}
        {highlight && (
          <>
            {' '}
            <span className="relative inline-block">
              <span className={`relative z-10 ${isDark ? 'text-brand-300' : 'text-brand-600'}`}>
                {highlight}
              </span>
              <Squiggle />
            </span>
          </>
        )}
      </h2>

      {description && (
        <p
          className={`mt-6 text-base leading-relaxed sm:text-lg ${
            isDark ? 'text-ink-300' : 'text-ink-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
