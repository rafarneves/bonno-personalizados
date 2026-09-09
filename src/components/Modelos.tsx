'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import AnimatedSection from './AnimatedSection';

const modelos = [
  {
    name: 'Trucker',
    image: '/images/WhatsApp-Image-2024-12-03-at-14.27.03-1-2-qyroijwjvq8fc5dfslb4v3y1tygnp5tnsm3trv39o8.jpeg',
  },
  {
    name: 'Americano',
    image: '/images/WhatsApp-Image-2024-12-03-at-14.28.25-4-qyroils89eazzdaphm4e03gz0q7e4k14gvesqf0hbs.jpeg',
  },
  {
    name: 'Americano - Aba Reta',
    image: '/images/WhatsApp-Image-2024-12-03-at-14.29.06-2-qyroimq2g8caaz9cc4j0kl8fm42rc94ut02a7oz35k.jpeg',
  },
  {
    name: '6 gomos',
    image: '/images/WhatsApp-Image-2024-12-03-at-14.29.59-2-qyroinnwn2dkml7z6mxn52zw7hy4jy8l54proyxozc.jpeg',
  },
  {
    name: '6 gomos - aba reta',
    image: '/images/WhatsApp-Image-2024-12-03-at-14.30.32-2-qyroiv6m5qnv7gx1yq6np13kykx29j2fu5xnj6mjlk.jpeg',
  },
  {
    name: 'Dad hat',
    image: '/images/WhatsApp-Image-2024-12-03-at-14.30.58-3-qyroja81738gd8b7iwoosxaygquxooq588df7m08u0.jpeg',
  },
  {
    name: 'Viseira',
    image: '/images/WhatsApp-Image-2024-12-03-at-14.31.18-1-2-qyrojb5vdx9qou9udf3bdf2f24qawdtvkd0wovyuns.jpeg',
  },
];

export default function Modelos() {
  return (
    <section id="modelos" className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInLeft" delay={0.1}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative inline-block">
              <span className="relative z-10">Nossos modelos</span>
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
          <div className="relative px-4 md:px-12">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="modelos-swiper !pb-10"
            >
              {modelos.map((modelo, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-col items-center group">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl">
                      <Image
                        src={modelo.image}
                        alt={modelo.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 text-center">
                      {modelo.name}
                    </h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fadeInLeft" delay={0.3} className="mt-12 text-center">
          <a
            href="https://wa.me/message/RYCRUU3DJLS2P1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Solicitar um orçamento
          </a>
        </AnimatedSection>
      </div>

      <style jsx global>{`
        .modelos-swiper .swiper-button-next,
        .modelos-swiper .swiper-button-prev {
          color: #2563eb;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .modelos-swiper .swiper-button-next:after,
        .modelos-swiper .swiper-button-prev:after {
          font-size: 20px;
        }
      `}</style>
    </section>
  );
}
