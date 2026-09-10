import Image from 'next/image';
import { Star } from 'lucide-react';
import Reveal from './Reveal';
import CtaButton from './CtaButton';
import { site } from '@/lib/site';

const facts = [
  { value: `${site.minOrder} un.`, label: 'pedido mínimo' },
  { value: `${site.productionDays} dias`, label: 'úteis de fabricação' },
  { value: '7', label: 'modelos disponíveis' },
  { value: 'Pix', label: 'boleto ou cartão' },
];

export default function Hero() {
  return (
    <section
      id="principal"
      className="grain relative isolate overflow-hidden bg-ink-950 pt-28 lg:pt-36"
    >
      {/* Camadas de fundo: foto real dos bonés, malha, brilho azul */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/Imagem-site-1.png"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          className="scale-125 object-cover opacity-[0.14] blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-950/95 to-ink-950/75" />
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -right-20 -top-40 size-[36rem] rounded-full bg-brand-600/30 blur-[130px]" />
        <div className="absolute -left-32 bottom-0 size-[26rem] rounded-full bg-brand-500/15 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-8">
        {/* Coluna de texto */}
        <div className="pb-12 lg:pb-20">
          <Reveal delay={0.05}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-200 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-brand-400" />
              </span>
              Sob encomenda · {site.address.city}/{site.address.state}
            </span>
          </Reveal>

          <Reveal delay={0.15}>
            <h1 className="mt-6 font-display text-[2.15rem] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3rem] xl:text-[3.5rem]">
              Bonés personalizados que{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-brand-300 via-brand-400 to-brand-200 bg-clip-text text-transparent">
                  vestem sua marca
                </span>
                <svg
                  className="absolute -bottom-2 left-0 h-4 w-full text-brand-500"
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
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-ink-300 sm:text-lg">
              Crie uma identidade visual marcante para a sua empresa, evento ou time.
              Um consultor acompanha o pedido do primeiro desenho até a entrega —
              você só escolhe o modelo.
            </p>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaButton>Solicitar orçamento</CtaButton>
              <CtaButton href="#modelos" variant="outline-light" icon="arrow">
                Ver os modelos
              </CtaButton>
            </div>
          </Reveal>

          <Reveal delay={0.45}>
            <dl className="mt-10 grid max-w-lg grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4 sm:gap-x-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-display text-2xl font-bold text-white">
                    {fact.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-ink-400">{fact.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Coluna da imagem */}
        <div className="relative flex justify-center lg:justify-end">
          <Reveal direction="right" delay={0.2} className="w-full">
            <div className="relative mx-auto w-full max-w-lg lg:mr-0">
              {/* Disco azul atrás do recorte */}
              <div className="absolute inset-x-4 bottom-0 top-10 rounded-t-full bg-gradient-to-b from-brand-600/60 via-brand-700/30 to-transparent blur-2xl" />
              <div className="absolute inset-x-10 bottom-0 top-16 rounded-t-full border border-white/10" />

              <Image
                src="/images/como-funciona-1-1.png"
                alt="Cliente usando um boné personalizado da Bonno"
                width={880}
                height={615}
                sizes="(max-width: 1024px) 90vw, 45vw"
                preload
                className="relative h-auto w-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
              />

              {/* Selos flutuantes sobre a foto */}
              <div className="absolute left-0 top-10 hidden animate-float rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md sm:block">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-1.5 text-xs font-medium text-white">
                  Avaliações reais de clientes
                </p>
              </div>

              <div
                className="absolute bottom-16 right-0 hidden animate-float rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md sm:block"
                style={{ animationDelay: '1.2s' }}
              >
                <p className="font-display text-lg font-bold text-white">
                  {site.minOrder} unidades
                </p>
                <p className="text-xs text-ink-300">para começar seu pedido</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
