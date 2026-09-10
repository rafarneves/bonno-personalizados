import Image from 'next/image';
import AnimatedSection from './AnimatedSection';
import CtaButton from './CtaButton';
import { site } from '@/lib/site';

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="zoomIn">
          <div className="grain relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-ink-950 px-6 py-14 sm:px-12 md:py-20">
            <div className="bg-grid absolute inset-0 opacity-50" />
            <div className="glow absolute -left-20 -top-24 size-80 text-brand-400/25 [--glow-spread:9rem]" />
            <div className="glow absolute -bottom-32 right-0 size-80 text-brand-300/16 [--glow-spread:10rem]" />

            {/* Marca d'água com o ícone da marca */}
            <Image
              src="/images/icone-bonno-300x300.png"
              alt=""
              width={300}
              height={300}
              className="pointer-events-none absolute -right-10 top-1/2 hidden w-72 -translate-y-1/2 rotate-12 opacity-10 brightness-0 invert lg:block"
            />

            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                Bora começar?
              </span>

              <h2 className="mt-6 font-display text-3xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
                Sua marca merece um boné à altura
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                Peça o seu orçamento agora pelo WhatsApp, sem compromisso. Um consultor
                responde, monta o layout com você e cuida do pedido até a entrega.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <CtaButton variant="white">Solicitar orçamento</CtaButton>
                <CtaButton
                  href={site.instagram}
                  variant="outline-light"
                  icon="arrow"
                >
                  Ver o Instagram
                </CtaButton>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
