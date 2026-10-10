/**
 * Recorrido del avatar en el escenario de sótanos (placeholder).
 *
 * Cada punto: p = [x, y, z]; `stop` marca un punto de control:
 *   0, 1, 2 → abre la decisión con ese índice
 *   'safe'  → llegada a zona segura (victoria)
 *
 * ⚠️ Al integrar el GLB final de los sótanos, ajusta estas coordenadas
 *    (o exporta "empties" desde Blender y léelos del GLTF).
 */
export const PATH = [
  { p: [-19, 0, 3] }, // inicio: Sótano 2 (bicicletero)
  { p: [-10, 0, -2.5], stop: 0 }, // frente a ascensor / escaleras
  { p: [-6, 0, 0] },
  { p: [-2, 1.2, 0] }, // subida por escaleras → Sótano 1
  { p: [4, 1.2, -1.5], stop: 1 }, // pasillo Sótano 1
  { p: [13.5, 1.2, 0] },
  { p: [18, 2.4, 0] }, // rampa de salida → exterior
  { p: [21, 2.4, 0], stop: 2 }, // afuera, frente al edificio
  { p: [27, 2.4, 3], stop: 'safe' }, // punto de encuentro
]

/** Niveles de piso (y superior) — útiles para colocar props. */
export const LEVEL = { s2: 0, s1: 1.2, outside: 2.4 }
