/**
 * Configuración global de "Sobrevive a la UAO".
 * Todo lo que se espera ajustar al integrar assets finales vive aquí.
 */

/** Resolución de render del canvas 3D (<1 = píxeles más gruesos). Se combina con CSS `image-rendering: pixelated`. */
export const PIXEL_DPR = { simulator: 0.5, map: 0.6, home: 0.45 }

/** Duración de la secuencia caótica antes de mostrar la tarjeta reflexiva (ms). */
export const CHAOS_DURATION_MS = 2600

/** Duración del toast de acierto (ms). */
export const TOAST_DURATION_MS = 2600

/** Velocidad de caminata del avatar (unidades/seg). */
export const WALK_SPEED = 3.4

/**
 * Rutas a modelos .glb/.gltf finales (colócalos en /public/models).
 * Mientras sean `null` se usa el placeholder procedural pixel art.
 * Ej: basement: '/models/sotanos-uao.glb'
 */
export const MODELS = {
  basement: null,
  campus: null,
}
