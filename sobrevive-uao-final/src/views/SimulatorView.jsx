import { Suspense, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore, useEmergency } from '../store/useGameStore'
import { MODELS, PIXEL_DPR } from '../config'
import BasementScene from '../components/three/BasementScene'
import Avatar from '../components/three/Avatar'
import HazardEffects from '../components/three/HazardEffects'
import CameraRig from '../components/three/CameraRig'
import ModelSlot from '../components/three/ModelSlot'
import { START } from '../components/three/basementLayout'
import CheckpointBeacon from '../components/three/CheckpointBeacon'
import { useKeyboardMovement } from '../utils/playerInput'
import ReadySignal from '../components/three/ReadySignal'
import { LoadingScreen } from '../components/ui/primitives'
import {
  SimHUD,
  StoryModal,
  DecisionModal,
  ChaosOverlay,
  FeedbackModal,
  VictoryModal,
  SuccessToast,
  MoveControls,
} from '../components/ui/SimulatorOverlays'

/** Ambientación por amenaza: fondo, niebla y tono de luz. */
const THEME = {
  fire: { bg: '#1a1012', fog: '#2a1a1a', sky: '#ffb08a', ground: '#3a1a12', fogFar: 34 },
  gas: { bg: '#0f1712', fog: '#1d3322', sky: '#c8ffbf', ground: '#10241a', fogFar: 38 },
  quake: { bg: '#16130f', fog: '#2c2620', sky: '#ffe6c4', ground: '#2a2218', fogFar: 42 },
}

/**
 * Módulo 1 — Escena 3D del simulador + capas de UI según la fase del juego.
 * El usuario mueve al personaje libremente; las preguntas aparecen al llegar a cada punto de control.
 */
export default function SimulatorView() {
  const emergency = useEmergency()
  const phase = useGameStore((s) => s.phase)
  const avatarPos = useRef(new THREE.Vector3(...START))
  const [ready, setReady] = useState(false)
  useKeyboardMovement()
  if (!emergency) return null
  const theme = THEME[emergency.hazard]

  return (
    <section className="relative h-full w-full overflow-hidden" aria-label={`Simulación: ${emergency.name}`}>
      <div className={`absolute inset-0 ${phase === 'failing' ? 'anim-shake' : ''}`}>
        <Canvas dpr={PIXEL_DPR.simulator} camera={{ fov: 45, position: [-19, 9, 13] }} gl={{ antialias: true }}>
          <color attach="background" args={[theme.bg]} />
          <fog attach="fog" args={[theme.fog, 12, theme.fogFar]} />
          <hemisphereLight args={[theme.sky, theme.ground, 1.5]} />
          <directionalLight position={[8, 20, 10]} intensity={1.2} />
          <Suspense fallback={null}>
            <ModelSlot url={MODELS.basement} fallback={<BasementScene />} />
            <Avatar positionRef={avatarPos} />
            <CheckpointBeacon />
            <HazardEffects hazard={emergency.hazard} avatarRef={avatarPos} />
          </Suspense>
          <CameraRig targetRef={avatarPos} hazard={emergency.hazard} />
          <ReadySignal onReady={() => setReady(true)} />
        </Canvas>
      </div>

      {!ready && <LoadingScreen label="Preparando los sótanos" />}
      <SimHUD />
      {phase === 'intro' && <StoryModal />}
      {phase === 'deciding' && <DecisionModal />}
      {phase === 'failing' && <ChaosOverlay />}
      {phase === 'failed' && <FeedbackModal />}
      {phase === 'won' && <VictoryModal />}
      {phase === 'walking' && <SuccessToast />}
      {phase === 'walking' && <MoveControls />}
    </section>
  )
}
