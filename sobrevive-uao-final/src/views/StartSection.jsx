import { useGameStore } from '../store/useGameStore'
import { CHARACTERS } from '../data/characters'
import { CharacterSprite, GlassPanel, PixelButton, SoundToggle, UaoMark } from '../components/ui/primitives'

/**
 * Sección 3 de la portada: invitación a iniciar la experiencia
 * (luego: elegir personaje → elegir emergencia → simulación).
 */
export default function StartSection() {
  const goTo = useGameStore((s) => s.goTo)
  return (
    <section className="relative z-10 grid h-full place-items-center p-4">
      <SoundToggle className="absolute top-4 right-4 z-20" />
      <GlassPanel className="anim-pop flex w-full max-w-lg flex-col items-center px-6 py-8 text-center sm:px-10">
        <div className="flex items-end gap-3">
          {CHARACTERS.map((c) => (
            <CharacterSprite key={c.id} character={c} anim="jump" scale={3} />
          ))}
        </div>
        <h2 className="mt-5 font-pixel text-lg leading-relaxed sm:text-2xl">¿Listo para sobrevivir?</h2>
        <p className="mt-3 text-lg leading-snug text-white/90">
          Elige tu personaje, enfrenta una emergencia en los sótanos y toma las decisiones correctas para llegar al punto de
          encuentro.
        </p>
        <PixelButton className="mt-7 !px-8 !py-4 !text-[0.8rem]" onClick={() => goTo('character')}>
          Iniciar la experiencia
        </PixelButton>
      </GlassPanel>
      <UaoMark className="absolute bottom-6 left-1/2 -translate-x-1/2" />
    </section>
  )
}
