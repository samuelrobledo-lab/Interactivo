/**
 * Posición del scroll de la portada (0 intro · 1 mapa · 2 comenzar), compartida entre el DOM y la escena 3D.
 * Cambia en cada cuadro durante las transiciones, por eso vive fuera de React (sin re-renders):
 * la escena la lee en useFrame y se suscribe para redibujar solo cuando cambia.
 *
 *   pos      posición continua (puede ser 0.37, 1.5…)
 *   settled  sección en la que está detenida (la cámara del mapa solo se puede mover ahí)
 */
export const landing = { pos: 0, settled: 0 }

const listeners = new Set()

export function setLanding(pos, settled = landing.settled) {
  landing.pos = pos
  landing.settled = settled
  listeners.forEach((fn) => fn())
}

export function onLandingChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
