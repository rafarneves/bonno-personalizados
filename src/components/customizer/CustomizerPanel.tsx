'use client';

import Image from 'next/image';
import { type ReactNode, useRef, useState } from 'react';
import {
  Box,
  Check,
  Copy,
  Download,
  FileImage,
  FileText,
  ImagePlus,
  Layers,
  LoaderCircle,
  MousePointerClick,
  Palette,
  Trash2,
  Type,
} from 'lucide-react';
import { WhatsappIcon } from '../icons';
import { FONT_OPTIONS, FONT_ORDER } from './fonts';
import {
  AREA_LABELS,
  MAX_LAYERS,
  MODELS,
  MODEL_ORDER,
  PALETTE,
  SURFACE_RANGES,
  areaOf,
  colorName,
  type CapModelSpec,
} from './models';
import { site, whatsappLink } from '@/lib/site';
import type { AreaId, Design, Layer, ModelId, OrderInfo, PartId } from './types';

type TabId = 'modelo' | 'cores' | 'arte' | 'finalizar';

const TABS: { id: TabId; label: string; icon: typeof Box }[] = [
  { id: 'modelo', label: 'Modelo', icon: Box },
  { id: 'cores', label: 'Cores', icon: Palette },
  { id: 'arte', label: 'Arte', icon: Layers },
  { id: 'finalizar', label: 'Finalizar', icon: Download },
];

const ACCEPTED_IMAGES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
const MAX_UPLOAD_MB = 10;

interface PanelProps {
  design: Design;
  model: CapModelSpec;
  selectedLayer: Layer | null;
  onModelChange: (id: ModelId) => void;
  onColorChange: (part: PartId, hex: string) => void;
  onSelectLayer: (id: string) => void;
  onAddText: () => void;
  onAddImage: (file: File) => Promise<void>;
  onUpdateLayer: (id: string, patch: Partial<Layer>) => void;
  onToggleRemoveWhite: (id: string, value: boolean) => Promise<void>;
  onMoveToArea: (id: string, area: AreaId) => void;
  onDuplicateLayer: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onExport: (format: 'png' | 'pdf', info: OrderInfo) => Promise<void>;
}

function isLightColor(hex: string) {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  return 0.299 * ((value >> 16) & 255) + 0.587 * ((value >> 8) & 255) + 0.114 * (value & 255) > 160;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">{children}</p>;
}

function Swatches({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const isCustom = !PALETTE.some((color) => color.hex.toLowerCase() === value.toLowerCase());
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {PALETTE.map((color) => {
        const selected = color.hex.toLowerCase() === value.toLowerCase();
        return (
          <button
            key={color.hex}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={color.name}
            title={color.name}
            onClick={() => onChange(color.hex)}
            style={{ backgroundColor: color.hex }}
            className={`relative size-8 rounded-full border border-ink-200 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
              selected ? 'ring-2 ring-brand-600 ring-offset-2' : ''
            }`}
          >
            {selected && (
              <Check
                className={`absolute inset-0 m-auto size-4 ${isLightColor(color.hex) ? 'text-ink-900' : 'text-white'}`}
              />
            )}
          </button>
        );
      })}
      <label
        title="Escolher outra cor"
        className={`relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-ink-200 bg-[conic-gradient(#ef4444,#f59e0b,#84cc16,#06b6d4,#3b82f6,#a855f7,#ef4444)] transition-transform hover:scale-110 ${
          isCustom ? 'ring-2 ring-brand-600 ring-offset-2' : ''
        }`}
      >
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`${label}: outra cor`}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </label>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-xs font-semibold text-ink-600">
        <span>{label}</span>
        <span className="tabular-nums text-ink-400">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-brand-600"
      />
    </label>
  );
}

function NextStep({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-full bg-ink-950 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800"
    >
      {label}
    </button>
  );
}

function ModelTab({ design, onModelChange }: Pick<PanelProps, 'design' | 'onModelChange'>) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {MODEL_ORDER.map((id) => {
          const spec = MODELS[id];
          const active = id === design.model;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => onModelChange(id)}
              className={`group overflow-hidden rounded-2xl border bg-white text-left transition-all ${
                active ? 'border-brand-600 ring-2 ring-brand-600/20' : 'border-ink-100 hover:border-brand-200'
              }`}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-ink-100">
                <Image
                  src={spec.photo}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 45vw, 200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="block p-3">
                <span className="flex items-center justify-between gap-2 font-display text-sm font-bold text-ink-950">
                  {spec.name}
                  {active && <Check className="size-4 shrink-0 text-brand-600" />}
                </span>
                <span className="mt-1 block text-xs leading-snug text-ink-500">{spec.description}</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="text-xs leading-relaxed text-ink-400">
        As fotos são de bonés reais que produzimos. O 3D é uma representação para você visualizar cores e posições.
      </p>
    </div>
  );
}

function ColorsTab({ design, model, onColorChange }: Pick<PanelProps, 'design' | 'model' | 'onColorChange'>) {
  return (
    <div className="space-y-6">
      {model.parts.map((part) => (
        <div key={part}>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="font-display text-sm font-bold text-ink-950">{model.partLabels[part]}</p>
            <p className="text-xs text-ink-500">{colorName(design.colors[part])}</p>
          </div>
          <Swatches
            label={model.partLabels[part]}
            value={design.colors[part]}
            onChange={(hex) => onColorChange(part, hex)}
          />
        </div>
      ))}
    </div>
  );
}

function LayerEditor({
  layer,
  model,
  onUpdateLayer,
  onToggleRemoveWhite,
  onMoveToArea,
  onDuplicateLayer,
  onRemoveLayer,
}: { layer: Layer } & Pick<
  PanelProps,
  'model' | 'onUpdateLayer' | 'onToggleRemoveWhite' | 'onMoveToArea' | 'onDuplicateLayer' | 'onRemoveLayer'
>) {
  const range = SURFACE_RANGES[layer.surface];
  const currentArea = areaOf(layer);
  const onBill = layer.surface === 'aba';

  return (
    <div className="space-y-5 rounded-2xl border border-ink-100 bg-ink-50/70 p-4">
      {layer.kind === 'text' ? (
        <>
          <label className="block">
            <SectionLabel>Texto</SectionLabel>
            <input
              value={layer.text}
              maxLength={30}
              onChange={(event) => onUpdateLayer(layer.id, { text: event.target.value })}
              placeholder="Digite o texto"
              className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-950 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15"
            />
          </label>
          <div>
            <SectionLabel>Fonte</SectionLabel>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {FONT_ORDER.map((id) => {
                const option = FONT_OPTIONS[id];
                const active = layer.font === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onUpdateLayer(layer.id, { font: id })}
                    style={{ fontWeight: Number(option.weight) }}
                    className={`${option.className} rounded-xl border bg-white px-3 py-2 text-lg transition-colors ${
                      active ? 'border-brand-600 text-brand-700' : 'border-ink-200 text-ink-800 hover:border-ink-300'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <SectionLabel>Cor do texto</SectionLabel>
            <div className="mt-2">
              <Swatches label="Cor do texto" value={layer.color} onChange={(hex) => onUpdateLayer(layer.id, { color: hex })} />
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex size-14 items-center justify-center rounded-xl border border-ink-100 bg-[repeating-conic-gradient(#eceef6_0%_25%,#ffffff_0%_50%)] bg-[length:14px_14px] p-1">
              <Image src={layer.src} alt="" width={48} height={48} unoptimized className="max-h-12 w-auto object-contain" />
            </span>
            <p className="min-w-0 truncate text-sm font-semibold text-ink-900">{layer.name}</p>
          </div>
          <label className="flex items-center gap-2.5 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={layer.removeWhite}
              onChange={(event) => onToggleRemoveWhite(layer.id, event.target.checked)}
              className="size-4 accent-brand-600"
            />
            Remover fundo branco
          </label>
        </div>
      )}

      <div>
        <SectionLabel>Posição</SectionLabel>
        <div className="mt-2 flex flex-wrap gap-2">
          {model.areas.map((area) => (
            <button
              key={area}
              type="button"
              aria-pressed={currentArea === area}
              onClick={() => onMoveToArea(layer.id, area)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                currentArea === area
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300'
              }`}
            >
              {AREA_LABELS[area]}
            </button>
          ))}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-500">
          <MousePointerClick className="size-3.5 shrink-0" />
          Ou toque no boné para posicionar. Esquerdo e direito são de quem usa.
        </p>
      </div>

      <div className="space-y-4">
        <Slider
          label="Horizontal"
          value={layer.u}
          min={range.u[0]}
          max={range.u[1]}
          step={range.uStep}
          display={onBill ? `${Math.round(layer.u * 100)}` : `${Math.round(layer.u)}°`}
          onChange={(u) => onUpdateLayer(layer.id, { u })}
        />
        <Slider
          label={onBill ? 'Distância da copa' : 'Altura'}
          value={layer.v}
          min={range.v[0]}
          max={range.v[1]}
          step={0.01}
          display={`${Math.round(layer.v * 100)}%`}
          onChange={(v) => onUpdateLayer(layer.id, { v })}
        />
        <Slider
          label="Tamanho"
          value={layer.size}
          min={0.15}
          max={onBill ? 0.9 : 1.3}
          step={0.01}
          display={`${Math.round(layer.size * 100)}%`}
          onChange={(size) => onUpdateLayer(layer.id, { size })}
        />
        <Slider
          label="Rotação"
          value={layer.rotation}
          min={-180}
          max={180}
          step={1}
          display={`${layer.rotation}°`}
          onChange={(rotation) => onUpdateLayer(layer.id, { rotation })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onDuplicateLayer(layer.id)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-300"
        >
          <Copy className="size-4" />
          Duplicar
        </button>
        <button
          type="button"
          onClick={() => onRemoveLayer(layer.id)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <Trash2 className="size-4" />
          Remover
        </button>
      </div>
    </div>
  );
}

function ArtTab(props: PanelProps) {
  const { design, selectedLayer, onAddText, onAddImage, onSelectLayer } = props;
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const full = design.layers.length >= MAX_LAYERS;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (!ACCEPTED_IMAGES.includes(file.type)) {
      setError('Envie uma imagem em PNG, JPG, WEBP ou SVG.');
      return;
    }
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setError(`A imagem precisa ter no máximo ${MAX_UPLOAD_MB} MB.`);
      return;
    }
    setUploading(true);
    try {
      await onAddImage(file);
    } catch {
      setError('Não foi possível ler esta imagem. Tente outro arquivo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onAddText}
          disabled={full}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-ink-200 bg-white px-3 py-3.5 text-sm font-semibold text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:opacity-50"
        >
          <Type className="size-4" />
          Adicionar texto
        </button>
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={full || uploading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-ink-200 bg-white px-3 py-3.5 text-sm font-semibold text-ink-800 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:opacity-50"
        >
          {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          Enviar logo
        </button>
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPTED_IMAGES.join(',')}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            void handleFile(file);
          }}
        />
      </div>
      {full && <p className="text-xs text-ink-500">Você chegou ao limite de {MAX_LAYERS} artes.</p>}
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {design.layers.length > 0 ? (
        <ul className="space-y-2">
          {design.layers.map((layer) => {
            const active = layer.id === selectedLayer?.id;
            return (
              <li key={layer.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelectLayer(layer.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
                    active ? 'border-brand-600 bg-brand-50' : 'border-ink-100 bg-white hover:border-ink-200'
                  }`}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-600">
                    {layer.kind === 'text' ? (
                      <Type className="size-4" />
                    ) : (
                      <Image src={layer.src} alt="" width={28} height={28} unoptimized className="max-h-7 w-auto object-contain" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink-900">
                      {layer.kind === 'text' ? layer.text.trim() || 'Texto vazio' : layer.name}
                    </span>
                    <span className="block text-xs text-ink-500">{AREA_LABELS[areaOf(layer)]}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-ink-200 px-4 py-6 text-center text-sm text-ink-500">
          Adicione um texto ou envie o logo da sua marca.
        </p>
      )}

      {selectedLayer && <LayerEditor layer={selectedLayer} {...props} />}
    </div>
  );
}

function FinalizeTab({ design, model, onExport }: Pick<PanelProps, 'design' | 'model' | 'onExport'>) {
  const [info, setInfo] = useState<OrderInfo>({ nome: '', quantidade: '', observacoes: '' });
  const [busy, setBusy] = useState<'png' | 'pdf' | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quantity = Number(info.quantidade);

  const run = async (format: 'png' | 'pdf') => {
    setBusy(format);
    setError(null);
    try {
      await onExport(format, info);
      setDone(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível gerar o arquivo. Tente novamente.');
    } finally {
      setBusy(null);
    }
  };

  const inputClass =
    'mt-2 w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-950 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15';

  return (
    <div className="space-y-5">
      <dl className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white text-sm">
        <div className="flex justify-between gap-4 px-4 py-3">
          <dt className="text-ink-500">Modelo</dt>
          <dd className="font-semibold text-ink-950">{model.name}</dd>
        </div>
        <div className="flex justify-between gap-4 px-4 py-3">
          <dt className="text-ink-500">Cores</dt>
          <dd className="flex gap-1.5">
            {model.parts.map((part) => (
              <span
                key={part}
                title={`${model.partLabels[part]}: ${colorName(design.colors[part])}`}
                style={{ backgroundColor: design.colors[part] }}
                className="size-5 rounded-full border border-ink-200"
              />
            ))}
          </dd>
        </div>
        <div className="flex justify-between gap-4 px-4 py-3">
          <dt className="text-ink-500">Artes</dt>
          <dd className="font-semibold text-ink-950">{design.layers.length}</dd>
        </div>
      </dl>

      <div className="space-y-4">
        <label className="block">
          <SectionLabel>Seu nome (opcional)</SectionLabel>
          <input
            value={info.nome}
            maxLength={60}
            onChange={(event) => setInfo({ ...info, nome: event.target.value })}
            className={inputClass}
          />
        </label>
        <label className="block">
          <SectionLabel>Quantidade (opcional)</SectionLabel>
          <input
            value={info.quantidade}
            inputMode="numeric"
            maxLength={6}
            onChange={(event) => setInfo({ ...info, quantidade: event.target.value.replace(/\D/g, '') })}
            placeholder={`Mínimo de ${site.minOrder} unidades`}
            className={inputClass}
          />
          {info.quantidade && quantity < site.minOrder && (
            <span className="mt-1.5 block text-xs text-amber-700">O pedido mínimo é de {site.minOrder} unidades.</span>
          )}
        </label>
        <label className="block">
          <SectionLabel>Observações (opcional)</SectionLabel>
          <textarea
            value={info.observacoes}
            maxLength={240}
            rows={3}
            onChange={(event) => setInfo({ ...info, observacoes: event.target.value })}
            placeholder="Ex.: bordado na frente, prazo desejado…"
            className={`${inputClass} resize-none`}
          />
        </label>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <button
          type="button"
          onClick={() => run('png')}
          disabled={busy !== null}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {busy === 'png' ? <LoaderCircle className="size-4 animate-spin" /> : <FileImage className="size-4" />}
          Salvar como imagem
        </button>
        <button
          type="button"
          onClick={() => run('pdf')}
          disabled={busy !== null}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-950 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-ink-800 disabled:opacity-60"
        >
          {busy === 'pdf' ? <LoaderCircle className="size-4 animate-spin" /> : <FileText className="size-4" />}
          Salvar como PDF
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {done && (
        <div role="status" className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 font-display font-bold text-emerald-900">
            <Check className="size-5" />
            Mockup salvo!
          </p>
          <p className="text-sm leading-relaxed text-emerald-800">
            Agora é só enviar o arquivo para a gente pelo WhatsApp. Um consultor confere os detalhes e passa o seu orçamento.
          </p>
          <a
            href={whatsappLink(
              `Olá! Montei um boné ${model.name} no personalizador do site e vou enviar o mockup aqui.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1fb855]"
          >
            <WhatsappIcon className="size-5" />
            Abrir conversa no WhatsApp
          </a>
        </div>
      )}

      <p className="text-xs leading-relaxed text-ink-400">
        Mockup ilustrativo: cores, tamanhos e posições são aproximados e serão confirmados com um consultor antes da
        produção.
      </p>
    </div>
  );
}

export default function CustomizerPanel(props: PanelProps) {
  const [tab, setTab] = useState<TabId>('modelo');
  const panelRef = useRef<HTMLElement>(null);

  const goTo = (next: TabId) => {
    setTab(next);
    // No celular, sobe até o começo do painel (logo abaixo do boné fixo no topo)
    const panel = panelRef.current;
    const viewer = document.getElementById('visualizacao');
    if (!panel || !viewer) return;
    const hiddenBy = viewer.getBoundingClientRect().bottom - panel.getBoundingClientRect().top;
    if (hiddenBy > 0) window.scrollBy({ top: -hiddenBy, behavior: 'smooth' });
  };

  const index = TABS.findIndex((item) => item.id === tab);
  const next = TABS[index + 1];

  return (
    <aside ref={panelRef} aria-label="Opções de personalização" className="bg-white lg:border-l lg:border-ink-100">
      <div role="tablist" aria-label="Etapas" className="grid grid-cols-4 border-b border-ink-100 bg-white lg:sticky lg:top-16 lg:z-10">
        {TABS.map((item, position) => {
          const active = item.id === tab;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`aba-${item.id}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`painel-${item.id}`}
              onClick={() => goTo(item.id)}
              className={`relative flex flex-col items-center gap-1 px-2 py-3 text-xs font-semibold transition-colors ${
                active ? 'text-brand-700' : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              <Icon className="size-5" />
              <span>
                {position + 1}. {item.label}
              </span>
              {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-600" />}
            </button>
          );
        })}
      </div>

      <div id={`painel-${tab}`} role="tabpanel" aria-labelledby={`aba-${tab}`} className="space-y-6 p-4 sm:p-6">
        <div>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-ink-950">
            {tab === 'modelo' && 'Escolha o modelo'}
            {tab === 'cores' && 'Defina as cores'}
            {tab === 'arte' && 'Aplique sua arte'}
            {tab === 'finalizar' && 'Salve o seu mockup'}
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            {tab === 'modelo' && 'Você pode trocar de modelo a qualquer momento sem perder a arte.'}
            {tab === 'cores' && 'Toque numa cor para aplicar em cada parte do boné.'}
            {tab === 'arte' && 'Adicione textos e logos, depois ajuste posição, tamanho e rotação.'}
            {tab === 'finalizar' && 'Baixe em imagem ou PDF e envie para a gente pelo WhatsApp.'}
          </p>
        </div>

        {tab === 'modelo' && <ModelTab design={props.design} onModelChange={props.onModelChange} />}
        {tab === 'cores' && <ColorsTab design={props.design} model={props.model} onColorChange={props.onColorChange} />}
        {tab === 'arte' && <ArtTab {...props} />}
        {tab === 'finalizar' && <FinalizeTab design={props.design} model={props.model} onExport={props.onExport} />}

        {next && <NextStep label={`Próximo: ${next.label}`} onClick={() => goTo(next.id)} />}
      </div>
    </aside>
  );
}
