import { Suspense, useEffect, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import { useGameStore } from '../store/useGameStore'
import { ZONES } from '../data/zones'
import { MODELS, PIXEL_DPR } from '../config'
import CampusModel from '../components/three/CampusModel'
import Hotspot from '../components/three/Hotspot'
import ModelSlot from '../components/three/ModelSlot'
import InfoCard from '../components/ui/InfoCard'
import { GlassPanel, IconButton, LoadingScreen, PixelIcon } from '../components/ui/primitives'
import ReadySignal from '../components/three/ReadySignal'

/** Vistas generales de la cámara. */
const VIEWS = {
  iso: { label: 'Isométrica', position: [28, 28, 34], target: [0, 0, 2] },
  top: { label: 'Cenital', position: [0, 56, 6], target: [0, 0, 2] },
}

/**
 * Módulo 2 — Mapa 3D interactivo: campus con pins, enfoque suave de cámara (GSAP) y fichas.
 */
export default function MapView() {
  const { selectedZone, selectZone, goHome, goTo } = useGameStore()
  const [view, setView] = useState('iso')
  const [ready, setReady] = useState(false)

  return (
    <section className="relative h-full w-full overflow-hidden" aria-label="Mapa 3D interactivo">
      <div className="pixelated absolute inset-0">
        <Canvas
          dpr={PIXEL_DPR.map}
          camera={{ position: VIEWS.iso.position, fov: 40 }}
          gl={{ antialias: false }}
          onPointerMissed={() => selectZone(null)}
        >
          <color attach="background" args={['#1b1830']} />
          <fog attach="fog" args={['#1b1830', 60, 120]} />
          <hemisphereLight args={['#fff1dc', '#2a3a2a', 1.5]} />
          <directionalLight position={[14, 24, 10]} intensity={1.5} />
          <Suspense fallback={null}>
            <ModelSlot url={MODELS.campus} fallback={<CampusModel />} />
            {ZONES.map((z, i) => (
              <Hotspot key={z.id} zone={z} index={i} active={selectedZone === z.id} onSelect={selectZone} />
            ))}
          </Suspense>
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            minDistance={6}
            maxDistance={80}
            maxPolarAngle={Math.PI / 2.15}
            target={VIEWS.iso.target}
          />
          <CameraFocus selectedZone={selectedZone} view={view} />
          <ReadySignal onReady={() => setReady(true)} />
        </Canvas>
      </div>

      {/* Barra superior */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-end gap-3 p-3 sm:justify-between sm:p-4">
        <GlassPanel large={false} className="pointer-events-auto hidden px-4 py-3 sm:block">
          <p className="font-pixel text-[0.55rem] text-white/70 uppercase">Módulo 2</p>
          <h1 className="font-pixel text-[0.75rem] leading-relaxed">Mapa 3D · UAO</h1>
        </GlassPanel>
        <div className="pointer-events-auto flex gap-2">
          <GlassPanel large={false} className="flex p-1" role="group" aria-label="Tipo de vista">
            {Object.entries(VIEWS).map(([key, v]) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                onClick={() => {
                  selectZone(null)
                  setView(key)
                }}
                className={`pixel-corners cursor-pointer px-3 py-2 font-pixel text-[0.5rem] uppercase ${view === key ? 'bg-uao-red' : 'hover:bg-white/10'}`}
              >
                {v.label}
              </button>
            ))}
          </GlassPanel>
          <IconButton icon="home" label="Volver al inicio" onClick={goHome} />
        </div>
      </header>

      {/* Lista de zonas (accesible por teclado; alternativa a los pins) */}
      {!selectedZone && (
        <nav
          aria-label="Zonas del campus"
          className="absolute inset-x-0 bottom-0 z-20 flex gap-2 overflow-x-auto p-3 sm:inset-x-auto sm:top-24 sm:bottom-auto sm:left-4 sm:w-60 sm:flex-col sm:overflow-visible sm:p-0"
        >
          {ZONES.map((z, i) => (
            <button
              key={z.id}
              type="button"
              onClick={() => selectZone(z.id)}
              className="glass-pixel pixel-corners flex shrink-0 cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition hover:bg-uao-red/60 focus-visible:outline-3 focus-visible:outline-signal-amber"
            >
              <PixelIcon name="pin" size={14} color="#ff4d5e" />
              <span className="text-[0.95rem] font-semibold">
                <span className="mr-1.5 font-pixel text-[0.5rem] text-white/60">{i + 1}</span>
                {z.name}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => goTo('select')}
            className="btn-pixel pixel-corners shrink-0 sm:mt-3"
          >
            Ir al simulador
          </button>
        </nav>
      )}

      <InfoCard />
      {!ready && <LoadingScreen label="Cargando campus" />}
    </section>
  )
}

/**
 * Anima cámara y target de OrbitControls hacia la zona seleccionada (o la vista general).
 * En móvil/escritorio desplaza el punto de mira para que el pin no quede tapado por la ficha.
 */
function CameraFocus({ selectedZone, view }) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls)
  const size = useThree((s) => s.size)

  useEffect(() => {
    if (!controls) return
    const zone = ZONES.find((z) => z.id === selectedZone)
    let target
    let position
    if (zone) {
      const mobile = size.width < 640
      const [x, y, z] = zone.position
      const k = size.width / size.height < 1 ? 1.5 : 1
      const [ox, oy, oz] = zone.cameraOffset.map((v) => v * k)
      // Empuja el foco para dejar el pin visible junto a la ficha (abajo en móvil, derecha en escritorio)
      const nudge = mobile ? [0, -1.5, 3] : [1.5, 0, 0]
      target = [x + nudge[0], y + 1.5 + nudge[1], z + nudge[2]]
      position = [x + ox + nudge[0], y + oy, z + oz + nudge[2]]
    } else {
      // En pantallas verticales alejamos la cámara para que quepa todo el campus
      const k = size.width / size.height < 1 ? 1.7 : 1
      target = VIEWS[view].target
      position = VIEWS[view].position.map((v, i) => target[i] + (v - target[i]) * k)
    }

    const tl = gsap.timeline({ defaults: { duration: 1.3, ease: 'power3.inOut' }, onUpdate: () => controls.update() })
    tl.to(camera.position, { x: position[0], y: position[1], z: position[2] }, 0)
    tl.to(controls.target, { x: target[0], y: target[1], z: target[2] }, 0)
    return () => tl.kill()
  }, [selectedZone, view, controls, camera, size.width, size.height])

  return null
}
