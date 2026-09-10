import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { BillSpec, CapModelSpec, CrownSpec } from './models';
import type { SurfaceId } from './types';

/*
 * O boné é gerado por código, sem arquivo 3D: a copa é uma superelipse dividida em gomos,
 * a aba é uma superfície curva e a viseira é uma faixa. Frente = +z, topo = +y.
 * "Esquerdo" é o lado esquerdo de quem usa o boné (+x).
 */

export const RX = 1;
export const RZ = 1.08;

const TAU = Math.PI * 2;
const ARCH_HALF = 0.42; // meia-abertura do recorte traseiro, em radianos
const ARCH_DROP = 0.2; // altura do recorte traseiro
const TOP_BACK_SHIFT = 0.12; // o topo da copa recua um pouco, como num boné real
const BILL_HALF_ANGLE = 1.32;
const BILL_THICKNESS = 0.035;
const BAND_HEIGHT = 0.34;
const BAND_GAP = 0.5;

export interface SurfaceFrame {
  position: THREE.Vector3;
  normal: THREE.Vector3;
}

type Sampler = (a: number, b: number, out: THREE.Vector3) => THREE.Vector3;

function angleDistance(a: number, b: number) {
  const d = Math.abs(a - b) % TAU;
  return d > Math.PI ? TAU - d : d;
}

function wrapAngle(angle: number) {
  return THREE.MathUtils.euclideanModulo(angle + Math.PI, TAU) - Math.PI;
}

/** Limite inferior da copa: a base fica na horizontal, exceto no recorte traseiro. */
function thetaLimit(phi: number) {
  const d = angleDistance(phi, Math.PI);
  if (d >= ARCH_HALF) return Math.PI / 2;
  return Math.PI / 2 - ARCH_DROP * Math.sqrt(1 - (d / ARCH_HALF) ** 2);
}

/** Ponto da copa. `phi` = ângulo em volta (0 = frente); `t` = 0 no topo e 1 na base. */
export function crownPoint(spec: CrownSpec, phi: number, t: number, out = new THREE.Vector3(), bulge = 0) {
  const theta = THREE.MathUtils.clamp(t, 0, 1) * thetaLimit(phi);
  const exponent = 2 / spec.roundness;
  const radius = Math.pow(Math.sin(theta), exponent) * (1 + bulge);
  const height = Math.pow(Math.cos(theta), exponent);
  return out.set(
    RX * radius * Math.sin(phi),
    spec.height * height * (1 + 0.05 * Math.cos(phi)) * (1 + bulge * 0.4),
    RZ * radius * Math.cos(phi) - TOP_BACK_SHIFT * height
  );
}

/** Ponto da aba. `u` de -1 a 1 na largura; `v` = 0 junto à copa e 1 na ponta. */
export function billPoint(spec: BillSpec, u: number, v: number, out = new THREE.Vector3()) {
  const phi = u * BILL_HALF_ANGLE;
  const taper = Math.pow(Math.max(0, Math.cos((u * Math.PI) / 2)), 0.6);
  const innerX = RX * 0.995 * Math.sin(phi);
  const innerZ = RZ * 0.995 * Math.cos(phi);
  const outerX = (RX + 0.06 * taper) * Math.sin(phi) * (1 + 0.04 * taper);
  const outerZ = (RZ + spec.length * taper) * Math.cos(phi);
  const x = innerX + (outerX - innerX) * v;
  const z = innerZ + (outerZ - innerZ) * v;
  const reach = v * taper;
  const curve = spec.flat ? 0.03 : 0.46;
  const droop = spec.flat ? 0.05 : 0.12;
  return out.set(x, 0.012 - curve * x * x * Math.pow(reach, 0.85) - droop * reach, z);
}

/** Ponto da faixa da viseira. `v` = 0 embaixo e 1 em cima. */
export function bandPoint(phi: number, v: number, out = new THREE.Vector3()) {
  return out.set(RX * 1.005 * Math.sin(phi), 0.01 + v * BAND_HEIGHT, RZ * 1.005 * Math.cos(phi) - 0.04 * v);
}

function frameAt(sample: Sampler, a: number, b: number, outward: (p: THREE.Vector3) => THREE.Vector3): SurfaceFrame {
  const eps = 1e-3;
  const position = sample(a, b, new THREE.Vector3());
  const da = sample(a + eps, b, new THREE.Vector3()).sub(sample(a - eps, b, new THREE.Vector3()));
  const db = sample(a, b + eps, new THREE.Vector3()).sub(sample(a, b - eps, new THREE.Vector3()));
  const normal = new THREE.Vector3().crossVectors(da, db).normalize();
  if (normal.dot(outward(position)) < 0) normal.negate();
  return { position, normal };
}

export function crownFrame(spec: CrownSpec, phi: number, t: number) {
  return frameAt(
    (a, b, out) => crownPoint(spec, a, b, out),
    phi,
    THREE.MathUtils.clamp(t, 0.03, 0.99),
    (p) => new THREE.Vector3(p.x, p.y * 0.8 + 0.2, p.z + TOP_BACK_SHIFT)
  );
}

export function billFrame(spec: BillSpec, u: number, v: number) {
  return frameAt(
    (a, b, out) => billPoint(spec, a, b, out),
    THREE.MathUtils.clamp(u, -0.98, 0.98),
    THREE.MathUtils.clamp(v, 0.01, 0.99),
    () => new THREE.Vector3(0, 1, 0)
  );
}

export function bandFrame(phi: number, v: number) {
  return frameAt(
    (a, b, out) => bandPoint(a, b, out),
    phi,
    THREE.MathUtils.clamp(v, 0.01, 0.99),
    (p) => new THREE.Vector3(p.x, 0, p.z)
  );
}

/**
 * Malha regular a partir de uma função de amostragem.
 * `flip` inverte o sentido dos triângulos quando a linha `j` cresce para cima.
 */
function gridGeometry(
  cols: number,
  rows: number,
  sample: (i: number, j: number, out: THREE.Vector3) => void,
  uv: (i: number, j: number) => [number, number],
  flip = false
) {
  const count = (cols + 1) * (rows + 1);
  const positions = new Float32Array(count * 3);
  const uvs = new Float32Array(count * 2);
  const point = new THREE.Vector3();
  let p = 0;
  let q = 0;
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      sample(i, j, point);
      positions[p++] = point.x;
      positions[p++] = point.y;
      positions[p++] = point.z;
      const [a, b] = uv(i, j);
      uvs[q++] = a;
      uvs[q++] = b;
    }
  }
  const indices: number[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = j * (cols + 1) + i;
      const b = a + 1;
      const c = a + cols + 1;
      const d = c + 1;
      if (flip) indices.push(a, b, c, b, d, c);
      else indices.push(a, c, b, b, c, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function tube(points: THREE.Vector3[], radius: number, radialSegments = 6) {
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.TubeGeometry(curve, Math.max(12, points.length * 3), radius, radialSegments, false);
}

function merge(geometries: THREE.BufferGeometry[]) {
  const merged = mergeGeometries(geometries, false);
  geometries.forEach((geometry) => geometry.dispose());
  if (!merged) throw new Error('Não foi possível montar o modelo do boné.');
  return merged;
}

interface PanelDef {
  from: number;
  to: number;
  /** 0 = frente, 1 = laterais e traseira */
  part: 0 | 1;
  eyelet: boolean;
}

function panelsFor(spec: CrownSpec): PanelDef[] {
  const deg = Math.PI / 180;
  const list: [number, number, 0 | 1, boolean][] =
    spec.panels === 5
      ? [
          [-60, 60, 0, false],
          [60, 120, 1, true],
          [120, 180, 1, false],
          [-180, -120, 1, false],
          [-120, -60, 1, true],
        ]
      : [
          [-60, 0, 0, true],
          [0, 60, 0, true],
          [60, 120, 1, true],
          [120, 180, 1, true],
          [-180, -120, 1, true],
          [-120, -60, 1, true],
        ];
  return list.map(([from, to, part, eyelet]) => ({ from: from * deg, to: to * deg, part, eyelet }));
}

export interface CrownParts {
  /** Grupos de material: 0 = frente, 1 = laterais e traseira. */
  shell: THREE.BufferGeometry;
  seams: THREE.BufferGeometry;
  hardware: THREE.BufferGeometry;
  strap: THREE.BufferGeometry;
}

export function buildCrown(spec: CrownSpec): CrownParts {
  const panels = panelsFor(spec);
  const rows = 40;

  const shells = panels.map((panel) => {
    const span = panel.to - panel.from;
    const cols = Math.max(8, Math.round((span / (Math.PI / 3)) * 24));
    return gridGeometry(
      cols,
      rows,
      (i, j, out) => {
        const s = i / cols;
        const t = j / rows;
        // Cada gomo estufa levemente no meio, como tecido costurado
        const bulge = 0.022 * Math.sin(Math.PI * s) * Math.sin(Math.PI * Math.min(1, t * 1.15));
        crownPoint(spec, panel.from + span * s, t, out, bulge);
      },
      (i, j) => [(panel.from + span * (i / cols) + Math.PI) / TAU, 1 - j / rows]
    );
  });
  const shell = mergeGeometries(shells, true);
  shells.forEach((geometry) => geometry.dispose());
  if (!shell) throw new Error('Não foi possível montar a copa do boné.');
  shell.groups.forEach((group, index) => {
    group.materialIndex = panels[index].part;
  });

  const lifted = (phi: number, t: number, lift: number) => {
    const frame = crownFrame(spec, phi, t);
    return frame.position.add(frame.normal.multiplyScalar(lift));
  };

  // Costuras entre os gomos, com pesponto duplo
  const seams: THREE.BufferGeometry[] = [];
  for (const panel of panels) {
    const main: THREE.Vector3[] = [];
    const left: THREE.Vector3[] = [];
    const right: THREE.Vector3[] = [];
    for (let k = 0; k <= 18; k++) {
      const t = 0.05 + (0.94 * k) / 18;
      main.push(lifted(panel.from, t, 0.004));
      if (t > 0.12) {
        left.push(lifted(panel.from - 0.03, t, 0.003));
        right.push(lifted(panel.from + 0.03, t, 0.003));
      }
    }
    seams.push(tube(main, 0.006), tube(left, 0.0028, 4), tube(right, 0.0028, 4));
  }

  // Ilhoses, botão do topo e viés do recorte traseiro
  const hardware: THREE.BufferGeometry[] = [];
  const zAxis = new THREE.Vector3(0, 0, 1);
  for (const panel of panels) {
    if (!panel.eyelet || spec.meshBack) continue;
    const frame = crownFrame(spec, (panel.from + panel.to) / 2, 0.3);
    const eyelet = new THREE.TorusGeometry(0.024, 0.0075, 8, 20);
    eyelet.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(zAxis, frame.normal));
    const spot = frame.position.add(frame.normal.clone().multiplyScalar(0.004));
    eyelet.translate(spot.x, spot.y, spot.z);
    hardware.push(eyelet);
  }
  const top = crownPoint(spec, 0, 0);
  const button = new THREE.SphereGeometry(0.085, 20, 12);
  button.scale(1, 0.42, 1);
  button.translate(top.x, top.y + 0.01, top.z);
  hardware.push(button);

  const binding: THREE.Vector3[] = [];
  const bindingHalf = ARCH_HALF + 0.08;
  for (let k = 0; k <= 24; k++) {
    binding.push(lifted(Math.PI - bindingHalf + (bindingHalf * 2 * k) / 24, 0.99, 0.006));
  }
  hardware.push(tube(binding, 0.013));

  // Regulador traseiro
  const strapHalf = ARCH_HALF * 0.9;
  const strapBand = gridGeometry(
    24,
    1,
    (i, j, out) => {
      const phi = Math.PI - strapHalf + (strapHalf * 2 * i) / 24;
      out.set(RX * 1.02 * Math.sin(phi), 0.025 + j * 0.08, RZ * 1.02 * Math.cos(phi));
    },
    (i, j) => [i / 24, j],
    true
  );
  const snap = new THREE.BoxGeometry(0.2, 0.055, 0.03);
  snap.translate(0, 0.065, -RZ * 1.045);

  return {
    shell,
    seams: merge(seams),
    hardware: merge(hardware),
    strap: merge([strapBand, snap]),
  };
}

export interface BillParts {
  top: THREE.BufferGeometry;
  under: THREE.BufferGeometry;
  stitches: THREE.BufferGeometry;
}

export function buildBill(spec: BillSpec): BillParts {
  const cols = 56;
  const rows = 18;
  const top = gridGeometry(
    cols,
    rows,
    (i, j, out) => {
      billPoint(spec, -1 + (2 * i) / cols, j / rows, out);
    },
    (i, j) => [i / cols, j / rows]
  );
  const bottom = gridGeometry(
    cols,
    rows,
    (i, j, out) => {
      billPoint(spec, -1 + (2 * i) / cols, j / rows, out).y -= BILL_THICKNESS;
    },
    (i, j) => [i / cols, j / rows],
    true
  );

  const edge: THREE.Vector3[] = [];
  for (let k = 0; k <= 48; k++) {
    const point = billPoint(spec, -1 + (2 * k) / 48, 1);
    point.y -= BILL_THICKNESS / 2;
    edge.push(point);
  }

  const stitches = [0.6, 0.69, 0.78, 0.87].map((v) => {
    const points: THREE.Vector3[] = [];
    for (let k = 0; k <= 40; k++) {
      const point = billPoint(spec, -0.9 + (1.8 * k) / 40, v);
      point.y += 0.004;
      points.push(point);
    }
    return tube(points, 0.0032, 4);
  });

  return {
    top,
    under: merge([bottom, tube(edge, BILL_THICKNESS / 2, 8)]),
    stitches: merge(stitches),
  };
}

export interface BandParts {
  band: THREE.BufferGeometry;
  trims: THREE.BufferGeometry;
  strap: THREE.BufferGeometry;
}

export function buildBand(): BandParts {
  const cols = 96;
  const rows = 8;
  const start = -(Math.PI - BAND_GAP);
  const span = 2 * (Math.PI - BAND_GAP);
  const band = gridGeometry(
    cols,
    rows,
    (i, j, out) => {
      bandPoint(start + (span * i) / cols, j / rows, out);
    },
    (i, j) => [i / cols, j / rows],
    true
  );

  const edge = (v: number) => {
    const points: THREE.Vector3[] = [];
    for (let k = 0; k <= 64; k++) points.push(bandPoint(start + (span * k) / 64, v));
    return tube(points, 0.012);
  };

  const strapHalf = BAND_GAP + 0.08;
  const strapBand = gridGeometry(
    20,
    1,
    (i, j, out) => {
      const phi = Math.PI - strapHalf + (strapHalf * 2 * i) / 20;
      const v = 0.22 + j * 0.56;
      out.set(RX * 1.03 * Math.sin(phi), 0.01 + v * BAND_HEIGHT, RZ * 1.03 * Math.cos(phi) - 0.04 * v);
    },
    (i, j) => [i / 20, j],
    true
  );
  const patch = new THREE.BoxGeometry(0.34, 0.12, 0.02);
  patch.translate(0, 0.01 + 0.5 * BAND_HEIGHT, -RZ * 1.075);

  return { band, trims: merge([edge(0), edge(1)]), strap: merge([strapBand, patch]) };
}

/** Busca os parâmetros da superfície mais próximos de um ponto clicado. */
function nearestParams(sample: Sampler, target: THREE.Vector3, aRange: [number, number], bRange: [number, number]) {
  let [a0, a1] = aRange;
  let [b0, b1] = bRange;
  let bestA = (a0 + a1) / 2;
  let bestB = (b0 + b1) / 2;
  let best = Infinity;
  const point = new THREE.Vector3();
  const steps = 24;
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= steps; j++) {
        const a = a0 + ((a1 - a0) * i) / steps;
        const b = b0 + ((b1 - b0) * j) / steps;
        const distance = sample(a, b, point).distanceToSquared(target);
        if (distance < best) {
          best = distance;
          bestA = a;
          bestB = b;
        }
      }
    }
    const da = ((a1 - a0) / steps) * 2;
    const db = ((b1 - b0) / steps) * 2;
    a0 = Math.max(aRange[0], bestA - da);
    a1 = Math.min(aRange[1], bestA + da);
    b0 = Math.max(bRange[0], bestB - db);
    b1 = Math.min(bRange[1], bestB + db);
  }
  return [bestA, bestB] as const;
}

/** Converte um ponto clicado no boné (coordenadas locais) em posição de arte. */
export function paramsFromPoint(model: CapModelSpec, surface: SurfaceId, point: THREE.Vector3) {
  if (surface === 'aba') {
    const [u, v] = nearestParams((a, b, out) => billPoint(model.bill, a, b, out), point, [-1, 1], [0, 1]);
    return { u, v };
  }
  if (surface === 'faixa' || !model.crown) {
    const phi = Math.atan2(point.x / RX, point.z / RZ);
    return {
      u: THREE.MathUtils.radToDeg(phi),
      v: THREE.MathUtils.clamp((point.y - 0.01) / BAND_HEIGHT, 0, 1),
    };
  }
  const crown = model.crown;
  const guess = Math.atan2(point.x / RX, (point.z + TOP_BACK_SHIFT * 0.5) / RZ);
  const [phi, t] = nearestParams(
    (a, b, out) => crownPoint(crown, a, b, out),
    point,
    [guess - 0.5, guess + 0.5],
    [0, 1]
  );
  return { u: THREE.MathUtils.radToDeg(wrapAngle(phi)), v: 1 - t };
}

export interface DecalPlacement {
  position: [number, number, number];
  rotation: [number, number, number];
  depth: number;
}

/**
 * Posição e orientação de uma arte na superfície.
 *
 * Monta uma base ortonormal (right, correctedUp, normal) para que o texto fique
 * sempre legível: "right" aponta para a direita de quem lê, "correctedUp" para
 * cima, e "normal" sai da superfície. A rotação Euler resultante é passada
 * diretamente ao <Decal> da drei, que a usa sem modificação.
 */
export function placeDecal(
  model: CapModelSpec,
  surface: SurfaceId,
  u: number,
  v: number,
  rotationDeg: number,
  size: number
): DecalPlacement {
  let frame: SurfaceFrame;
  const up = new THREE.Vector3(0, 1, 0);
  let depth = 0.3;

  if (surface === 'aba') {
    frame = billFrame(model.bill, u, v);
    // Na aba, o topo da arte aponta para a copa: lê-se de frente para o boné
    up.set(0, 0, -1);
  } else if (surface === 'faixa' || !model.crown) {
    frame = bandFrame(THREE.MathUtils.degToRad(u), v);
  } else {
    const phi = THREE.MathUtils.degToRad(u);
    frame = crownFrame(model.crown, phi, 1 - v);
    // Perto do topo a normal fica quase vertical: o "para cima" passa a apontar para trás
    const w = THREE.MathUtils.smoothstep(Math.abs(frame.normal.y), 0.55, 0.95);
    up.multiplyScalar(1 - w)
      .add(new THREE.Vector3(-Math.sin(phi), 0, -Math.cos(phi)).multiplyScalar(w))
      .normalize();
    depth = Math.max(0.45, size * 0.6);
  }

  // --- Monta uma base ortonormal a partir da normal e do "para cima" desejado ---
  //
  // Convenção do DecalGeometry (three-stdlib):
  //   UV = (0.5 + x/size.x,  0.5 + y/size.y)
  // onde (x, y) são coordenadas no espaço local do projetor.
  // Para que o texto apareça legível, o eixo X local precisa apontar para a
  // DIREITA do leitor, e o eixo Y local precisa apontar para BAIXO (já que V
  // cresce para baixo como coordenadas de canvas, onde Y=0 é o topo).
  //
  // A convenção original do <Decal> da drei (lookAt + rotateZ(π) + rotateY(π))
  // produz exatamente isso: X = right, Y = -up, Z = +normal.
  // Reproduzimos o mesmo resultado via base ortonormal explícita.

  const normal = frame.normal.clone().normalize();

  // tangentRight = up × normal  (aponta para a direita de quem lê o texto)
  const tangentRight = new THREE.Vector3().crossVectors(up, normal);

  // Se up e normal forem quase paralelos, usa um fallback para evitar vetor nulo
  if (tangentRight.lengthSq() < 1e-6) {
    const fallback = Math.abs(up.x) < 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
    tangentRight.crossVectors(fallback, normal);
  }
  tangentRight.normalize();

  // tangentDown = normal × tangentRight  (aponta para BAIXO no espaço da textura)
  // É o oposto do "para cima" corrigido; isso casa com a convenção de UV do DecalGeometry.
  const tangentDown = new THREE.Vector3().crossVectors(normal, tangentRight).negate();

  // Matriz de rotação: colunas = (tangentRight, tangentDown, normal)
  const matrix = new THREE.Matrix4().makeBasis(tangentRight, tangentDown, normal);

  // Aplica a rotação do usuário em torno da normal (eixo Z local)
  if (rotationDeg !== 0) {
    const spin = new THREE.Matrix4().makeRotationAxis(normal, THREE.MathUtils.degToRad(-rotationDeg));
    matrix.premultiply(spin);
  }

  const euler = new THREE.Euler().setFromRotationMatrix(matrix);

  return {
    position: [frame.position.x, frame.position.y, frame.position.z],
    rotation: [euler.x, euler.y, euler.z],
    depth,
  };
}
