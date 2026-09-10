'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Menu, X } from 'lucide-react';
import Logo from './Logo';
import CtaButton from './CtaButton';
import { WhatsappIcon } from './icons';
import { navLinks, site, whatsappLink } from '@/lib/site';

type PillBox = { x: number; y: number; width: number; height: number };
type Pill = PillBox & { animate: boolean };

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
// Mesmo breakpoint do `lg:` do Tailwind, a partir do qual o menu desktop aparece
const DESKTOP_QUERY = '(min-width: 64rem)';
// Link comum (sem next/link) de propósito: evita que a página inicial pré-carregue o 3D
const CUSTOMIZER_HREF = '/personalizar';

function measure(link: HTMLElement): PillBox {
  return {
    x: link.offsetLeft,
    y: link.offsetTop,
    width: link.offsetWidth,
    height: link.offsetHeight,
  };
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // Entrada escalonada dos itens do menu mobile. Só volta a `false` depois que o
  // menu termina de sumir, para a saída continuar sendo apenas o fade.
  const [menuEntered, setMenuEntered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('principal');
  const [pill, setPill] = useState<Pill | null>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());
  const activeRef = useRef(active);

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

  // Desliza o destaque do menu desktop até o link da seção ativa
  useEffect(() => {
    activeRef.current = active;
    // No celular esse menu nem aparece. Medir os links ali forçaria o navegador
    // a recalcular o layout da página inteira durante a carga.
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    const frame = requestAnimationFrame(() => {
      const link = linkRefs.current.get(active);
      if (!link) return;
      setPill((prev) => ({ ...measure(link), animate: prev !== null }));
    });
    return () => cancelAnimationFrame(frame);
  }, [active]);

  // Recalcula sem animação quando a tela muda de tamanho ou a fonte termina de carregar
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const remeasure = () => {
      if (!desktop.matches) return;
      const link = linkRefs.current.get(activeRef.current);
      if (!link) return;
      setPill({ ...measure(link), animate: false });
    };
    document.fonts.ready.then(remeasure);
    window.addEventListener('resize', remeasure);
    return () => window.removeEventListener('resize', remeasure);
  }, []);

  // Trava a rolagem do fundo enquanto o menu mobile está aberto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    setMenuEntered(true);
    setIsOpen(true);
  };

  const solid = scrolled || isOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid
            ? // O desfoque de fundo só no desktop: no celular ele é recalculado a cada quadro de rolagem
              'border-b border-ink-100 bg-white/95 py-2 shadow-[0_8px_30px_-12px_rgb(6_7_15_/_0.15)] lg:bg-white/85 lg:backdrop-blur-xl'
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
          <div className="relative hidden lg:block">
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute left-0 top-0 rounded-full ${
                solid ? 'bg-brand-50' : 'bg-white/10'
              } ${pill ? 'opacity-100' : 'opacity-0'}`}
              style={
                pill
                  ? {
                      width: pill.width,
                      height: pill.height,
                      transform: `translate(${pill.x}px, ${pill.y}px)`,
                      transition: pill.animate
                        ? `transform 420ms ${EASE}, width 420ms ${EASE}, background-color 300ms ease`
                        : 'background-color 300ms ease',
                    }
                  : undefined
              }
            />

            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const id = link.href.slice(1);
                const isActive = active === id;
                return (
                  <li key={link.name}>
                    <a
                      ref={(node) => {
                        if (node) linkRefs.current.set(id, node);
                        else linkRefs.current.delete(id);
                      }}
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
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={CUSTOMIZER_HREF}
              className={`hidden items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors xl:inline-flex ${
                solid
                  ? 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Box className="size-4" />
              Crie seu boné 3D
            </a>

            {/* O wrapper controla a visibilidade: o `inline-flex` do próprio botão
                venceria um `hidden` aplicado nele mesmo. */}
            <span className="hidden sm:block">
              <CtaButton size="md" variant={solid ? 'primary' : 'outline-light'}>
                Orçamento
              </CtaButton>
            </span>

            <button
              type="button"
              onClick={toggleMenu}
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

      {/* Menu mobile em tela cheia — sempre montado, aparece e some com transição CSS */}
      <div
        inert={!isOpen}
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && event.propertyName === 'opacity' && !isOpen) {
            setMenuEntered(false);
          }
        }}
        className={`fixed inset-0 z-40 bg-ink-950 transition-[opacity,visibility] duration-250 lg:hidden ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="glow absolute -right-24 top-1/4 size-80 text-brand-600/20 [--glow-spread:6rem]" />

        <div className="relative flex h-full flex-col justify-between px-6 pb-10 pt-28">
          <ul className="space-y-1">
            {navLinks.map((link, index) => (
              <li
                key={link.name}
                className={`transition-[opacity,translate] duration-400 ease-out ${
                  menuEntered ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0'
                }`}
                style={{ transitionDelay: menuEntered ? `${0.06 * index + 0.08}s` : '0s' }}
              >
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-baseline gap-4 border-b border-white/10 py-4 font-display text-3xl font-bold text-white transition-colors hover:text-brand-300"
                >
                  <span className="text-xs font-medium text-brand-400">0{index + 1}</span>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div
            className={`space-y-4 transition-[opacity,translate] duration-400 ease-out ${
              menuEntered ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
            style={{ transitionDelay: menuEntered ? '0.42s' : '0s' }}
          >
            <CtaButton href={CUSTOMIZER_HREF} variant="outline-light" icon="arrow" className="w-full">
              Crie seu boné em 3D
            </CtaButton>
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
          </div>
        </div>
      </div>
    </>
  );
}
