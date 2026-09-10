import { MapPin, Phone } from 'lucide-react';
import Logo from './Logo';
import CtaButton from './CtaButton';
import AnimatedSection from './AnimatedSection';
import { InstagramIcon, WhatsappIcon } from './icons';
import { navLinks, site, whatsappLink } from '@/lib/site';

const fullAddress = `${site.address.street}, ${site.address.district}, ${site.address.city}/${site.address.state}, ${site.address.zip}`;
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

export default function Contato() {
  return (
    <footer id="contato" className="grain relative overflow-hidden bg-ink-950 pt-20">
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="absolute -left-40 top-0 size-96 rounded-full bg-brand-600/20 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp">
          <div className="grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
            {/* Marca */}
            <div>
              <Logo tone="dark" />
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-400">
                Bonés personalizados sob encomenda para empresas, eventos, times e
                formaturas. Da criação do layout à entrega, com acompanhamento de um
                consultor.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp da Bonno Personalizados"
                  className="flex size-11 items-center justify-center rounded-full border border-white/10 text-white transition-all hover:border-brand-400 hover:bg-brand-600"
                >
                  <WhatsappIcon className="size-5" />
                </a>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram da Bonno Personalizados"
                  className="flex size-11 items-center justify-center rounded-full border border-white/10 text-white transition-all hover:border-brand-400 hover:bg-brand-600"
                >
                  <InstagramIcon className="size-5" />
                </a>
              </div>
            </div>

            {/* Navegação */}
            <nav aria-label="Rodapé">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
                Navegação
              </h2>
              <ul className="mt-6 space-y-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-400 transition-colors hover:text-brand-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contato */}
            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
                Contato
              </h2>
              <ul className="mt-6 space-y-5">
                <li>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 text-sm leading-relaxed text-ink-400 transition-colors hover:text-white"
                  >
                    <MapPin className="mt-0.5 size-5 shrink-0 text-brand-400" />
                    <span>
                      {site.address.street}, {site.address.district}
                      <br />
                      {site.address.city}/{site.address.state} · CEP {site.address.zip}
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-sm font-medium text-ink-300 transition-colors hover:text-white"
                  >
                    <Phone className="size-5 shrink-0 text-brand-400" />
                    {site.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-sm font-medium text-ink-300 transition-colors hover:text-white"
                  >
                    <InstagramIcon className="size-5 shrink-0 text-brand-400" />
                    {site.instagramHandle}
                  </a>
                </li>
              </ul>

              <div className="mt-8">
                <CtaButton size="md">Solicitar orçamento</CtaButton>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-8 text-center text-xs text-ink-500 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
          <p>Desenvolvido por Rafael Neves</p>
        </div>
      </div>
    </footer>
  );
}
