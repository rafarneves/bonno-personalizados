import Image from 'next/image';
import { Calendar, Truck, ShoppingCart, CreditCard } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function SaberMais() {
  const items = [
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      text: 'Nosso prazo de fabricação é de 20 dias úteis',
    },
    {
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      text: 'Nosso prazo de entrega é de 7 dias úteis',
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-blue-600" />,
      text: 'Pedido mínimo: 30 unidades',
    },
    {
      icon: <CreditCard className="w-8 h-8 text-blue-600" />,
      text: 'Aceitamos pagamentos via pix, boleto e cartão',
    },
  ];

  return (
    <section id="saber-mais" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Image */}
          <div className="flex-1 w-full max-w-sm md:max-w-md mx-auto">
            <AnimatedSection animation="fadeInUp" delay={0.2} className="w-full">
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src="/images/homem-segurando-celular.png"
                  alt="Homem segurando celular"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
              </div>
            </AnimatedSection>
          </div>

          {/* Right Content */}
          <div className="flex-1 w-full">
            <AnimatedSection animation="fadeInRight" delay={0.3}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 relative inline-block">
                <span className="relative z-10">O que preciso saber?</span>
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

            <AnimatedSection animation="fadeInRight" delay={0.4}>
              <ul className="space-y-8 mb-12">
                {items.map((item, index) => (
                  <li key={index} className="flex items-center space-x-6">
                    <div className="flex-shrink-0 bg-blue-50 p-4 rounded-full">
                      {item.icon}
                    </div>
                    <span className="text-xl text-gray-700 font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection animation="fadeInRight" delay={0.5}>
              <div className="text-center md:text-left">
                <a
                  href="https://wa.me/message/RYCRUU3DJLS2P1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-full hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Solicitar um orçamento
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
