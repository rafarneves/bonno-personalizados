'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Star } from 'lucide-react';
import 'swiper/css';
import AnimatedSection from './AnimatedSection';

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
    <section id="clientes" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInLeft" delay={0.1}>
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative inline-block">
              <span className="relative z-10">Nossos clientes</span>
              {/* Zigzag underline */}
              <svg
                className="absolute -bottom-1 left-0 w-full h-4 text-blue-600"
                viewBox="0 0 500 150"
                preserveAspectRatio="none"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
              >
                <path d="M.58,16s93-15.56,303-12c118,2,180,12,180,12"></path>
                <path d="M29.83,33.28S111.54,17.1,296.13,20.8c103.71,2.08,158.2,12.48,158.2,12.48"></path>
              </svg>
            </h2>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={false}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {clientes.map((cliente, index) => (
              <SwiperSlide key={index}>
                <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                  <div className="flex items-center mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-white shadow-sm">
                      <Image
                        src={cliente.image}
                        alt={cliente.name}
                        fill
                        sizes="(max-width: 640px) 100px, 100px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{cliente.name}</h4>
                      <p className="text-blue-600 font-medium text-sm">{cliente.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-600 italic flex-grow">
                    "{cliente.text}"
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </AnimatedSection>
      </div>
    </section>
  );
}
