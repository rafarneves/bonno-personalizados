import type { CSSProperties, ReactNode } from 'react';

type AnimationType =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'zoomIn';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Entrada suave ao rolar a página, feita só com CSS (veja `[data-reveal]` no globals.css).
 * O componente apenas marca o elemento; quem dispara a animação é o RevealObserver —
 * um único observador para a página inteira, sem biblioteca de animação no bundle.
 */
export default function AnimatedSection({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.7,
  className = '',
}: AnimatedSectionProps) {
  const style = {
    '--reveal-delay': `${delay}s`,
    '--reveal-duration': `${duration}s`,
  } as CSSProperties;

  return (
    <div data-reveal={animation} className={className} style={style}>
      {children}
    </div>
  );
}
