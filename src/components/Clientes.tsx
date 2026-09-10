'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import { Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';

const clientes = [
  {
    name: 'Maria Eduarda',
    role: 'Formatura',
    text: 'Os bonés acabaram de chegar. Ficaram perfeitos!!! Obrigada.',
    image: '/images/cliente-1.jpg',
  },
  {
    name: 'Júlio César',
    role: 'Clínica Veterinária',
    text: 'Boa tarde. Deu certo. Bonés tops. Parabéns pelo serviço, irei pedir mais vezes, com certeza!',
    image: '/images/cliente-2.jpg',
  },
  {
    name: 'Jully',
    role: 'Voleibol',
    text: 'Gostei muito do layout... Ain eu amei! Com certeza irei pedir com vocês.',
    image: '/images/cliente-3.jpg',
  },
];

export default function Clientes() {
  return (
    <section id="clientes" className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="bg-grid-light absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp">
          <SectionHeading
            eyebrow="Nossos clientes"
            title="Quem já pediu,"
            highlight="conta como foi"
            description="Mensagens que chegaram no nosso WhatsApp depois da entrega dos pedidos."
          />
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={0.15}>
          <div className="mt-14 text-brand-600">
            <Swiper
              modules={[Pagination, Autoplay, A11y]}
              spaceBetween={24}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="bonno-swiper !pb-14"
            >
              {clientes.map((cliente) => (
                <SwiperSlide key={cliente.name}>
                  <figure className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover">
                    {/* Aspas decorativas */}
                    <span
                      className="pointer-events-none absolute -right-2 -top-6 font-display text-[7rem] font-black leading-none text-brand-50 select-none"
                      aria-hidden="true"
                    >
                      &rdquo;
                    </span>

                    <div className="relative flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="size-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <blockquote className="relative mt-5 flex-1 text-base leading-relaxed text-ink-700">
                      &ldquo;{cliente.text}&rdquo;
                    </blockquote>

                    <figcaption className="relative mt-7 flex items-center gap-4 border-t border-ink-100 pt-6">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-brand-100">
                        <Image
                          src={cliente.image}
                          alt={cliente.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </span>
                      <span>
                        <span className="block font-display text-base font-bold text-ink-950">
                          {cliente.name}
                        </span>
                        <span className="block text-sm text-brand-600">{cliente.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
