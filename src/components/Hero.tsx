import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function Hero() {
  return (
    <section 
      id="principal" 
      className="relative pt-24 pb-0 overflow-hidden bg-zinc-950"
      style={{
        backgroundImage: "url('/images/Imagem-site-1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay to make text readable over the background image */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          
          {/* Text Content */}
          <div className="pb-12 md:pb-24 lg:pb-32">
            <AnimatedSection animation="fadeInUp" delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6 uppercase">
                Divulgue sua marca com <br className="hidden md:block" />
                <span className="relative inline-block">
                  <span className="relative z-10 text-white">Bonés Personalizados</span>
                  {/* Zigzag underline SVG approximation */}
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
                </span>
                <br />
                Exclusivos
              </h1>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Personalize seus bonés e crie uma identidade visual marcante para sua empresa ou evento. 
                Destaque sua marca, comece agora!
              </p>
            </AnimatedSection>

            <AnimatedSection animation="fadeInUp" delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#contato"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30 w-full sm:w-auto"
                >
                  Solicitar um orçamento
                </a>
              </div>
            </AnimatedSection>
          </div>

          {/* Image Content */}
          <div className="relative mt-10 lg:mt-0 w-full flex justify-center lg:justify-end">
            <AnimatedSection animation="fadeInRight" delay={0.2} className="w-full">
              <div className="w-full max-w-2xl mx-auto lg:mr-0 flex lg:justify-end">
                <Image
                  src="/images/como-funciona-1-1.png"
                  alt="Bonés Personalizados"
                  width={800}
                  height={552}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
                  priority
                />
              </div>
            </AnimatedSection>
          </div>

        </div>
      </div>
    </section>
  );
}
