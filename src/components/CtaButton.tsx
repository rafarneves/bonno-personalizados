import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { WhatsappIcon } from './icons';
import { whatsappLink } from '@/lib/site';

type Variant = 'primary' | 'dark' | 'outline' | 'outline-light' | 'white';
type Size = 'md' | 'lg';

interface CtaButtonProps {
  children: ReactNode;
  /** Por padrão aponta para o WhatsApp com a mensagem de orçamento pronta. */
  href?: string;
  message?: string;
  variant?: Variant;
  size?: Size;
  icon?: 'whatsapp' | 'arrow' | 'none';
  className?: string;
}

const base =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-tight whitespace-nowrap transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-600';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-glow hover:bg-brand-700 hover:-translate-y-0.5 focus-visible:outline-brand-600',
  dark:
    'bg-ink-950 text-white hover:bg-ink-900 hover:-translate-y-0.5 shadow-card-hover',
  outline:
    'border-2 border-ink-200 text-ink-900 hover:border-brand-600 hover:text-brand-600 hover:-translate-y-0.5',
  white:
    'bg-white text-brand-700 hover:bg-brand-50 hover:-translate-y-0.5 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.55)] focus-visible:outline-white',
  'outline-light':
    'border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/10 hover:-translate-y-0.5 focus-visible:outline-white',
};

const sizes: Record<Size, string> = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export default function CtaButton({
  children,
  href,
  message,
  variant = 'primary',
  size = 'lg',
  icon = 'whatsapp',
  className = '',
}: CtaButtonProps) {
  const target = href ?? whatsappLink(message);
  const isExternal = target.startsWith('http');

  return (
    <a
      href={target}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon === 'whatsapp' && <WhatsappIcon className="size-5 shrink-0" />}
      <span>{children}</span>
      {icon === 'arrow' && (
        <ArrowRight className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      )}
      {/* Brilho que atravessa o botão no hover */}
      {variant === 'primary' && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-opacity duration-300 group-hover:animate-shine group-hover:opacity-100" />
        </span>
      )}
    </a>
  );
}
