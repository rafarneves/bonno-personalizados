'use client';

import { type ComponentRef, type RefObject, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import CapModel from './CapModel';
import type { CaptureApi, CapturedViews, Design, SurfaceId, ViewId, ViewRequest } from './types';

type Controls = ComponentRef<typeof OrbitControls>;

const TARGET: [number, number, number] = [0, 0.42, 0.3];

const VIEW_POSITIONS: Record<ViewId, [number, number, number]> = {
  destaque: [3.1, 1.55, 3.5],
  frente: [0, 0.85, 4.7],
  esquerda: [4.7, 0.85, 0.3],
  direita: [-4.7, 0.85, 0.3],
  tras: [0, 1.25, -4.4],
  aba: [0, 3.9, 2.9],
};

const CAPTURE_SIZE = 1400;

/** Em telas estreitas (celular em pé) a câmera se afasta para o boné caber inteiro. */
function fitFactor(aspect: number) {
  return Math.max(1, 1.1 / aspect);
}

function CameraRig({ controls, request }: { controls: RefObject<Controls | null>; request: ViewRequest }) {
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const get = useThree((state) => state.get);
  const animation = useRef<{ from: THREE.Spherical; to: THREE.Spherical; start: number } | null>(null);

  useEffect(() => {
    const orbit = controls.current;
    if (!orbit) return;
    const { size } = get();
    const from = new THREE.Spherical().setFromVector3(camera.position.clone().sub(orbit.target));
    const to = new THREE.Spherical().setFromVector3(
      new THREE.Vector3(...VIEW_POSITIONS[request.view]).sub(new THREE.Vector3(...TARGET))
    );
    to.radius *= fitFactor(size.width / Math.max(1, size.height));
    // Gira pelo caminho mais curto em volta do boné
    let delta = to.theta - from.theta;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;
    to.theta = from.theta + delta;
    animation.current = { from, to, start: performance.now() };
    invalidate();
  }, [request, camera, controls, get, invalidate]);

  useFrame(() => {
    const current = animation.current;
    const orbit = controls.current;
    if (!current || !orbit) return;
    const k = Math.min(1, (performance.now() - current.start) / 700);
    const eased = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const lerp = THREE.MathUtils.lerp;
    const spherical = new THREE.Spherical(
      lerp(current.from.radius, current.to.radius, eased),
      lerp(current.from.phi, current.to.phi, eased),
      lerp(current.from.theta, current.to.theta, eased)
    );
    camera.position.setFromSpherical(spherical).add(orbit.target);
    orbit.update();
    if (k < 1) invalidate();
    else animation.current = null;
  });

  return null;
}

/** Entrega para a interface a função que fotografa o boné de vários ângulos. */
function CaptureBridge({ controls, onReady }: { controls: RefObject<Controls | null>; onReady: (api: CaptureApi) => void }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    onReady({
      async capture(views: ViewId[]) {
        const perspective = camera as THREE.PerspectiveCamera;
        const previous = {
          position: camera.position.clone(),
          aspect: perspective.aspect,
          pixelRatio: gl.getPixelRatio(),
          size: gl.getSize(new THREE.Vector2()),
        };
        const hidden: THREE.Object3D[] = [];
        scene.traverse((object) => {
          if (object.name === 'selection-frame' && object.visible) {
            object.visible = false;
            hidden.push(object);
          }
        });

        const target = new THREE.Vector3(...TARGET);
        const result: CapturedViews = {};
        try {
          gl.setPixelRatio(1);
          gl.setSize(CAPTURE_SIZE, CAPTURE_SIZE, false);
          perspective.aspect = 1;
          perspective.updateProjectionMatrix();
          for (const view of views) {
            camera.position.set(...VIEW_POSITIONS[view]);
            camera.lookAt(target);
            camera.updateMatrixWorld();
            gl.render(scene, camera);
            // Lido logo após desenhar, antes que o navegador limpe o buffer
            result[view] = gl.domElement.toDataURL('image/png');
          }
        } finally {
          hidden.forEach((object) => {
            object.visible = true;
          });
          gl.setPixelRatio(previous.pixelRatio);
          gl.setSize(previous.size.x, previous.size.y, false);
          perspective.aspect = previous.aspect;
          perspective.updateProjectionMatrix();
          camera.position.copy(previous.position);
          const orbit = controls.current;
          if (orbit) {
            camera.lookAt(orbit.target);
            orbit.update();
          }
          invalidate();
        }
        return result;
      },
    });
  }, [camera, controls, gl, invalidate, onReady, scene]);

  return null;
}

interface CapSceneProps {
  design: Design;
  selectedId: string | null;
  viewRequest: ViewRequest;
  onPlace: (layerId: string, surface: SurfaceId, u: number, v: number) => void;
  onReady: (api: CaptureApi) => void;
}

export default function CapScene({ design, selectedId, viewRequest, onPlace, onReady }: CapSceneProps) {
  const controls = useRef<Controls>(null);

  return (
    <Canvas
      flat
      frameloop="demand"
      dpr={[1, 2]}
      camera={{ position: VIEW_POSITIONS.destaque, fov: 30, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true }}
      aria-label="Visualização 3D do boné"
    >
      <ambientLight intensity={0.6} />
      <hemisphereLight args={['#ffffff', '#b9bdd0', 0.4]} />
      <directionalLight position={[3, 5, 4]} intensity={1.5} />
      <directionalLight position={[-4, 2.5, -3]} intensity={0.55} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1.4} position={[0, 4, 3]} scale={[7, 2.5, 1]} />
        <Lightformer form="rect" intensity={0.7} position={[-5, 1.5, 0]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} />
        <Lightformer form="rect" intensity={0.5} position={[5, 1, -2]} rotation-y={-Math.PI / 2} scale={[4, 3, 1]} />
      </Environment>

      <CapModel design={design} selectedId={selectedId} onPlace={onPlace} />
      <ContactShadows
        key={design.model}
        position={[0, -0.34, 0.2]}
        scale={5}
        blur={2.6}
        far={1.4}
        opacity={0.3}
        resolution={512}
        frames={1}
      />

      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.12}
        minDistance={2.6}
        maxDistance={9}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2 + 0.2}
        target={TARGET}
      />
      <CameraRig controls={controls} request={viewRequest} />
      <CaptureBridge controls={controls} onReady={onReady} />
    </Canvas>
  );
}
