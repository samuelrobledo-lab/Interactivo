import { useEffect, useRef } from 'react'
import { useGameStore, useEmergency } from '../../store/useGameStore'
import { GlassPanel, IconButton, PixelButton, PixelSprite } from './primitives'

/**
 * Capas 2D del simulador (Módulo 1). Cada una se muestra según `phase`:
 *   SimHUD          → siempre (barra superior + progreso)
 *   StoryModal      → intro
 *   DecisionModal   → deciding
 *   ChaosOverlay    → failing
 *   FeedbackModal   → failed
 *   VictoryModal    → won
 *   SuccessToast    → walking (tras acierto)
 */

/** Contenedor modal centrado con foco automático en el primer botón. */
function Modal({ children, label, tone = 'dim', align = 'center' }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.querySelector('button')?.focus({ preventScroll: true })
  }, [])
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className={`absolute inset-0 z-30 grid justify-items-center p-4 ${align === 'end' ? 'items-end pb-6' : 'items-center'} ${tone === 'dim' ? 'bg-carbon-950/45' : tone === 'clear' ? 'bg-gradient-to-t from-carbon-950/70 to-transparent' : 'bg-uao-wine/40'}`}
    >
      {children}
    </div>
  )
}

export function SimHUD() {
  const emergency = useEmergency()
  const { currentStep, phase, goHome, goTo } = useGameStore()
  if (!emergency) return null
  const total = emergency.decisions.length
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4">
      <GlassPanel large={false} className="pointer-events-auto flex items-center gap-3 px-4 py-3">
        <span className="size-3 shrink-0" style={{ background: emergency.accent }} aria-hidden="true" />
        <div>
          <p className="font-pixel text-[0.55rem] text-white/70 uppercase">Simulador</p>
          <p className="font-pixel text-[0.7rem] leading-relaxed">{emergency.name}</p>
        </div>
        <ol className="ml-2 flex gap-1.5" aria-label={`Decisión ${Math.min(currentStep + 1, total)} de ${total}`}>
          {emergency.decisions.map((d, i) => (
            <li
              key={d.id}
              className={`size-3 ${i < currentStep ? 'bg-signal-green' : i === currentStep && phase !== 'won' ? 'bg-signal-amber anim-blink' : 'bg-white/25'}`}
            />
          ))}
        </ol>
      </GlassPanel>
      <div className="pointer-events-auto flex gap-2">
        <IconButton icon="map" label="Ir al mapa 3D" onClick={() => goTo('map')} />
        <IconButton icon="home" label="Volver al inicio" onClick={goHome} />
      </div>
    </header>
  )
}

export function StoryModal() {
  const emergency = useEmergency()
  const beginRun = useGameStore((s) => s.beginRun)
  return (
    <Modal label="Historia">
      <GlassPanel className="anim-pop w-full max-w-2xl p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <PixelSprite frame="scared" scale={5} className="mx-auto shrink-0 anim-float" />
          <div>
            <p className="font-pixel text-[0.6rem] text-signal-amber uppercase">{emergency.story.title}</p>
            <h2 className="mt-2 font-pixel text-base leading-relaxed sm:text-lg">{emergency.name}</h2>
            <div className="mt-4 space-y-2 text-lg leading-snug text-white/90">
              {emergency.story.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <PixelButton onClick={beginRun}>¡Comenzar!</PixelButton>
        </div>
      </GlassPanel>
    </Modal>
  )
}

export function DecisionModal() {
  const emergency = useEmergency()
  const { currentStep, choose } = useGameStore()
  const decision = emergency.decisions[currentStep]
  return (
    <Modal label="Pregunta" align="end" tone="clear">
      <GlassPanel key={decision.id} className="anim-pop w-full max-w-xl p-6 text-center sm:p-8">
        <p className="font-pixel text-[0.55rem] text-white/70 uppercase">
          Decisión {currentStep + 1}/{emergency.decisions.length} · {decision.moment}
        </p>
        <h2 className="mt-4 font-sans text-2xl font-bold leading-tight sm:text-3xl">{decision.prompt}</h2>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {decision.options.map((opt, i) => (
            <PixelButton
              key={opt.id}
              variant="ghost"
              className="h-full text-left normal-case hover:bg-uao-red"
              onClick={() => choose(opt)}
            >
              <span className="mb-2 block text-signal-amber">Opción {i + 1}</span>
              <span className="font-sans text-base font-semibold leading-snug">{opt.label}</span>
            </PixelButton>
          ))}
        </div>
      </GlassPanel>
    </Modal>
  )
}

export function ChaosOverlay() {
  const option = useGameStore((s) => s.failedOption)
  return (
    <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center overflow-hidden" aria-live="assertive">
      <div className="anim-flash absolute inset-0 bg-uao-red mix-blend-screen" />
      <p className="anim-shake relative px-6 text-center font-pixel text-xl leading-relaxed text-white drop-shadow-[4px_4px_0_#8b0000] sm:text-3xl">
        {option?.chaosLine ?? '¡¡OH NO!!'}
      </p>
    </div>
  )
}

export function FeedbackModal() {
  const { feedbackMessage: fb, retry, goHome } = useGameStore()
  if (!fb) return null
  return (
    <Modal label="Retroalimentación" tone="red">
      <GlassPanel light className="anim-pop w-full max-w-lg p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <PixelSprite frame="scared" scale={3} className="shrink-0" />
          <div>
            <p className="font-pixel text-[0.6rem] text-uao-red uppercase">Te equivocaste por…</p>
            <h2 className="mt-2 text-2xl leading-tight font-bold">{fb.title.replace(/^Te equivocaste por /, '')}</h2>
          </div>
        </div>
        <dl className="mt-5 space-y-4 text-[1.05rem] leading-snug">
          <div>
            <dt className="font-pixel text-[0.55rem] text-carbon-700 uppercase">¿Qué pasó?</dt>
            <dd className="mt-1">{fb.why}</dd>
          </div>
          <div className="bg-uao-red/10 p-3 pixel-corners">
            <dt className="font-pixel text-[0.55rem] text-uao-wine uppercase">Lo que aprendiste</dt>
            <dd className="mt-1 font-bold">{fb.learned}</dd>
          </div>
          <div>
            <dt className="font-pixel text-[0.55rem] text-carbon-700 uppercase">¿Cómo evitarlo?</dt>
            <dd className="mt-1">{fb.avoid}</dd>
          </div>
        </dl>
        <div className="mt-6 flex items-center justify-center gap-3">
          <PixelButton onClick={retry}>Reintentar</PixelButton>
          <IconButton icon="home" label="Volver al inicio" onClick={goHome} solid />
        </div>
      </GlassPanel>
    </Modal>
  )
}

export function VictoryModal() {
  const { mistakes, goHome, goTo } = useGameStore()
  const emergency = useEmergency()
  const goToSelect = () => goTo('select')
  return (
    <Modal label="Lo lograste">
      <GlassPanel className="anim-pop w-full max-w-lg p-6 text-center sm:p-8">
        <PixelSprite frame="happy" scale={6} className="mx-auto anim-float" />
        <h2 className="mt-4 font-pixel text-xl leading-relaxed sm:text-2xl">Lo lograste :)</h2>
        <p className="mt-3 text-lg text-white/90">
          Llegaste al punto de encuentro durante el simulacro de <strong>{emergency.name.toLowerCase()}</strong>
          {mistakes.length === 0 ? ' sin un solo error. ¡Brigadista en potencia!' : ` con ${mistakes.length} error(es) en el camino. ¡Ahora ya sabes qué no hacer!`}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <PixelButton onClick={goToSelect}>Otra emergencia</PixelButton>
          <PixelButton variant="ghost" onClick={() => goTo('map')}>
            Ver mapa 3D
          </PixelButton>
          <IconButton icon="home" label="Volver al inicio" onClick={goHome} />
        </div>
      </GlassPanel>
    </Modal>
  )
}

export function SuccessToast() {
  const toast = useGameStore((s) => s.toast)
  if (!toast) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-4" role="status">
      <GlassPanel large={false} className="anim-rise flex items-center gap-3 px-5 py-3">
        <span className="grid size-7 place-items-center bg-signal-green text-carbon-950 pixel-corners">✓</span>
        <span className="text-lg font-semibold">{toast}</span>
      </GlassPanel>
    </div>
  )
}
