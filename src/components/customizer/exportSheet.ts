import { site } from '@/lib/site';
import { FONT_OPTIONS, UI_FONTS, canvasFont } from './fonts';
import { AREA_LABELS, MODELS, areaOf, colorName } from './models';
import { loadImage } from './textures';
import type { CapturedViews, Design, Layer, OrderInfo, ViewId } from './types';

const WIDTH = 2400;
const HEIGHT = 1500;
const MARGIN = 80;
const INK = '#06070f';
const MUTED = '#656d8c';
const LINE = '#e4e6ef';
const PANEL = '#f3f4f8';
const BRAND = '#0507ef';

type Ctx = CanvasRenderingContext2D;

async function drawContained(ctx: Ctx, src: string | undefined, x: number, y: number, w: number, h: number) {
  if (!src) return;
  const image = await loadImage(src);
  const scale = Math.min(w / image.width, h / image.height);
  const dw = image.width * scale;
  const dh = image.height * scale;
  ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function panel(ctx: Ctx, x: number, y: number, w: number, h: number, radius: number) {
  ctx.fillStyle = PANEL;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
}

function wrapLines(ctx: Ctx, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  let used = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    } else {
      line = test;
    }
    used++;
  }
  if (lines.length < maxLines && line) {
    lines.push(line);
    used = words.length;
  }
  if (used < words.length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[\s,.;:]+$/, '')}…`;
  }
  return lines;
}

function describeLayer(layer: Layer) {
  const area = AREA_LABELS[areaOf(layer)];
  if (layer.kind === 'text') {
    return `Texto “${layer.text.trim()}” · fonte ${FONT_OPTIONS[layer.font].label} · ${colorName(layer.color)} · ${area}`;
  }
  return `Imagem “${layer.name}” · ${area}`;
}

export function pickSideView(design: Design): ViewId {
  const areas = design.layers.map(areaOf);
  return areas.includes('lado-direito') && !areas.includes('lado-esquerdo') ? 'direita' : 'esquerda';
}

interface SheetOptions {
  views: CapturedViews;
  design: Design;
  info: OrderInfo;
  sideView: ViewId;
}

/** Monta a ficha do mockup: vista 3D grande, três vistas menores e o resumo do pedido. */
export async function buildSheet({ views, design, info, sideView }: SheetOptions) {
  const [heading, headingSmall, body, bodyBold, bodySmall, label] = await Promise.all([
    canvasFont(UI_FONTS.heading, '700', 46),
    canvasFont(UI_FONTS.heading, '700', 38),
    canvasFont(UI_FONTS.body, '400', 26),
    canvasFont(UI_FONTS.body, '600', 24),
    canvasFont(UI_FONTS.body, '400', 22),
    canvasFont(UI_FONTS.body, '600', 20),
  ]);

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponível neste navegador.');
  const model = MODELS[design.model];

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.textBaseline = 'alphabetic';

  // Cabeçalho
  try {
    const icon = await loadImage('/images/icone-bonno-300x300.png');
    ctx.drawImage(icon, MARGIN, 52, 76, 76);
  } catch {
    // Sem o ícone, o nome da marca continua no cabeçalho
  }
  ctx.fillStyle = INK;
  ctx.font = heading;
  ctx.fillText(site.name, MARGIN + 98, 100);
  ctx.fillStyle = MUTED;
  ctx.font = body;
  ctx.fillText('Mockup do seu boné personalizado', MARGIN + 100, 140);

  const now = new Date();
  const stamp = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  ctx.textAlign = 'right';
  ctx.font = bodySmall;
  ctx.fillText(`Gerado em ${stamp}`, WIDTH - MARGIN, 96);
  ctx.fillStyle = BRAND;
  ctx.font = headingSmall;
  ctx.fillText(model.name, WIDTH - MARGIN, 142);
  ctx.textAlign = 'left';
  ctx.fillStyle = LINE;
  ctx.fillRect(MARGIN, 180, WIDTH - MARGIN * 2, 2);

  // Vista principal
  const main = { x: MARGIN, y: 220, w: 1360, h: 1100 };
  panel(ctx, main.x, main.y, main.w, main.h, 36);
  await drawContained(ctx, views.destaque, main.x + 40, main.y + 40, main.w - 80, main.h - 80);

  // Vistas menores
  const columnX = main.x + main.w + 60;
  const columnW = WIDTH - MARGIN - columnX;
  const gap = 24;
  const boxSize = (columnW - gap * 2) / 3;
  const small: [ViewId, string][] = [
    ['frente', 'Frente'],
    [sideView, sideView === 'direita' ? 'Lado direito' : 'Lado esquerdo'],
    ['tras', 'Traseira'],
  ];
  ctx.textAlign = 'center';
  for (const [index, [view, title]] of small.entries()) {
    const x = columnX + index * (boxSize + gap);
    panel(ctx, x, main.y, boxSize, boxSize, 24);
    await drawContained(ctx, views[view], x + 12, main.y + 12, boxSize - 24, boxSize - 24);
    ctx.fillStyle = MUTED;
    ctx.font = bodyBold;
    ctx.fillText(title, x + boxSize / 2, main.y + boxSize + 40);
  }
  ctx.textAlign = 'left';

  // Resumo
  const limit = main.y + main.h;
  let y = main.y + boxSize + 110;
  const sectionTitle = (text: string) => {
    ctx.fillStyle = BRAND;
    ctx.font = label;
    ctx.fillText(text.toUpperCase(), columnX, y);
    y += 42;
  };
  const writeLine = (text: string, font = body, color = INK, indent = 0) => {
    if (y > limit) return false;
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, columnX + indent, y);
    y += 38;
    return true;
  };

  sectionTitle('Modelo');
  ctx.fillStyle = INK;
  ctx.font = headingSmall;
  ctx.fillText(model.name, columnX, y + 6);
  y += 66;

  sectionTitle('Cores');
  for (const part of model.parts) {
    const hex = design.colors[part];
    ctx.beginPath();
    ctx.arc(columnX + 15, y - 9, 15, 0, Math.PI * 2);
    ctx.fillStyle = hex;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c9ccda';
    ctx.stroke();
    writeLine(`${model.partLabels[part]}: ${colorName(hex)}`, body, INK, 46);
    y += 4;
  }
  y += 18;

  sectionTitle('Artes');
  if (design.layers.length === 0) {
    writeLine('Sem artes aplicadas', body, MUTED);
  } else {
    ctx.font = body;
    for (const layer of design.layers) {
      const lines = wrapLines(ctx, describeLayer(layer), columnW - 30, 2);
      lines.forEach((line, index) => writeLine(`${index === 0 ? '•' : ' '} ${line}`));
    }
  }

  const hasInfo = info.nome.trim() || info.quantidade.trim() || info.observacoes.trim();
  if (hasInfo && y < limit - 80) {
    y += 18;
    sectionTitle('Pedido');
    if (info.nome.trim()) writeLine(`Nome: ${info.nome.trim()}`);
    if (info.quantidade.trim()) writeLine(`Quantidade: ${info.quantidade.trim()} unidades`);
    if (info.observacoes.trim()) {
      ctx.font = body;
      wrapLines(ctx, `Observações: ${info.observacoes.trim()}`, columnW, 3).forEach((line) => writeLine(line));
    }
  }

  // Rodapé
  ctx.fillStyle = LINE;
  ctx.fillRect(MARGIN, 1360, WIDTH - MARGIN * 2, 2);
  ctx.fillStyle = MUTED;
  ctx.font = bodySmall;
  ctx.fillText(
    'Mockup ilustrativo: cores, tamanhos e posições são aproximados e serão confirmados com um consultor antes da produção.',
    MARGIN,
    1420
  );
  ctx.textAlign = 'right';
  ctx.fillStyle = INK;
  ctx.font = bodyBold;
  ctx.fillText(`WhatsApp ${site.phoneDisplay}  ·  ${site.instagramHandle}`, WIDTH - MARGIN, 1420);
  ctx.fillStyle = MUTED;
  ctx.font = bodySmall;
  ctx.fillText(site.url.replace(/^https?:\/\//, ''), WIDTH - MARGIN, 1458);
  ctx.textAlign = 'left';

  return canvas;
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function downloadPng(canvas: HTMLCanvasElement, filename: string) {
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('Falha ao gerar a imagem.'))), 'image/png')
  );
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function downloadPdf(canvas: HTMLCanvasElement, filename: string, title: string) {
  // O jsPDF só é baixado quando o cliente pede o PDF
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 8;
  const width = pageWidth - margin * 2;
  const height = (width * canvas.height) / canvas.width;
  doc.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', margin, (pageHeight - height) / 2, width, height);
  doc.setProperties({ title, subject: 'Mockup de boné personalizado', author: site.name, creator: site.name });
  doc.save(filename);
}

export function exportFileName(design: Design, extension: 'png' | 'pdf') {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
  return `mockup-bonno-${design.model}-${stamp}.${extension}`;
}
