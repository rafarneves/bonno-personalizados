'use client';

import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Decal } from '@react-three/drei';
import { type ThreeEvent, useThree } from '@react-three/fiber';
import { FONT_OPTIONS } from './fonts';
import { buildBand, buildBill, buildCrown, paramsFromPoint, placeDecal, type DecalPlacement } from './geometry';
import { MODELS, type CapModelSpec } from './models';
import { createMeshTexture, createSelectionCanvas, createTwillTexture, loadImage, renderText } from './textures';
import type { Colors, Design, FontId, Layer, SurfaceId } from './types';

interface CapModelProps {
  design: Design;
  selectedId: string | null;
  onPlace: (layerId: string, surface: SurfaceId, u: number, v: number) => void;
}

function useMaterials(colors: Colors, meshBack: boolean) {
  const invalidate = useThree((state) => state.invalidate);
  const textures = useMemo(() => ({ twill: createTwillTexture(), mesh: createMeshTexture() }), []);

  const materials = useMemo(() => {
    const fabric = () =>
      new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0, bumpMap: textures.twill, bumpScale: 0.5 });
    return {
      front: fabric(),
      sides: meshBack
        ? new THREE.MeshStandardMaterial({
            roughness: 0.95,
            alphaMap: textures.mesh,
            alphaTest: 0.5,
            side: THREE.DoubleSide,
          })
        : fabric(),
      bill: fabric(),
      details: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
      strap: new THREE.MeshStandardMaterial({ roughness: 0.6, side: THREE.DoubleSide }),
      lining: new THREE.MeshStandardMaterial({ color: '#23252b', roughness: 1, side: THREE.BackSide }),
    };
  }, [meshBack, textures]);

  // Cor aplicada antes da pintura, sem recriar materiais a cada troca
  useLayoutEffect(() => {
    materials.front.color.set(colors.frente);
    materials.sides.color.set(colors.laterais);
    materials.bill.color.set(colors.aba);
    materials.details.color.set(colors.detalhes);
    materials.strap.color.set(colors.detalhes);
    invalidate();
  }, [colors, materials, invalidate]);

  useEffect(() => () => Object.values(materials).forEach((material) => material.dispose()), [materials]);
  useEffect(
    () => () => {
      textures.twill.dispose();
      textures.mesh.dispose();
    },
    [textures]
  );

  return materials;
}

interface Art {
  texture: THREE.Texture;
  aspect: number;
}

/** Textura da arte: texto desenhado em canvas ou imagem enviada pelo cliente. */
function useArt(kind: Layer['kind'], text: string, font: FontId, color: string, src: string, imageAspect: number) {
  const invalidate = useThree((state) => state.invalidate);
  const [art, setArt] = useState<Art | null>(null);

  useEffect(() => {
    let cancelled = false;
    const build = async (): Promise<Art> => {
      if (kind === 'text') {
        const option = FONT_OPTIONS[font];
        const { canvas, aspect } = await renderText(text, option.family, option.weight, color);
        return { texture: new THREE.CanvasTexture(canvas), aspect };
      }
      const image = await loadImage(src);
      const texture = new THREE.Texture(image);
      texture.needsUpdate = true;
      return { texture, aspect: imageAspect };
    };
    build()
      .then((next) => {
        next.texture.colorSpace = THREE.SRGBColorSpace;
        next.texture.anisotropy = 8;
        if (cancelled) {
          next.texture.dispose();
          return;
        }
        setArt(next);
        invalidate();
      })
      .catch(() => {
        // Arte que não carregou simplesmente não aparece; o restante do boné continua funcionando
      });
    return () => {
      cancelled = true;
    };
  }, [kind, text, font, color, src, imageAspect, invalidate]);

  useEffect(() => () => art?.texture.dispose(), [art]);
  return art;
}

function SelectionFrame({ placement, width, height }: { placement: DecalPlacement; width: number; height: number }) {
  const texture = useMemo(() => {
    const result = new THREE.CanvasTexture(createSelectionCanvas(width / height));
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, [width, height]);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <Decal
      name="selection-frame"
      position={placement.position}
      rotation={placement.rotation}
      scale={[width * 1.12 + 0.05, height * 1.12 + 0.05, placement.depth]}
      depthTest
      renderOrder={3}
    >
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-12}
        toneMapped={false}
      />
    </Decal>
  );
}

function LayerDecal({ layer, model, selected }: { layer: Layer; model: CapModelSpec; selected: boolean }) {
  const art = useArt(
    layer.kind,
    layer.kind === 'text' ? layer.text : '',
    layer.kind === 'text' ? layer.font : 'moderna',
    layer.kind === 'text' ? layer.color : '',
    layer.kind === 'image' ? layer.src : '',
    layer.kind === 'image' ? layer.aspect : 1
  );

  const placement = useMemo(
    () => placeDecal(model, layer.surface, layer.u, layer.v, layer.rotation, layer.size),
    [model, layer.surface, layer.u, layer.v, layer.rotation, layer.size]
  );

  if (!art) return null;
  const width = layer.size;
  const height = layer.size / art.aspect;

  return (
    <>
      <Decal
        position={placement.position}
        rotation={placement.rotation}
        scale={[width, height, placement.depth]}
        depthTest
        renderOrder={2}
      >
        <meshStandardMaterial
          map={art.texture}
          transparent
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-10}
          roughness={0.75}
        />
      </Decal>
      {selected && <SelectionFrame placement={placement} width={width} height={height} />}
    </>
  );
}

export default function CapModel({ design, selectedId, onPlace }: CapModelProps) {
  const model = MODELS[design.model];
  const gl = useThree((state) => state.gl);
  const materials = useMaterials(design.colors, model.crown?.meshBack ?? false);

  const crown = useMemo(() => (model.crown ? buildCrown(model.crown) : null), [model]);
  const bill = useMemo(() => buildBill(model.bill), [model]);
  const band = useMemo(() => (model.crown ? null : buildBand()), [model]);

  useEffect(
    () => () => {
      [crown?.shell, crown?.seams, crown?.hardware, crown?.strap, bill.top, bill.under, bill.stitches]
        .concat([band?.band, band?.trims, band?.strap])
        .forEach((geometry) => geometry?.dispose());
    },
    [crown, bill, band]
  );

  const handleClick = (surface: SurfaceId) => (event: ThreeEvent<MouseEvent>) => {
    // Ignora o clique que na verdade foi o fim de um arraste para girar
    if (!selectedId || event.delta > 6) return;
    event.stopPropagation();
    const local = event.eventObject.worldToLocal(event.point.clone());
    const { u, v } = paramsFromPoint(model, surface, local);
    onPlace(selectedId, surface, u, v);
  };

  // O cursor é trocado no próprio canvas que recebeu o evento
  const setCursor = (event: ThreeEvent<PointerEvent>, cursor: string) => {
    const canvas = event.nativeEvent.target;
    if (canvas instanceof HTMLElement) canvas.style.cursor = cursor;
  };
  const pointer = {
    onPointerOver: (event: ThreeEvent<PointerEvent>) => setCursor(event, selectedId ? 'crosshair' : 'grab'),
    onPointerOut: (event: ThreeEvent<PointerEvent>) => setCursor(event, ''),
  };

  const decals = (surface: SurfaceId) =>
    design.layers
      .filter((layer) => layer.surface === surface)
      .map((layer) => (
        <LayerDecal
          key={`${layer.id}-${design.model}`}
          layer={layer}
          model={model}
          selected={layer.id === selectedId}
        />
      ));

  return (
    <group>
      {crown && (
        <>
          <mesh geometry={crown.shell} material={[materials.front, materials.sides]} onClick={handleClick('copa')} {...pointer}>
            {decals('copa')}
          </mesh>
          <mesh geometry={crown.shell} material={materials.lining} scale={0.992} />
          <mesh geometry={crown.seams} material={materials.details} />
          <mesh geometry={crown.hardware} material={materials.details} />
          <mesh geometry={crown.strap} material={materials.strap} />
        </>
      )}

      {band && (
        <>
          <mesh geometry={band.band} material={materials.front} onClick={handleClick('faixa')} {...pointer}>
            {decals('faixa')}
          </mesh>
          <mesh geometry={band.band} material={materials.lining} scale={0.99} />
          <mesh geometry={band.trims} material={materials.details} />
          <mesh geometry={band.strap} material={materials.strap} />
        </>
      )}

      <mesh geometry={bill.top} material={materials.bill} onClick={handleClick('aba')} {...pointer}>
        {decals('aba')}
      </mesh>
      <mesh geometry={bill.under} material={materials.bill} />
      <mesh geometry={bill.stitches} material={materials.details} />
    </group>
  );
}
