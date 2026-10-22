import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { landing, setLanding } from '../store/landingProgress'
import Home from './Home'
import MapView from './MapView'
import StartSection from './StartSection'

/**
 * Portada en 3 secciones que se recorren con scroll:
 *   0 · Intro (amanecer + título)   1 · Mapa 3D interactivo   2 · Comenzar la experiencia
 *
 * Transición progresiva hacia abajo: la posición (`pos`, de 0 a 2) sigue el movimiento del usuario
 * —rueda del mouse, touchpad, flechas del teclado o deslizar en pantallas táctiles—.
 * Los textos de cada sección se deslizan verticalmente como una página, mientras detrás la cámara de
 * <CampusStage/> recorre el campus sin cortes y el cielo pasa del amanecer al día.
 * Al soltar, se acomoda en la sección más cercana.
 */

const SECTIONS = [
  { id: 'intro', label: 'Inicio' },
  { id: 'map', label: 'Mapa 3D' },
  { id: 'start', label: 'Comenzar' },
]
const LAST = SECTIONS.length - 1
const WHEEL_PER_SECTION = 700 // px de scroll (rueda/touchpad) para pasar una sección completa
const SNAP_DELAY = 160 // ms sin movimiento antes de acomodarse
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2) // suave al salir y al llegar

function SectionContent({ index, onNext }) {
  if (index === 1) return <MapView onNext={onNext} />
  return index === 0 ? <Home onNext={onNext} /> : <StartSection />
}

const visibleAt = (pos) => SECTIONS.map((_, i) => i).filter((i) => Math.abs(i - pos) < 0.999)

export default function Landing() {
  const section = useGameStore((s) => s.landingSection)
  const setSection = useGameStore((s) => s.setLandingSection)

  // Si se vuelve desde otra pantalla (p. ej. la selección de personaje, en la sección 2), la cámara viaja desde ahí
  const pos = useRef(Math.max(0, Math.min(LAST, landing.pos)))
  const [mounted, setMounted] = useState(() => visibleAt(pos.current))
  const [settled, setSettled] = useState(section) // sección activa (para los puntos)
  const layers = useRef({})
  const snapTimer = useRef(0)
  const tween = useRef(0)
  const reduced = useRef(false)

  /** Desliza cada capa según la posición actual (la siguiente sube desde abajo). */
  const apply = useCallback(() => {
    const p = pos.current
    Object.entries(layers.current).forEach(([i, el]) => {
      if (!el) return
      const d = Number(i) - p // 0 = al frente · +1 = la que viene (abajo) · -1 = la que se fue (arriba)
      const a = Math.abs(d)
      el.style.transform = `translate3d(0, ${d * 100}%, 0)`
      el.style.zIndex = String(10 - Math.round(a * 5))
      // el mapa deja pasar el mouse al canvas 3D (sus botones activan sus propios eventos)
      el.style.pointerEvents = a < 0.5 && i !== '1' ? 'auto' : 'none'
      el.inert = a >= 0.5
    })
  }, [])

  /** Cambia la posición, monta/desmonta secciones y actualiza estilos. */
  const setPos = useCallback(
    (p) => {
      pos.current = Math.max(0, Math.min(LAST, p))
      setLanding(pos.current)
      const vis = visibleAt(pos.current)
      setMounted((prev) => (prev.join() === vis.join() ? prev : vis))
      apply()
    },
    [apply],
  )

  /** Anima hasta una sección exacta y la registra en el estado global. */
  const animateTo = useCallback(
    (target, duration = 650) => {
      cancelAnimationFrame(tween.current)
      clearTimeout(snapTimer.current)
      const from = pos.current
      const to = Math.max(0, Math.min(LAST, target))
      if (reduced.current) duration = 1
      setLanding(pos.current, -1) // en movimiento
      const start = performance.now()
      const step = (now) => {
        const t = Math.min(1, (now - start) / Math.max(1, duration * Math.abs(to - from)))
        setPos(from + (to - from) * ease(t))
        if (t < 1) tween.current = requestAnimationFrame(step)
        else {
          setLanding(to, to)
          setSettled(to)
          if (useGameStore.getState().landingSection !== to) setSection(to)
        }
      }
      tween.current = requestAnimationFrame(step)
    },
    [setPos, setSection],
  )

  /** Al detenerse: si avanzó más de un cuarto de sección, completa el paso; si no, regresa. */
  const scheduleSnap = useCallback(() => {
    clearTimeout(snapTimer.current)
    snapTimer.current = setTimeout(() => {
      const from = useGameStore.getState().landingSection
      const delta = pos.current - from
      const target = Math.abs(delta) > 0.25 ? from + Math.sign(delta) * Math.max(1, Math.round(Math.abs(delta))) : from
      animateTo(target, 450)
    }, SNAP_DELAY)
  }, [animateTo])

  /** Movimiento directo del usuario (sigue el gesto en tiempo real). */
  const nudge = useCallback(
    (delta) => {
      cancelAnimationFrame(tween.current)
      landing.settled = -1
      setPos(pos.current + delta)
      scheduleSnap()
    },
    [setPos, scheduleSnap],
  )


  // Estilos iniciales y en cada (des)montaje de capas
  useLayoutEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    apply()
  }, [mounted, apply])

  // Cambios externos (p. ej. "Ver mapa 3D" o el botón de inicio) y llegada desde otra pantalla
  useEffect(() => {
    if (pos.current !== section) animateTo(section, 800)
    else setLanding(section, section)
  }, [section, animateTo])

  // Entradas
  useEffect(() => {
    const onWheel = (e) => {
      if (e.target.closest?.('[role="dialog"], aside')) return // fichas y guías tienen su propio scroll
      const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY
      nudge(px / WHEEL_PER_SECTION)
    }
    const onKey = (e) => {
      if (['ArrowDown', 'PageDown'].includes(e.key)) animateTo(Math.round(pos.current) + 1, 800)
      if (['ArrowUp', 'PageUp'].includes(e.key)) animateTo(Math.round(pos.current) - 1, 800)
    }
    let touch = null
    const onTouchStart = (e) => {
      // sobre el mapa 3D el dedo gira la cámara: no se usa para cambiar de sección
      const onMap = e.target.closest?.('canvas') && Math.round(pos.current) === 1
      touch = onMap ? null : e.touches[0].clientY
      if (touch != null) cancelAnimationFrame(tween.current)
    }
    const onTouchMove = (e) => {
      if (touch == null) return
      const y = e.touches[0].clientY
      nudge((touch - y) / (window.innerHeight * 0.8))
      touch = y
    }
    const onTouchEnd = () => {
      touch = null
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      cancelAnimationFrame(tween.current)
      clearTimeout(snapTimer.current)
    }
  }, [nudge, animateTo])

  const next = () => animateTo(Math.round(pos.current) + 1, 800)

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {mounted.map((i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) layers.current[i] = el
            else delete layers.current[i]
          }}
          className="absolute inset-0 overflow-hidden will-change-transform"
        >
          <SectionContent index={i} onNext={next} />
        </div>
      ))}

      {/* Indicador de secciones */}
      <nav aria-label="Secciones" className="pointer-events-auto absolute top-1/2 left-3 z-50 flex -translate-y-1/2 flex-col gap-3">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={s.label}
            aria-current={settled === i ? 'step' : undefined}
            title={s.label}
            onClick={() => animateTo(i, 800)}
            className={`size-3 cursor-pointer rounded-full ring-2 ring-white/70 transition ${settled === i ? 'scale-125 bg-uao-red' : 'bg-white/30 hover:bg-white/70'}`}
          />
        ))}
      </nav>
    </div>
  )
}
