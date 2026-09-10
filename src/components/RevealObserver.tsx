'use client';

import { useEffect } from 'react';

/**
 * Revela os elementos marcados com `data-reveal` quando eles entram na tela.
 * Um só IntersectionObserver para todos, e cada elemento é solto logo após aparecer.
 */
export default function RevealObserver() {
  useEffect(() => {
    const pending = document.querySelectorAll('[data-reveal]:not([data-revealed])');
    const reveal = (element: Element) => element.setAttribute('data-revealed', '');

    if (!('IntersectionObserver' in window)) {
      pending.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      // Dispara quando o elemento passa um pouco da borda de baixo da tela
      { rootMargin: '0px 0px -10% 0px' }
    );

    pending.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
