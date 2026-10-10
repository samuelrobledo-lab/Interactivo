import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import CampusModel from '../components/three/CampusModel'
import ModelSlot from '../components/three/ModelSlot'
import { MODELS, PIXEL_DPR } from '../config'

/**
 * Fondo del Home / Selección: "Ilustración pixel art de la universidad en movimiento 360".
 * Se mantiene montado entre ambas pantallas para no recargar la escena.
 */
export default function CampusBackdrop() {
  return (
    <div className="pixelated pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas dpr={PIXEL_DPR.home} camera={{ position: [26, 18, 30], fov: 40 }} gl={{ antialias: false }}>
        <color attach="background" args={['#2b2350']} />
        <fog attach="fog" args={['#2b2350', 40, 90]} />
        <hemisphereLight args={['#ffd9b8', '#3a2a50', 1.4]} />
        <directionalLight position={[12, 20, 8]} intensity={1.6} color="#ffe2c0" />
        <Suspense fallback={null}>
          <ModelSlot url={MODELS.campus} fallback={<CampusModel />} />
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} enablePan={false} enableRotate={false} target={[0, 2, 0]} />
      </Canvas>
      {/* Viñeta para legibilidad del UI */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgb(13_13_16/0.75)_80%)]" />
    </div>
  )
}
