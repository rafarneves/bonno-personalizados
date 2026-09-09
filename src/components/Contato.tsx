import Image from 'next/image';
import { MapPin, Phone } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function Contato() {
  return (
    <footer id="contato" className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center mb-12">
          
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <AnimatedSection animation="fadeInLeft" delay={0.1}>
              <Image
                src="/images/Logo-3.png"
                alt="Bonno Personalizados"
                width={200}
                height={80}
                className="h-16 md:h-20 w-auto"
                style={{ width: 'auto' }}
              />
            </AnimatedSection>
          </div>

          {/* Address */}
          <div className="flex justify-center md:justify-start">
            <AnimatedSection animation="fadeInLeft" delay={0.2}>
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <p className="text-gray-600 leading-relaxed">
                  Rua Lúcia Viveiros, 255, Neópolis,<br />
                  Natal/RN<br />
                  CEP: 59.086-005
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Contact Info */}
          <div className="flex justify-center md:justify-start">
            <AnimatedSection animation="fadeInLeft" delay={0.3}>
              <div className="space-y-4">
                <a 
                  href="https://wa.me/5584998271330" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">(84) 99827-1330</span>
                </a>
                
                <a 
                  href="https://www.instagram.com/bonno_personalizados" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600 flex-shrink-0">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span className="font-medium">@bonno_personalizados</span>
                </a>
              </div>
            </AnimatedSection>
          </div>

        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Bonno Personalizados - Desenvolvido por Rafael Neves
          </p>
        </div>
      </div>
    </footer>
  );
}
