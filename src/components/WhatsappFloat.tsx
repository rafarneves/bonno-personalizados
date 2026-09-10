'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WhatsappIcon } from './icons';
import { whatsappLink } from '@/lib/site';

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
    <AnimatePresence>
      {visible && (
        <motion.a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          className="group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-[0_18px_40px_-12px_rgb(37_211_102/0.6)] transition-colors hover:bg-[#1fb855] sm:bottom-8 sm:right-8"
        >
          <span className="relative flex size-9 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/40" />
            <WhatsappIcon className="relative size-8" />
          </span>
          <span className="hidden text-sm font-semibold sm:inline">Pedir orçamento</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
