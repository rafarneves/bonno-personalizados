import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Atraso em segundos. */
  delay?: number;
  direction?: 'up' | 'right';
  className?: string;
}

/**
 * Animação de entrada feita só com CSS — sem depender de JavaScript.
 * Preferir esta ao AnimatedSection no conteúdo acima da dobra.
 */
export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: RevealProps) {
  return (
    <div
      className={`reveal-${direction} ${className}`}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
