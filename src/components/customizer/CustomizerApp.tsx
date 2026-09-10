'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, LoaderCircle, Rotate3d } from 'lucide-react';
import Logo from '../Logo';
import { WhatsappIcon } from '../icons';
import CustomizerPanel from './CustomizerPanel';
import { DEFAULT_COLORS, MAX_LAYERS, MODELS, VIEW_LABELS, areaPreset, type CapModelSpec } from './models';
import { processImage, readImageFile } from './textures';
import { site, whatsappLink } from '@/lib/site';
import type {
  AreaId,
  CaptureApi,
  Design,
  ImageLayer,
  Layer,
  ModelId,
  OrderInfo,
  PartId,
  SurfaceId,
  TextLayer,
  ViewId,
  ViewRequest,
} from './types';

function SceneLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-ink-500">
      <LoaderCircle className="size-8 animate-spin text-brand-600" />
      <p className="text-sm font-medium">Carregando o boné em 3D…</p>
    </div>
  );
}

// O three.js só é baixado nesta página, e só no navegador
const CapScene = dynamic(() => import('./CapScene'), { ssr: false, loading: SceneLoading });

const VIEWS: ViewId[] = ['destaque', 'frente', 'esquerda', 'direita', 'tras', 'aba'];

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function isLightColor(hex: string) {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 160;
}

function initialDesign(model: ModelId): Design {
  const preset = areaPreset(MODELS[model], 'frente');
  return {
    model,
    colors: { ...DEFAULT_COLORS },
    layers: [
      {
        // Id fixo: o primeiro render acontece no servidor e precisa bater com o do navegador
        id: 'arte-inicial',
        kind: 'text',
        text: 'SUA MARCA',
        font: 'moderna',
        color: '#ffffff',
        surface: preset.surface,
        u: preset.u,
        v: preset.v,
        size: 0.95,
        rotation: 0,
      },
    ],
  };
}

/** Ao trocar entre boné e viseira, as artes da copa passam para a faixa (e vice-versa). */
function adaptLayers(layers: Layer[], from: CapModelSpec, to: CapModelSpec): Layer[] {
  const toVisor = to.crown === null;
  if (toVisor === (from.crown === null)) return layers;
  return layers.map((layer) => {
    if (layer.surface === 'aba') return layer;
    if (toVisor) {
      return { ...layer, surface: 'faixa', u: Math.max(-110, Math.min(110, layer.u)), v: 0.5, size: Math.min(layer.size, 0.8) };
    }
    return { ...layer, surface: 'copa', v: 0.55 };
  });
}

function detectWebgl() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(context);
  } catch {
    return false;
  }
}

export default function CustomizerApp() {
  const [design, setDesign] = useState<Design>(() => initialDesign('trucker'));
  const [selectedId, setSelectedId] = useState<string | null>('arte-inicial');
  const [viewRequest, setViewRequest] = useState<ViewRequest>({ view: 'destaque', nonce: 0 });
  const [webglReady, setWebglReady] = useState<boolean | null>(null);
  const captureRef = useRef<CaptureApi | null>(null);

  useEffect(() => {
    const setup = () => {
      setWebglReady(detectWebgl());
      // Permite abrir já num modelo: /personalizar?modelo=dad-hat
      const requested = new URLSearchParams(window.location.search).get('modelo');
      if (requested && requested in MODELS) setDesign(initialDesign(requested as ModelId));
    };
    setup();
  }, []);

  const model = MODELS[design.model];
  const selectedLayer = design.layers.find((layer) => layer.id === selectedId) ?? null;

  const showView = useCallback((view: ViewId) => {
    setViewRequest((previous) => ({ view, nonce: previous.nonce + 1 }));
  }, []);

  const updateLayer = useCallback((id: string, patch: Partial<Layer>) => {
    setDesign((current) => ({
      ...current,
      layers: current.layers.map((layer) => (layer.id === id ? ({ ...layer, ...patch } as Layer) : layer)),
    }));
  }, []);

  const handlePlace = useCallback(
    (id: string, surface: SurfaceId, u: number, v: number) => updateLayer(id, { surface, u, v }),
    [updateLayer]
  );

  const handleReady = useCallback((api: CaptureApi) => {
    captureRef.current = api;
  }, []);

  const changeModel = (id: ModelId) => {
    setDesign((current) => ({
      ...current,
      model: id,
      layers: adaptLayers(current.layers, MODELS[current.model], MODELS[id]),
    }));
    showView('destaque');
  };

  const changeColor = (part: PartId, hex: string) => {
    setDesign((current) => ({ ...current, colors: { ...current.colors, [part]: hex } }));
  };

  const addLayer = (layer: Layer) => {
    setDesign((current) =>
      current.layers.length >= MAX_LAYERS ? current : { ...current, layers: [...current.layers, layer] }
    );
    setSelectedId(layer.id);
  };

  const addText = () => {
    const preset = areaPreset(model, 'frente');
    const hasFrontArt = design.layers.some((layer) => layer.surface === preset.surface && Math.abs(layer.u) < 45);
    const layer: TextLayer = {
      id: createId(),
      kind: 'text',
      text: 'Seu texto',
      font: 'moderna',
      color: isLightColor(design.colors.frente) ? '#16181d' : '#ffffff',
      surface: preset.surface,
      u: preset.u,
      v: hasFrontArt && preset.surface === 'copa' ? 0.28 : preset.v,
      size: 0.75,
      rotation: 0,
    };
    addLayer(layer);
    showView(preset.view);
  };

  const addImage = async (file: File) => {
    const original = await readImageFile(file);
    // Logos em JPG quase sempre vêm com fundo branco
    const removeWhite = file.type === 'image/jpeg';
    const { src, aspect } = await processImage(original, removeWhite);
    const preset = areaPreset(model, 'frente');
    const layer: ImageLayer = {
      id: createId(),
      kind: 'image',
      name: file.name,
      original,
      src,
      aspect,
      removeWhite,
      surface: preset.surface,
      u: preset.u,
      v: preset.v,
      size: 0.7,
      rotation: 0,
    };
    addLayer(layer);
    showView(preset.view);
  };

  const toggleRemoveWhite = async (id: string, removeWhite: boolean) => {
    const layer = design.layers.find((item): item is ImageLayer => item.id === id && item.kind === 'image');
    if (!layer) return;
    updateLayer(id, { removeWhite });
    const { src, aspect } = await processImage(layer.original, removeWhite);
    updateLayer(id, { src, aspect });
  };

  const moveToArea = (id: string, area: AreaId) => {
    const preset = areaPreset(model, area);
    updateLayer(id, { surface: preset.surface, u: preset.u, v: preset.v });
    showView(preset.view);
  };

  const duplicateLayer = (id: string) => {
    const layer = design.layers.find((item) => item.id === id);
    if (!layer) return;
    addLayer({ ...layer, id: createId(), v: Math.max(0.1, layer.v - 0.15) });
  };

  const removeLayer = (id: string) => {
    const remaining = design.layers.filter((layer) => layer.id !== id);
    setDesign((current) => ({ ...current, layers: current.layers.filter((layer) => layer.id !== id) }));
    setSelectedId(remaining.at(-1)?.id ?? null);
  };

  const exportMockup = async (format: 'png' | 'pdf', info: OrderInfo) => {
    const api = captureRef.current;
    if (!api) throw new Error('A visualização 3D ainda está carregando.');
    const { buildSheet, downloadPdf, downloadPng, exportFileName, pickSideView } = await import('./exportSheet');
    const sideView = pickSideView(design);
    const views = await api.capture(['destaque', 'frente', sideView, 'tras']);
    const sheet = await buildSheet({ views, design, info, sideView });
    if (format === 'png') {
      await downloadPng(sheet, exportFileName(design, 'png'));
    } else {
      await downloadPdf(sheet, exportFileName(design, 'pdf'), `Mockup ${model.name} — ${site.name}`);
    }
  };

  return (
    <div className="flex min-h-svh flex-col bg-ink-50">
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" aria-label={`${site.name} — voltar ao site`} className="shrink-0">
            <Logo tone="light" />
          </Link>
          <p className="hidden font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-400 md:block">
            Personalizador 3D
          </p>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-950 sm:inline-flex"
            >
              <ArrowLeft className="size-4" />
              Voltar ao site
            </Link>
            <a
              href={whatsappLink('Olá! Estou montando meu boné no personalizador do site e tenho uma dúvida.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1fb855]"
            >
              <WhatsappIcon className="size-4" />
              <span className="hidden sm:inline">Tirar dúvida</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1600px] flex-1 lg:grid-cols-[minmax(0,1fr)_440px]">
        <section
          id="visualizacao"
          aria-label="Visualização do boné"
          className="sticky top-16 z-20 h-[46svh] min-h-[300px] border-b border-ink-100 bg-[radial-gradient(ellipse_at_50%_40%,#ffffff_0%,#eceef6_75%)] lg:h-[calc(100svh-4rem)] lg:border-b-0"
        >
          {webglReady === false ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
              <p className="font-display text-lg font-bold text-ink-950">Seu navegador não conseguiu abrir o 3D</p>
              <p className="max-w-sm text-sm text-ink-500">
                Tente outro navegador ou fale com a gente pelo WhatsApp: montamos o mockup para você.
              </p>
            </div>
          ) : webglReady ? (
            <CapScene
              design={design}
              selectedId={selectedId}
              viewRequest={viewRequest}
              onPlace={handlePlace}
              onReady={handleReady}
            />
          ) : (
            <SceneLoading />
          )}

          <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-700 shadow-card">
            {model.name}
          </span>
          <span className="pointer-events-none absolute right-4 top-4 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs text-ink-500 shadow-card sm:flex">
            <Rotate3d className="size-3.5" />
            Arraste para girar
          </span>

          <div className="absolute inset-x-0 bottom-3 flex justify-center px-3">
            <div className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-white/95 p-1 shadow-card">
              {VIEWS.map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => showView(view)}
                  className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {VIEW_LABELS[view]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <CustomizerPanel
          design={design}
          model={model}
          selectedLayer={selectedLayer}
          onModelChange={changeModel}
          onColorChange={changeColor}
          onSelectLayer={setSelectedId}
          onAddText={addText}
          onAddImage={addImage}
          onUpdateLayer={updateLayer}
          onToggleRemoveWhite={toggleRemoveWhite}
          onMoveToArea={moveToArea}
          onDuplicateLayer={duplicateLayer}
          onRemoveLayer={removeLayer}
          onExport={exportMockup}
        />
      </main>
    </div>
  );
}
