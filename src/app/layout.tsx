import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bonnopersonalizados.com"),
  title: "Bonno Personalizados",
  description: "Bonés estilosos e de alta qualidade que agregam valor à sua marca",
  openGraph: {
    title: "Bonno Personalizados",
    description: "Bonés estilosos e de alta qualidade que agregam valor à sua marca",
    url: "https://bonnopersonalizados.com/",
    siteName: "Bonno Personalizados",
    images: [
      {
        url: "/images/Imagem-site-1.png",
        width: 696,
        height: 696,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} scroll-smooth`}>
      <body className="antialiased font-sans bg-white text-slate-900 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
