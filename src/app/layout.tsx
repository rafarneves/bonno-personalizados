import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { site } from '@/lib/site';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const description =
  'Bonés personalizados sob encomenda para empresas, eventos, times e formaturas. Modelos trucker, americano, dad hat e viseira, a partir de 30 unidades. Peça seu orçamento pelo WhatsApp.';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'Bonés Personalizados sob Encomenda | Bonno Personalizados',
    template: `%s | ${site.name}`,
  },
  description,
  keywords: [
    'bonés personalizados',
    'boné personalizado',
    'bonés sob encomenda',
    'boné bordado personalizado',
    'bonés para empresas',
    'bonés para formatura',
    'boné trucker personalizado',
    'dad hat personalizado',
    'bonés personalizados Natal RN',
    'brindes personalizados',
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: 'business',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Bonés Personalizados sob Encomenda | Bonno Personalizados',
    description,
    url: site.url,
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
  twitter: {
    card: 'summary_large_image',
    title: 'Bonés Personalizados sob Encomenda | Bonno Personalizados',
    description,
    images: ['/images/Imagem-site-1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0507ef',
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="overflow-x-hidden bg-white font-sans text-ink-900 antialiased">
        {children}
      </body>
    </html>
  );
}
