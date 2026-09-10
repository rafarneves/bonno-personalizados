'use client';

import { useEffect, useState } from 'react';
import { WhatsappIcon } from './icons';
import { whatsappLink } from '@/lib/site';

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

/** Botão flutuante que aparece assim que o visitante passa do hero. */
export default function WhatsappFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      inert={!visible}
      style={{
        transition: `opacity 500ms ${SPRING}, translate 500ms ${SPRING}, scale 500ms ${SPRING}, background-color 150ms ease`,
      }}
      className={`group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-[0_18px_40px_-12px_rgb(37_211_102/0.6)] hover:bg-[#1fb855] sm:bottom-8 sm:right-8 ${
        visible
          ? 'translate-y-0 scale-100 opacity-100'
          : 'pointer-events-none translate-y-5 scale-[0.7] opacity-0'
      }`}
    >
      <span className="relative flex size-9 items-center justify-center">
        {/* O pulso só roda com o botão na tela, para não gastar quadros à toa */}
        {visible && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/40" />
        )}
        <WhatsappIcon className="relative size-8" />
      </span>
      <span className="hidden text-sm font-semibold sm:inline">Pedir orçamento</span>
    </a>
  );
}
