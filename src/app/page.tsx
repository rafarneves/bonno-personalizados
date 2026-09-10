import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import ComoFunciona from '@/components/ComoFunciona';
import SaberMais from '@/components/SaberMais';
import Modelos from '@/components/Modelos';
import Clientes from '@/components/Clientes';
import Faq from '@/components/Faq';
import CtaBand from '@/components/CtaBand';
import Contato from '@/components/Contato';
import WhatsappFloat from '@/components/WhatsappFloat';
import RevealObserver from '@/components/RevealObserver';
import { faq } from '@/lib/faq';
import { site } from '@/lib/site';

/** Dados estruturados: ajudam o Google a mostrar a empresa e as dúvidas na busca. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${site.url}/#business`,
      name: site.name,
      description:
        'Fabricação de bonés personalizados sob encomenda para empresas, eventos, times e formaturas.',
      url: site.url,
      telephone: site.phoneE164,
      image: `${site.url}/images/Imagem-site-1.png`,
      logo: `${site.url}/images/Logo-3.png`,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address.street,
        addressLocality: `${site.address.city} - ${site.address.district}`,
        addressRegion: site.address.state,
        postalCode: site.address.zip,
        addressCountry: 'BR',
      },
      sameAs: [site.instagram],
    },
    {
      '@type': 'FAQPage',
      '@id': `${site.url}/#faq`,
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <ComoFunciona />
        <SaberMais />
        <Modelos />
        <Clientes />
        <Faq />
        <CtaBand />
      </main>
      <Contato />
      <WhatsappFloat />
      <RevealObserver />
    </>
  );
}
