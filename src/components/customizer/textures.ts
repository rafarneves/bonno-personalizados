import * as THREE from 'three';
import { canvasFont } from './fonts';

const MAX_IMAGE_SIDE = 1024;

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    image.src = src;
  });
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponível neste navegador.');
  return { canvas, ctx };
}

/** Relevo diagonal de sarja, usado como bump map no tecido. */
export function createTwillTexture() {
  const size = 128;
  const { canvas, ctx } = makeCanvas(size, size);
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);
  ctx.lineWidth = 3;
  for (let x = -size; x < size * 2; x += 8) {
    ctx.strokeStyle = '#a0a0a0';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + size, size);
    ctx.stroke();
    ctx.strokeStyle = '#646464';
    ctx.beginPath();
    ctx.moveTo(x + 4, 0);
    ctx.lineTo(x + 4 + size, size);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(22, 9);
  return texture;
}

/** Furos da tela do trucker, usados como alpha map (branco = tecido, preto = furo). */
export function createMeshTexture() {
  const size = 64;
  const { canvas, ctx } = makeCanvas(size, size);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#000000';
  for (const [x, y] of [
    [16, 16],
    [48, 48],
  ]) {
    ctx.beginPath();
    ctx.ellipse(x, y, 10, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(72, 20);
  return texture;
}

/** Desenha o texto recortado no tamanho exato das letras. */
export async function renderText(text: string, family: string, weight: string, color: string) {
  const fontSize = 180;
  const pad = 28;
  const font = await canvasFont(family, weight, fontSize);
  const content = text.trim() || ' ';

  const { ctx: measure } = makeCanvas(1, 1);
  measure.font = font;
  const metrics = measure.measureText(content);
  const ascent = Math.ceil(metrics.actualBoundingBoxAscent || fontSize * 0.8);
  const descent = Math.ceil(metrics.actualBoundingBoxDescent || fontSize * 0.25);
  const left = Math.ceil(metrics.actualBoundingBoxLeft || 0);
  const right = Math.ceil(metrics.actualBoundingBoxRight || metrics.width);
  const glyphWidth = Math.max(1, left + right);
  const scale = Math.min(1, (2048 - pad * 2) / glyphWidth);

  const width = Math.ceil(glyphWidth * scale + pad * 2);
  const height = Math.ceil((ascent + descent) * scale + pad * 2);
  const { canvas, ctx } = makeCanvas(width, height);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.translate(pad, pad);
  ctx.scale(scale, scale);
  ctx.fillText(content, left, ascent);
  return { canvas, aspect: width / height };
}

/** Moldura tracejada que marca a arte selecionada (some na hora de exportar). */
export function createSelectionCanvas(aspect: number) {
  const width = 512;
  const height = Math.round(THREE.MathUtils.clamp(width / aspect, 96, 1024));
  const { canvas, ctx } = makeCanvas(width, height);
  ctx.strokeStyle = '#0507ef';
  ctx.lineWidth = 8;
  ctx.setLineDash([26, 16]);
  ctx.beginPath();
  ctx.roundRect(6, 6, width - 12, height - 12, 18);
  ctx.stroke();
  return canvas;
}

/** Lê o arquivo enviado e reduz para no máximo 1024px, já em PNG. */
export async function readImageFile(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    // SVG sem largura/altura declaradas chega com 0: usa um tamanho padrão
    const naturalWidth = image.naturalWidth || MAX_IMAGE_SIDE;
    const naturalHeight = image.naturalHeight || MAX_IMAGE_SIDE;
    const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(naturalWidth, naturalHeight));
    const { canvas, ctx } = makeCanvas(
      Math.max(1, Math.round(naturalWidth * scale)),
      Math.max(1, Math.round(naturalHeight * scale))
    );
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Remove o fundo branco (opcional) e recorta as margens vazias da imagem. */
export async function processImage(original: string, removeWhite: boolean) {
  const image = await loadImage(original);
  const { width, height } = image;
  const { canvas, ctx } = makeCanvas(width, height);
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(0, 0, width, height);
  const px = data.data;

  if (removeWhite) {
    for (let i = 0; i < px.length; i += 4) {
      const lightest = Math.min(px[i], px[i + 1], px[i + 2]);
      if (lightest >= 245) px[i + 3] = 0;
      // Borda suave para não serrilhar o contorno do logo
      else if (lightest > 215) px[i + 3] = Math.round((px[i + 3] * (245 - lightest)) / 30);
    }
    ctx.putImageData(data, 0, 0);
  }

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (px[(y * width + x) * 4 + 3] > 12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return { src: canvas.toDataURL('image/png'), aspect: width / height };

  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;
  const pad = Math.round(Math.max(cropWidth, cropHeight) * 0.02);
  const out = makeCanvas(cropWidth + pad * 2, cropHeight + pad * 2);
  out.ctx.drawImage(canvas, minX, minY, cropWidth, cropHeight, pad, pad, cropWidth, cropHeight);
  return { src: out.canvas.toDataURL('image/png'), aspect: out.canvas.width / out.canvas.height };
}
