import { CharacterSprite, GlassPanel, ScrollHint, SoundToggle, UaoMark } from '../components/ui/primitives'
import { CHARACTERS } from '../data/characters'

/**
 * Sección 1 de la portada: logo "Sobrevive", personajes, información y marca UAO, con aviso para hacer scroll.
 * El fondo 3D (amanecer frente al Edificio Principal) lo pone <CampusStage/> desde App.
 */
/** @param onNext  pasar a la siguiente sección (la nota de scroll también es clicable) */
export default function Home({ onNext }) {
  return (
    <section className="relative z-10 grid h-full place-items-center overflow-y-auto p-4">
      <SoundToggle className="absolute top-4 right-4 z-20" />
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <div className="mb-2 flex items-end gap-3">
          {CHARACTERS.map((c) => (
            <CharacterSprite key={c.id} character={c} anim="walk" scale={3} />
          ))}
        </div>

        <GlassPanel className="anim-pop px-8 py-5 sm:px-12">
          <h1 className="font-pixel text-3xl leading-tight drop-shadow-[4px_4px_0_#8b0000] sm:text-5xl">Sobrevive</h1>
          <p className="mt-2 font-pixel text-[0.6rem] tracking-widest text-signal-amber uppercase sm:text-xs">a la UAO</p>
        </GlassPanel>

        <GlassPanel large={false} className="anim-rise mt-8 max-w-md px-5 py-4 text-left">
          <h2 className="font-pixel text-[0.55rem] text-white/70 uppercase">Información de la experiencia</h2>
          <p className="mt-2 text-[1.05rem] leading-snug text-white/90">
            Enfréntate a un <strong>incendio</strong>, una <strong>fuga de gas</strong> o un <strong>terremoto</strong> en los sótanos de
            la universidad. Toma 3 decisiones clave y llega al punto de encuentro. Equivocarse aquí es gratis: aprende antes de que
            sea real.
          </p>
        </GlassPanel>

        <UaoMark className="mt-8" />
      </div>

      {/* Nota emergente: invita a hacer scroll */}
      <ScrollHint label="Scrollea para conocer más" onClick={onNext} />
    </section>
  )
}
