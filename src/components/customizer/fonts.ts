import { Bebas_Neue, Pacifico, Playfair_Display } from 'next/font/google';
import type { FontId } from './types';

// Só são baixadas quando o cliente abre o seletor de fontes ou aplica uma delas
const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const pacifico = Pacifico({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });
const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap', preload: false });

export interface FontOption {
  label: string;
  weight: string;
  className: string;
  /** Família CSS. `var(--x)` é resolvido na hora de desenhar no canvas. */
  family: string;
}

export const FONT_OPTIONS: Record<FontId, FontOption> = {
  // Reaproveita a Outfit que o layout do site já carrega
  moderna: { label: 'Moderna', weight: '800', className: 'font-display', family: 'var(--font-outfit)' },
  impacto: { label: 'Impacto', weight: '400', className: bebas.className, family: bebas.style.fontFamily },
  cursiva: { label: 'Cursiva', weight: '400', className: pacifico.className, family: pacifico.style.fontFamily },
  classica: { label: 'Clássica', weight: '700', className: playfair.className, family: playfair.style.fontFamily },
};

export const FONT_ORDER: FontId[] = ['moderna', 'impacto', 'cursiva', 'classica'];

export const UI_FONTS = {
  heading: 'var(--font-outfit)',
  body: 'var(--font-inter)',
};

/** O canvas não entende `var(--x)`: troca pela família real que o next/font definiu. */
function resolveFamily(family: string) {
  const match = family.match(/^var\((--[\w-]+)\)$/);
  if (!match) return family;
  const value = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim();
  return value || 'sans-serif';
}

/** Monta a string `font` do canvas e garante que a fonte já foi baixada antes de desenhar. */
export async function canvasFont(family: string, weight: string, size: number) {
  const value = `${weight} ${size}px ${resolveFamily(family)}`;
  try {
    await document.fonts.load(value);
  } catch {
    // Sem a fonte, o navegador usa a de reserva — o desenho continua funcionando
  }
  return value;
}
