import { useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { EMERGENCIES, EMERGENCY_ORDER } from '../data/emergencies'
import { CampusVignette, GlassPanel, IconButton, PixelButton, SoundToggle } from '../components/ui/primitives'

/**
 * Selección de amenaza (wireframe 04): 3 imágenes circulares de la universidad.
 * Hover/focus → la misma imagen pero con su emergencia en pixel art.
 */
export default function EmergencySelect() {
  const { selectEmergency, goHome } = useGameStore()
  const [hovered, setHovered] = useState(null)

  return (
    <section className="relative z-10 flex h-full flex-col overflow-y-auto bg-carbon-950/45 p-4">
      <header className="flex justify-end gap-2">
        <SoundToggle />
        <IconButton icon="home" label="Volver al inicio" onClick={goHome} />
      </header>

      <div className="m-auto w-full max-w-4xl py-6 text-center">
        <p className="font-pixel text-[0.6rem] text-signal-amber uppercase">Módulo 1 · Simulador 3D</p>
        <h1 className="mt-3 font-pixel text-lg leading-relaxed sm:text-2xl">Elige la emergencia</h1>

        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {EMERGENCY_ORDER.map((id) => {
            const e = EMERGENCIES[id]
            const active = hovered === id
            return (
              <li key={id} className="flex flex-col items-center">
                <button
                  type="button"
                  aria-label={`Ver ${e.name}`}
                  className="group relative size-40 cursor-pointer overflow-hidden rounded-full outline-none ring-4 ring-white/20 transition hover:ring-uao-red focus-visible:ring-signal-amber sm:size-44"
                  style={active ? { boxShadow: `0 0 0 8px ${e.accent}55` } : undefined}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => selectEmergency(id)}
                >
                  <CampusVignette variant={active ? e.hazard : 'base'} animate={active} className={`size-full ${active && e.hazard === 'quake' ? 'anim-shake' : ''}`} />
                </button>
                <GlassPanel large={false} className="mt-5 w-full max-w-56 p-1">
                  <PixelButton
                    className="w-full"
                    onClick={() => selectEmergency(id)}
                    onMouseEnter={() => setHovered(id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {e.name}
                  </PixelButton>
                </GlassPanel>
              </li>
            )
          })}
        </ul>
        <p className="mt-10 text-white/70">Pasa el cursor por cada imagen para ver la emergencia.</p>
      </div>
    </section>
  )
}
