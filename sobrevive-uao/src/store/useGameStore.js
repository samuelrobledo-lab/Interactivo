import { create } from 'zustand'
import { EMERGENCIES } from '../data/emergencies'
import { CHAOS_DURATION_MS, TOAST_DURATION_MS } from '../config'

/**
 * Máquina de estados global.
 *
 * screen: 'home' | 'select' | 'simulator' | 'map'
 *
 * phase (solo simulador):
 *   intro    → tarjeta "Historia" antes de iniciar
 *   walking  → el avatar camina hacia el siguiente punto de control
 *   deciding → escena pausada, DecisionModal abierto
 *   failing  → secuencia caótica (efectos 3D + overlay)
 *   failed   → FeedbackModal "Te equivocaste por…" (Reintentar / Home)
 *   won      → pantalla "Lo lograste :)"
 *
 * Los flags isPaused / hasFailed / hasWon se derivan de `phase`
 * y se guardan explícitamente para que cualquier componente los lea sin lógica extra.
 */

const PAUSED_PHASES = ['intro', 'deciding', 'failed', 'won']

const derive = (phase) => ({
  phase,
  isPaused: PAUSED_PHASES.includes(phase),
  hasFailed: phase === 'failing' || phase === 'failed',
  hasWon: phase === 'won',
})

const simInitial = {
  selectedEmergency: null,
  currentStep: 0, // índice de la decisión actual (0..2); 3 = camino a zona segura
  ...derive('idle'),
  feedbackMessage: null, // feedback de la opción incorrecta elegida
  failedOption: null,
  attempts: 0, // incrementa en cada reintento (reinicia efectos/avatar)
  runId: 0, // incrementa en cada partida nueva (avatar vuelve al inicio)
  mistakes: [], // historial de errores de la partida
  toast: null,
}

let chaosTimer = null
let toastTimer = null
const clearTimers = () => {
  clearTimeout(chaosTimer)
  clearTimeout(toastTimer)
}

export const useGameStore = create((set, get) => ({
  screen: 'home',
  selectedZone: null, // Módulo 2: id de la zona enfocada
  ...simInitial,

  /* ---------- Navegación ---------- */
  goTo: (screen) => {
    clearTimers()
    set({ screen, selectedZone: null })
  },
  goHome: () => {
    clearTimers()
    set((s) => ({ ...simInitial, runId: s.runId + 1, screen: 'home', selectedZone: null }))
  },

  /* ---------- Módulo 1: Simulador ---------- */
  selectEmergency: (id) => {
    clearTimers()
    set((s) => ({
      ...simInitial,
      selectedEmergency: id,
      runId: s.runId + 1,
      screen: 'simulator',
      ...derive('intro'),
    }))
  },

  /** Cierra la tarjeta de historia y arranca la caminata. */
  beginRun: () => set(derive('walking')),

  /** Reinicia la emergencia actual desde el principio. */
  restartRun: () => get().selectEmergency(get().selectedEmergency),

  /** Lo llama el avatar al llegar a un punto de control del recorrido. */
  arriveAt: (stop) => {
    if (stop === 'safe') return set(derive('won'))
    set({ currentStep: stop, ...derive('deciding') })
  },

  /** Resuelve una decisión. */
  choose: (option) => {
    const { selectedEmergency, currentStep } = get()
    const decision = EMERGENCIES[selectedEmergency].decisions[currentStep]

    if (option.correct) {
      clearTimeout(toastTimer)
      toastTimer = setTimeout(() => set({ toast: null }), TOAST_DURATION_MS)
      return set({
        currentStep: currentStep + 1,
        feedbackMessage: null,
        failedOption: null,
        toast: option.successLine ?? decision.successLine ?? '¡Bien hecho!',
        ...derive('walking'),
      })
    }

    set((s) => ({
      failedOption: option,
      feedbackMessage: option.feedback,
      mistakes: [...s.mistakes, { step: currentStep, optionId: option.id }],
      toast: null,
      ...derive('failing'),
    }))
    clearTimeout(chaosTimer)
    chaosTimer = setTimeout(() => set(derive('failed')), CHAOS_DURATION_MS)
  },

  /** Reintentar: vuelve al punto de control donde se tomó la mala decisión. */
  retry: () =>
    set((s) => ({
      attempts: s.attempts + 1,
      failedOption: null,
      feedbackMessage: null,
      ...derive('deciding'),
    })),

  /* ---------- Módulo 2: Mapa ---------- */
  selectZone: (id) => set({ selectedZone: id }),
}))

/** Selector útil: datos de la emergencia activa. */
export const useEmergency = () => useGameStore((s) => (s.selectedEmergency ? EMERGENCIES[s.selectedEmergency] : null))
