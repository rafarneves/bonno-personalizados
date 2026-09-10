import type { AreaId, Colors, Layer, ModelId, PartId, SurfaceId, ViewId } from './types';

export interface CrownSpec {
  /** Altura da copa. */
  height: number;
  /** 2 = copa arredondada; valores maiores deixam a copa mais estruturada. */
  roundness: number;
  panels: 5 | 6;
  /** Laterais e traseira em tela (trucker). */
  meshBack: boolean;
}

export interface BillSpec {
  flat: boolean;
  length: number;
}

export interface CapModelSpec {
  id: ModelId;
  name: string;
  description: string;
  photo: string;
  /** `null` = viseira (sem copa). */
  crown: CrownSpec | null;
  bill: BillSpec;
  parts: PartId[];
  partLabels: Record<PartId, string>;
  areas: AreaId[];
}

const PART_LABELS: Record<PartId, string> = {
  frente: 'Frente',
  laterais: 'Laterais e traseira',
  aba: 'Aba',
  detalhes: 'Costuras e detalhes',
};

const CAP_PARTS: PartId[] = ['frente', 'laterais', 'aba', 'detalhes'];
const CAP_AREAS: AreaId[] = ['frente', 'lado-esquerdo', 'lado-direito', 'tras', 'aba'];

export const MODELS: Record<ModelId, CapModelSpec> = {
  trucker: {
    id: 'trucker',
    name: 'Trucker',
    description: 'Frente estruturada e tela respirável atrás.',
    photo:
      '/images/WhatsApp-Image-2024-12-03-at-14.27.03-1-2-qyroijwjvq8fc5dfslb4v3y1tygnp5tnsm3trv39o8.jpeg',
    crown: { height: 1.12, roundness: 2.5, panels: 5, meshBack: true },
    bill: { flat: false, length: 0.8 },
    parts: CAP_PARTS,
    partLabels: { ...PART_LABELS, laterais: 'Tela (laterais e traseira)' },
    areas: CAP_AREAS,
  },
  americano: {
    id: 'americano',
    name: 'Americano',
    description: 'Clássico de 5 gomos, frente lisa para a sua marca.',
    photo:
      '/images/WhatsApp-Image-2024-12-03-at-14.28.25-4-qyroils89eazzdaphm4e03gz0q7e4k14gvesqf0hbs.jpeg',
    crown: { height: 1.04, roundness: 2.4, panels: 5, meshBack: false },
    bill: { flat: false, length: 0.78 },
    parts: CAP_PARTS,
    partLabels: PART_LABELS,
    areas: CAP_AREAS,
  },
  'americano-aba-reta': {
    id: 'americano-aba-reta',
    name: 'Americano aba reta',
    description: 'Copa alta e aba reta, estilo snapback.',
    photo:
      '/images/WhatsApp-Image-2024-12-03-at-14.29.06-2-qyroimq2g8caaz9cc4j0kl8fm42rc94ut02a7oz35k.jpeg',
    crown: { height: 1.1, roundness: 2.6, panels: 5, meshBack: false },
    bill: { flat: true, length: 0.84 },
    parts: CAP_PARTS,
    partLabels: PART_LABELS,
    areas: CAP_AREAS,
  },
  'seis-gomos': {
    id: 'seis-gomos',
    name: '6 gomos',
    description: 'Seis gomos com costura central na frente.',
    photo:
      '/images/WhatsApp-Image-2024-12-03-at-14.29.59-2-qyroinnwn2dkml7z6mxn52zw7hy4jy8l54proyxozc.jpeg',
    crown: { height: 1.0, roundness: 2.25, panels: 6, meshBack: false },
    bill: { flat: false, length: 0.76 },
    parts: CAP_PARTS,
    partLabels: PART_LABELS,
    areas: CAP_AREAS,
  },
  'seis-gomos-aba-reta': {
    id: 'seis-gomos-aba-reta',
    name: '6 gomos aba reta',
    description: 'Seis gomos, copa alta e aba reta.',
    photo:
      '/images/WhatsApp-Image-2024-12-03-at-14.30.32-2-qyroiv6m5qnv7gx1yq6np13kykx29j2fu5xnj6mjlk.jpeg',
    crown: { height: 1.08, roundness: 2.5, panels: 6, meshBack: false },
    bill: { flat: true, length: 0.82 },
    parts: CAP_PARTS,
    partLabels: PART_LABELS,
    areas: CAP_AREAS,
  },
  'dad-hat': {
    id: 'dad-hat',
    name: 'Dad hat',
    description: 'Copa baixa e macia, visual casual.',
    photo:
      '/images/WhatsApp-Image-2024-12-03-at-14.30.58-3-qyroja81738gd8b7iwoosxaygquxooq588df7m08u0.jpeg',
    crown: { height: 0.84, roundness: 2, panels: 6, meshBack: false },
    bill: { flat: false, length: 0.74 },
    parts: CAP_PARTS,
    partLabels: PART_LABELS,
    areas: CAP_AREAS,
  },
  viseira: {
    id: 'viseira',
    name: 'Viseira',
    description: 'Só a faixa e a aba, ideal para esporte.',
    photo:
      '/images/WhatsApp-Image-2024-12-03-at-14.31.18-1-2-qyrojb5vdx9qou9udf3bdf2f24qawdtvkd0wovyuns.jpeg',
    crown: null,
    bill: { flat: false, length: 0.8 },
    parts: ['frente', 'aba', 'detalhes'],
    partLabels: { ...PART_LABELS, frente: 'Faixa' },
    areas: ['frente', 'lado-esquerdo', 'lado-direito', 'aba'],
  },
};

export const MODEL_ORDER: ModelId[] = [
  'trucker',
  'americano',
  'americano-aba-reta',
  'seis-gomos',
  'seis-gomos-aba-reta',
  'dad-hat',
  'viseira',
];

export const PALETTE = [
  { name: 'Preto', hex: '#16181d' },
  { name: 'Branco', hex: '#f4f4f1' },
  { name: 'Cinza mescla', hex: '#9a9ca3' },
  { name: 'Grafite', hex: '#3d4048' },
  { name: 'Azul marinho', hex: '#1b2a4a' },
  { name: 'Azul royal', hex: '#1f4fbf' },
  { name: 'Azul Bonno', hex: '#0507ef' },
  { name: 'Vermelho', hex: '#c4232b' },
  { name: 'Bordô', hex: '#6d1a2c' },
  { name: 'Verde militar', hex: '#4b5a3a' },
  { name: 'Verde bandeira', hex: '#1f7a45' },
  { name: 'Caqui', hex: '#c8b18a' },
  { name: 'Marrom', hex: '#6b4a32' },
  { name: 'Amarelo', hex: '#f2c230' },
  { name: 'Laranja', hex: '#e8702a' },
  { name: 'Rosa', hex: '#e79ab8' },
] as const;

export function colorName(hex: string) {
  const match = PALETTE.find((color) => color.hex.toLowerCase() === hex.toLowerCase());
  return match ? match.name : hex.toUpperCase();
}

export const DEFAULT_COLORS: Colors = {
  frente: '#16181d',
  laterais: '#16181d',
  aba: '#16181d',
  detalhes: '#3d4048',
};

export const AREA_LABELS: Record<AreaId, string> = {
  frente: 'Frente',
  'lado-esquerdo': 'Lado esquerdo',
  'lado-direito': 'Lado direito',
  tras: 'Traseira',
  aba: 'Aba',
};

export const VIEW_LABELS: Record<ViewId, string> = {
  destaque: '3D',
  frente: 'Frente',
  esquerda: 'Lado esq.',
  direita: 'Lado dir.',
  tras: 'Trás',
  aba: 'Aba',
};

export interface AreaPreset {
  surface: SurfaceId;
  u: number;
  v: number;
  view: ViewId;
}

/** Posição inicial de uma arte em cada área. Esquerdo e direito são de quem usa o boné. */
export function areaPreset(model: CapModelSpec, area: AreaId): AreaPreset {
  if (area === 'aba') return { surface: 'aba', u: 0, v: 0.55, view: 'aba' };
  const visor = model.crown === null;
  const surface: SurfaceId = visor ? 'faixa' : 'copa';
  switch (area) {
    case 'lado-esquerdo':
      return { surface, u: visor ? 75 : 90, v: 0.5, view: 'esquerda' };
    case 'lado-direito':
      return { surface, u: visor ? -75 : -90, v: 0.5, view: 'direita' };
    case 'tras':
      return { surface, u: 180, v: 0.66, view: 'tras' };
    case 'frente':
    default:
      return { surface, u: 0, v: visor ? 0.5 : 0.55, view: 'frente' };
  }
}

/** Em qual área a arte está hoje, para mostrar no resumo e no mockup. */
export function areaOf(layer: Pick<Layer, 'surface' | 'u'>): AreaId {
  if (layer.surface === 'aba') return 'aba';
  const u = ((((layer.u + 180) % 360) + 360) % 360) - 180;
  if (Math.abs(u) <= 45) return 'frente';
  if (u > 45 && u <= 135) return 'lado-esquerdo';
  if (u < -45 && u >= -135) return 'lado-direito';
  return 'tras';
}

export interface SurfaceRange {
  u: [number, number];
  v: [number, number];
  uStep: number;
}

export const SURFACE_RANGES: Record<SurfaceId, SurfaceRange> = {
  copa: { u: [-180, 180], v: [0.08, 0.9], uStep: 1 },
  aba: { u: [-0.85, 0.85], v: [0.12, 0.88], uStep: 0.01 },
  faixa: { u: [-110, 110], v: [0.2, 0.8], uStep: 1 },
};

export const MAX_LAYERS = 8;
