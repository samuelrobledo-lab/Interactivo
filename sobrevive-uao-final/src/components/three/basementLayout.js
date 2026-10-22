/**
 * Distribución del escenario de sótanos (placeholder) para el movimiento libre del avatar.
 *
 *   x: -23 ─── Sótano 2 ─── -5 ▸escaleras▸ -2 ─── Sótano 1 ─── 14 ▸rampa▸ 18 ─── Exterior ─── 34
 *
 * - START        punto de partida (bicicletero del Sótano 2)
 * - CHECKPOINTS  puntos donde aparece cada decisión (en orden: 0, 1, 2)
 * - SAFE_ZONE    área demarcada del punto de encuentro (victoria)
 * - floorAt / canStand  dónde se puede caminar y a qué altura (escaleras y rampa suben de forma continua)
 *
 * ⚠️ Al integrar el GLB final de los sótanos, ajusta estas coordenadas y áreas.
 */

/** Niveles de piso (y superior). */
export const LEVEL = { s2: 0, s1: 1.2, outside: 2.4 }

export const START = [-19, 0, 3]

export const CHECKPOINTS = [
  [-10, LEVEL.s2, -2.5], // frente a ascensor / escaleras (Sótano 2)
  [4, LEVEL.s1, -1.5], // pasillo del Sótano 1
  [21, LEVEL.outside, 0], // afuera, frente al edificio
]
/** Distancia a la que un punto de control abre su pregunta. */
export const CHECKPOINT_RADIUS = 1.6

export const SAFE_ZONE = { x: [25.5, 28.5], z: [1.5, 4.5], center: [27, LEVEL.outside, 3] }
export const inSafeZone = (x, z) => x >= SAFE_ZONE.x[0] && x <= SAFE_ZONE.x[1] && z >= SAFE_ZONE.z[0] && z <= SAFE_ZONE.z[1]

/** Áreas caminables: [x0, x1, z0, z1, altura en x0, altura en x1]. */
const AREAS = [
  [-22.7, -5, -7.6, 7.8, LEVEL.s2, LEVEL.s2], // Sótano 2
  [-5, -2, -1.8, 1.8, LEVEL.s2, LEVEL.s1], // escaleras
  [-2, 14, -7.6, 7.8, LEVEL.s1, LEVEL.s1], // Sótano 1
  [14, 18, -2.8, 2.8, LEVEL.s1, LEVEL.outside], // rampa de salida
  [18, 33.6, -9.6, 11.6, LEVEL.outside, LEVEL.outside], // exterior (sin pasar por la fachada)
]

const R = 0.35 // radio del avatar

/** Obstáculos redondos [x, z, radio]: columnas, palmeras y letrero. */
const POSTS = [
  ...[-20, -14].map((x) => [x, -4.5, 0.55]),
  ...[-20, -14, -8].map((x) => [x, 4.5, 0.55]),
  ...[1, 7, 12].map((x) => [x, -4.5, 0.55]),
  ...[1, 7].map((x) => [x, 4.5, 0.55]),
  [33, 0, 0.45],
  [31, -4, 0.45],
  [32, 7, 0.45],
  [19.5, -6, 0.45],
  [29, 4.8, 0.35],
]

/** Carros (cajas): [x, z, medio largo, medio ancho]. */
const CARS = [
  [-17.5, -6],
  [-11, 6],
  [-17.5, 6],
  [8.5, -6],
  [2.5, 6],
  [10, 6],
].map(([x, z]) => [x, z, 1.6, 0.75])

/** Altura del piso en (x, z), o null si ahí no hay piso. */
export function floorAt(x, z) {
  for (const [x0, x1, z0, z1, y0, y1] of AREAS) {
    if (x >= x0 && x <= x1 && z >= z0 && z <= z1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0)
  }
  return null
}

/** ¿Puede el avatar pararse en (x, z)? (hay piso y no choca con nada) */
export function canStand(x, z) {
  if (floorAt(x, z) === null) return false
  for (const [px, pz, r] of POSTS) if ((x - px) ** 2 + (z - pz) ** 2 < (r + R) ** 2) return false
  for (const [cx, cz, hx, hz] of CARS) if (Math.abs(x - cx) < hx + R && Math.abs(z - cz) < hz + R) return false
  return true
}
