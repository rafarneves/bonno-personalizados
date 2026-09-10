'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import CtaButton from './CtaButton';
import { WhatsappIcon } from './icons';
import { navLinks, site, whatsappLink } from '@/lib/site';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('principal');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Destaca no menu a seção que está sendo lida no momento
  useEffect(() => {
    const ids = navLinks.map((link) => link.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Trava a rolagem do fundo enquanto o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const solid = scrolled || isOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid
            ? 'border-b border-ink-100 bg-white/85 py-2 shadow-[0_8px_30px_-12px_rgb(6_7_15_/_0.15)] backdrop-blur-xl'
            : 'border-b border-transparent py-4'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <a
            href="#principal"
            aria-label={`${site.name} — ir para o início`}
            className="shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600"
          >
            <Logo tone={solid ? 'light' : 'dark'} />
          </a>

          {/* Menu desktop */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <li key={link.name}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                      solid
                        ? isActive
                          ? 'text-brand-600'
                          : 'text-ink-600 hover:text-ink-950'
                        : isActive
                          ? 'text-white'
                          : 'text-white/65 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className={`absolute inset-0 -z-10 rounded-full ${
                          solid ? 'bg-brand-50' : 'bg-white/10'
                        }`}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {link.name}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {/* O wrapper controla a visibilidade: o `inline-flex` do próprio botão
                venceria um `hidden` aplicado nele mesmo. */}
            <span className="hidden sm:block">
              <CtaButton size="md" variant={solid ? "primary" : "outline-light"}>
                Orçamento
              </CtaButton>
            </span>

            <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isOpen}
              className={`flex size-11 items-center justify-center rounded-full border transition-colors lg:hidden ${
                solid
                  ? 'border-ink-200 text-ink-900 hover:bg-ink-50'
                  : 'border-white/25 text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Menu mobile em tela cheia */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-ink-950 lg:hidden"
          >
            <div className="bg-grid absolute inset-0 opacity-60" />
            <div className="absolute -right-24 top-1/4 size-80 rounded-full bg-brand-600/25 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between px-6 pb-10 pt-28">
              <ul className="space-y-1">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * index + 0.08, duration: 0.4 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-baseline gap-4 border-b border-white/10 py-4 font-display text-3xl font-bold text-white transition-colors hover:text-brand-300"
                    >
                      <span className="text-xs font-medium text-brand-400">
                        0{index + 1}
                      </span>
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.4 }}
                className="space-y-4"
              >
                <CtaButton className="w-full">Solicitar orçamento</CtaButton>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-sm text-white/60"
                >
                  <WhatsappIcon className="size-4" />
                  {site.phoneDisplay}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
