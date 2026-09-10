'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import { A11y, Autoplay, Keyboard, Pagination } from 'swiper/modules';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import CtaButton from './CtaButton';
import { whatsappLink } from '@/lib/site';

const modelos = [
  {
    name: 'Trucker',
    image:
      '/images/WhatsApp-Image-2024-12-03-at-14.27.03-1-2-qyroijwjvq8fc5dfslb4v3y1tygnp5tnsm3trv39o8.jpeg',
  },
  {
    name: 'Americano',
    image:
      '/images/WhatsApp-Image-2024-12-03-at-14.28.25-4-qyroils89eazzdaphm4e03gz0q7e4k14gvesqf0hbs.jpeg',
  },
  {
    name: 'Americano aba reta',
    image:
      '/images/WhatsApp-Image-2024-12-03-at-14.29.06-2-qyroimq2g8caaz9cc4j0kl8fm42rc94ut02a7oz35k.jpeg',
  },
  {
    name: '6 gomos',
    image:
      '/images/WhatsApp-Image-2024-12-03-at-14.29.59-2-qyroinnwn2dkml7z6mxn52zw7hy4jy8l54proyxozc.jpeg',
  },
  {
    name: '6 gomos aba reta',
    image:
      '/images/WhatsApp-Image-2024-12-03-at-14.30.32-2-qyroiv6m5qnv7gx1yq6np13kykx29j2fu5xnj6mjlk.jpeg',
  },
  {
    name: 'Dad hat',
    image:
      '/images/WhatsApp-Image-2024-12-03-at-14.30.58-3-qyroja81738gd8b7iwoosxaygquxooq588df7m08u0.jpeg',
  },
  {
    name: 'Viseira',
    image:
      '/images/WhatsApp-Image-2024-12-03-at-14.31.18-1-2-qyrojb5vdx9qou9udf3bdf2f24qawdtvkd0wovyuns.jpeg',
  },
];

export default function Modelos() {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <section
      id="modelos"
      className="grain relative overflow-hidden bg-ink-950 py-20 md:py-28"
    >
      <div className="bg-grid absolute inset-0 opacity-70" />
      <div className="glow absolute -left-40 top-20 size-96 text-brand-600/16 [--glow-spread:11rem]" />
      <div className="glow absolute -right-40 bottom-0 size-96 text-brand-500/12 [--glow-spread:11rem]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <AnimatedSection animation="fadeInLeft">
            <SectionHeading
              align="left"
              tone="dark"
              eyebrow="Nossos modelos"
              title="Escolha o formato"
              highlight="do seu boné"
              description="Sete modelos para combinar com o estilo da sua marca — todos personalizados do jeito que você quiser."
            />
          </AnimatedSection>

          {/* Setas do carrossel */}
          <AnimatedSection animation="fadeInRight" delay={0.15}>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Modelo anterior"
                className="flex size-12 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:border-brand-400 hover:bg-brand-600 hover:text-white"
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Próximo modelo"
                className="flex size-12 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:border-brand-400 hover:bg-brand-600 hover:text-white"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <div className="mt-14 text-brand-400">
            <Swiper
              modules={[Pagination, Autoplay, Keyboard, A11y]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={20}
              slidesPerView={1.15}
              loop
              keyboard={{ enabled: true }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              breakpoints={{
                480: { slidesPerView: 1.6, spaceBetween: 20 },
                768: { slidesPerView: 2.4, spaceBetween: 24 },
                1024: { slidesPerView: 3.4, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 28 },
              }}
              className="bonno-swiper !overflow-visible !pb-14"
            >
              {modelos.map((modelo) => (
                <SwiperSlide key={modelo.name}>
                  <a
                    href={whatsappLink(
                      `Olá! Vim pelo site e me interessei pelo modelo ${modelo.name}. Pode me passar um orçamento?`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all duration-500 hover:border-brand-400/60 hover:shadow-glow"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={modelo.image}
                        alt={`Boné modelo ${modelo.name} personalizado`}
                        fill
                        sizes="(max-width: 480px) 85vw, (max-width: 768px) 45vw, (max-width: 1280px) 30vw, 22vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                      <span className="absolute right-4 top-4 flex size-10 translate-y-2 items-center justify-center rounded-full bg-brand-600 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 px-5 pb-5 pt-4">
                      <div>
                        <h3 className="font-display text-lg font-bold text-white">
                          {modelo.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-ink-400 transition-colors group-hover:text-brand-300">
                          Pedir orçamento deste modelo
                        </p>
                      </div>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={0.3}>
          <div className="mt-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
            <CtaButton>Solicitar um orçamento</CtaButton>
            <p className="text-sm text-ink-400">
              Não achou o que procurava? A gente encontra pra você.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
