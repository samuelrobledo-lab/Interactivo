import { useGameStore } from '../store/useGameStore'
import { GlassPanel, PixelButton, PixelSprite, UaoMark } from '../components/ui/primitives'

/**
 * Pantalla de inicio (wireframe 01): logo "Sobrevive", botones Inicio / Mapa, información y marca UAO.
 * El fondo 3D (campus girando 360°) lo pone <CampusBackdrop/> desde App.
 */
export default function Home() {
  const goTo = useGameStore((s) => s.goTo)
  return (
    <section className="relative z-10 grid h-full place-items-center overflow-y-auto p-4">
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <div className="anim-float mb-2 flex items-end gap-2">
          <PixelSprite frame="scared" scale={4} />
          <PixelSprite frame="idle" scale={4} />
        </div>

        <GlassPanel className="anim-pop px-8 py-5 sm:px-12">
          <h1 className="font-pixel text-3xl leading-tight drop-shadow-[4px_4px_0_#8b0000] sm:text-5xl">Sobrevive</h1>
          <p className="mt-2 font-pixel text-[0.6rem] tracking-widest text-signal-amber uppercase sm:text-xs">a la UAO</p>
        </GlassPanel>

        <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:flex-row sm:gap-10">
          <PixelButton className="sm:min-w-44" onClick={() => goTo('select')}>
            Inicio
          </PixelButton>
          <PixelButton variant="ghost" className="sm:min-w-44" onClick={() => goTo('map')}>
            Mapa
          </PixelButton>
        </div>

        <GlassPanel large={false} className="anim-rise mt-8 max-w-md px-5 py-4 text-left">
          <h2 className="font-pixel text-[0.55rem] text-white/70 uppercase">Información de la experiencia</h2>
          <p className="mt-2 text-[1.05rem] leading-snug text-white/90">
            Enfréntate a un <strong>incendio</strong>, una <strong>fuga de gas</strong> o un <strong>terremoto</strong> en los sótanos de
            la universidad. Toma 3 decisiones clave y llega al punto de encuentro. Equivocarse aquí es gratis: aprende antes de que
            sea real.
          </p>
        </GlassPanel>

        <UaoMark className="mt-6" />
      </div>
    </section>
  )
}
