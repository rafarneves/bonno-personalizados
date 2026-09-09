import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function ComoFunciona() {
  const steps = [
    'Clica em "solicitar orçamento"',
    'Um consultor vai entrar em contato pelo WhatsApp',
    'É hora da fabricação',
    'Receba o pedido em seu endereço',
  ];

  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <AnimatedSection animation="fadeInDown" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 relative inline-block">
              <span className="relative z-10">Como funciona</span>
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
          </AnimatedSection>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 w-full order-2 md:order-1">
            <AnimatedSection animation="fadeInLeft" delay={0.2}>
              <ul className="space-y-6 mb-10">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <CheckCircle2 className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <span className="text-lg text-gray-700 font-medium">{step}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection animation="fadeInLeft" delay={0.3}>
              <a
                href="https://wa.me/message/RYCRUU3DJLS2P1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Solicitar um orçamento
              </a>
            </AnimatedSection>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full max-w-sm md:max-w-md mx-auto order-1 md:order-2">
            <AnimatedSection animation="fadeInRight" delay={0.4} className="w-full">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/WhatsApp-Image-2024-12-03-at-14.28.25-1.jpeg"
                  alt="Como funciona"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
