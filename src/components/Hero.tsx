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
      className="relative isolate flex min-h-[88vh] items-center overflow-hidden bg-ink-950 pb-16 pt-28 lg:min-h-[92vh] lg:pb-20 lg:pt-32"
    >
      {/* Foto real dos bonés sobre concreto — a textura do próprio material dá o fundo */}
      <div className="absolute inset-0 -z-10 bg-ink-950">
        {/* No desktop a foto entra como faixa na proporção original, ancorada embaixo,
            para os bonés aparecerem no tamanho em que foram fotografados. */}
        <div className="mask-fade-top absolute inset-x-0 bottom-0 top-0 md:top-auto md:aspect-[1640/664]">
          <Image
            src="/images/Novo-Projeto-2-1.png"
            alt=""
            fill
            sizes="100vw"
            preload
            className="object-cover object-[72%_center] brightness-110 contrast-105 md:object-bottom"
          />
        </div>

        {/* Escurece só o necessário: a esquerda para o texto ler, o topo para a navbar
            e a base para fundir na faixa azul. A foto fica limpa no meio. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/75 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-ink-950 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink-950/55 to-transparent" />

        {/* O azul da marca entra como brilho, não como filtro por cima da foto */}
        <div className="glow absolute -bottom-48 left-[8%] h-[26rem] w-[44rem] text-brand-600/20 [--glow-spread:14rem]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
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
              Bonés personalizados que{' '}
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
        </div>

        <Reveal delay={0.45}>
          <dl className="mt-14 grid max-w-lg grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4 sm:gap-x-4 lg:mt-20">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-display text-2xl font-bold text-white">{fact.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-ink-400">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Selos de vidro sobre a foto, só onde há espaço para eles */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute right-[6%] top-[26%] animate-float rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
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
          className="absolute bottom-[16%] right-[34%] animate-float rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md"
          style={{ animationDelay: '1.2s' }}
        >
          <p className="font-display text-lg font-bold text-white">
            {site.minOrder} unidades
          </p>
          <p className="text-xs text-ink-300">para começar seu pedido</p>
        </div>
      </div>
    </section>
  );
}
