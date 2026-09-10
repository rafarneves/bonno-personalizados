import type { Metadata } from 'next';
import CustomizerApp from '@/components/customizer/CustomizerApp';
import { site } from '@/lib/site';

const title = 'Personalizador 3D de bonés';
const description =
  'Monte o seu boné personalizado em 3D: escolha o modelo e as cores, aplique texto e logo e baixe o mockup em imagem ou PDF para enviar pelo WhatsApp.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/personalizar',
  },
  openGraph: {
    title: `${title} | ${site.name}`,
    description,
    url: `${site.url}/personalizar`,
    siteName: site.name,
    images: [
      {
        url: '/images/Imagem-site-1.png',
        width: 696,
        height: 696,
        alt: 'Bonés personalizados produzidos pela Bonno',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function PersonalizarPage() {
  return <CustomizerApp />;
}
