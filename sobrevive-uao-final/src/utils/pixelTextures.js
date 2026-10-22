import * as THREE from 'three'
import { useMemo } from 'react'

/**
 * Texturas pixel art procedurales (canvas 2D → THREE.CanvasTexture).
 * Todas usan NearestFilter y sin mipmaps para conservar el pixelado.
 * Son placeholders: al integrar los GLB finales, `pixelateObject()` aplica
 * el mismo filtrado a las texturas del modelo.
 */

/** PRNG determinista para que las texturas sean estables entre renders. */
export function rng(seed = 1) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const shade = (hex, amt) => {
  const c = new THREE.Color(hex)
  c.offsetHSL(0, 0, amt)
  return `#${c.getHexString()}`
}

const px = (ctx, x, y, color, w = 1, h = 1) => {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

const noise = (ctx, size, base, spread, seed, w = size) => {
  const r = rng(seed)
  for (let y = 0; y < size; y++)
    for (let x = 0; x < w; x++) px(ctx, x, y, shade(base, (r() - 0.5) * spread))
}

/* ------------------------------------------------------------------ */
/* Recetas                                                             */
/* ------------------------------------------------------------------ */

const RECIPES = {
  concrete: [32, (ctx, s) => {
    noise(ctx, s, '#6d6c74', 0.06, 3)
    const r = rng(9)
    for (let i = 0; i < 6; i++) px(ctx, Math.floor(r() * s), Math.floor(r() * s), '#55545b', 2, 1)
    ctx.fillStyle = '#5c5b63'
    ctx.fillRect(0, 0, s, 1)
    ctx.fillRect(0, 0, 1, s)
  }],

  asphalt: [32, (ctx, s) => {
    noise(ctx, s, '#3a3940', 0.07, 5)
  }],

  parkingLine: [16, (ctx, s) => {
    noise(ctx, s, '#3a3940', 0.06, 7)
    px(ctx, 6, 0, '#e8c33a', 4, s)
  }],

  brick: [32, (ctx, s) => {
    px(ctx, 0, 0, '#6e3b2a', s, s)
    const r = rng(11)
    for (let row = 0; row < s / 4; row++) {
      const off = row % 2 ? 4 : 0
      for (let col = -1; col < s / 8 + 1; col++) {
        const c = shade('#b5552f', (r() - 0.5) * 0.12)
        px(ctx, col * 8 + off, row * 4, c, 7, 3)
      }
    }
  }],

  wallPaint: [16, (ctx, s) => {
    noise(ctx, s, '#8d8a93', 0.04, 13)
    px(ctx, 0, s - 4, '#c8102e', s, 3) // franja institucional
  }],

  facade: [32, (ctx, s) => {
    RECIPES.brick[1](ctx, s)
    const r = rng(21)
    for (let y = 4; y < s; y += 14)
      for (let x = 3; x < s; x += 10) {
        px(ctx, x - 1, y - 1, '#e9dcc8', 7, 9)
        px(ctx, x, y, r() > 0.7 ? '#ffd877' : '#2b3550', 5, 7)
        px(ctx, x + 2, y, '#e9dcc8', 1, 7)
      }
  }],

  roof: [16, (ctx, s) => {
    noise(ctx, s, '#8c8a86', 0.06, 17)
  }],

  grass: [16, (ctx, s) => {
    noise(ctx, s, '#4f9a45', 0.1, 23)
    const r = rng(29)
    for (let i = 0; i < 10; i++) px(ctx, Math.floor(r() * s), Math.floor(r() * s), '#7cc45f', 1, 2)
  }],

  stone: [16, (ctx, s) => {
    px(ctx, 0, 0, '#a99d88', s, s)
    const r = rng(31)
    for (let y = 0; y < s; y += 8)
      for (let x = 0; x < s; x += 8) px(ctx, x, y, shade('#d4c8ae', (r() - 0.5) * 0.08), 7, 7)
  }],

  terracotta: [16, (ctx, s) => {
    px(ctx, 0, 0, '#5a2a22', s, s)
    const r = rng(37)
    for (let y = 0; y < s; y += 4)
      for (let x = 0; x < s; x += 4) px(ctx, x, y, shade('#a2483a', (r() - 0.5) * 0.12), 3, 3)
    px(ctx, 0, 7, '#e0b25a', s, 1)
  }],

  water: [16, (ctx, s) => {
    noise(ctx, s, '#3a8fc4', 0.06, 41)
    px(ctx, 3, 4, '#9fd6f0', 4, 1)
    px(ctx, 9, 11, '#9fd6f0', 4, 1)
  }],

  hazardStripes: [16, (ctx, s) => {
    px(ctx, 0, 0, '#1b1b1f', s, s)
    for (let y = 0; y < s; y++)
      for (let x = 0; x < s; x++) if (((x + y) >> 2) % 2 === 0) px(ctx, x, y, '#f0c419')
  }],

  elevator: [32, (ctx, s) => {
    px(ctx, 0, 0, '#3e4047', s, s)
    px(ctx, 3, 2, '#b8bec8', 26, 30)
    for (let y = 2; y < 32; y += 3) px(ctx, 3, y, '#a3a9b3', 26, 1)
    px(ctx, 15, 2, '#5d626b', 2, 30)
  }],

  exitSign: [32, (ctx, s) => {
    px(ctx, 0, 0, '#0e7a3a', s, s)
    px(ctx, 1, 1, '#18a957', s - 2, s - 2)
    // flecha
    px(ctx, 6, 14, '#ffffff', 16, 4)
    for (let i = 0; i < 6; i++) px(ctx, 20 + i, 10 + i, '#ffffff', 1, 12 - i * 2)
    // persona corriendo (pixel)
    px(ctx, 8, 5, '#ffffff', 3, 3)
    px(ctx, 7, 8, '#ffffff', 4, 4)
    px(ctx, 6, 20, '#ffffff', 2, 6)
    px(ctx, 10, 20, '#ffffff', 2, 6)
  }],

  meetingSign: [32, (ctx, s) => {
    px(ctx, 0, 0, '#0e7a3a', s, s)
    px(ctx, 2, 2, '#18a957', s - 4, s - 4)
    // 4 flechas hacia el centro (símbolo de punto de encuentro)
    const w = '#ffffff'
    px(ctx, 14, 4, w, 4, 6); px(ctx, 12, 9, w, 8, 2)
    px(ctx, 14, 22, w, 4, 6); px(ctx, 12, 21, w, 8, 2)
    px(ctx, 4, 14, w, 6, 4); px(ctx, 9, 12, w, 2, 8)
    px(ctx, 22, 14, w, 6, 4); px(ctx, 21, 12, w, 2, 8)
    px(ctx, 14, 14, w, 4, 4)
  }],

  // Techos del campus: aguamarina medio con tejas pixel
  roofAqua: [32, (ctx, s) => {
    noise(ctx, s, '#4aa596', 0.05, 47)
    const r = rng(53)
    for (let y = 0; y < s; y += 8) {
      px(ctx, 0, y, '#3b8a7d', s, 1)
      for (let x = (y / 8) % 2 ? 4 : 0; x < s; x += 8) px(ctx, x, y, '#3b8a7d', 1, 8)
      px(ctx, 0, y + 1, '#6cc2b1', s, 1)
    }
    for (let i = 0; i < 14; i++) px(ctx, Math.floor(r() * s), Math.floor(r() * s), r() > 0.5 ? '#79cdbb' : '#3f9284')
  }],

  // Malla / celosía transparente (techo en arco del edificio principal)
  lattice: [16, (ctx, s) => {
    ctx.clearRect(0, 0, s, s)
    px(ctx, 0, 0, 'rgba(70, 86, 92, 0.22)', s, s) // vidrio ahumado tenue
    px(ctx, 0, 0, 'rgba(78, 86, 90, 0.95)', s, 1) // perfiles horizontales (gris oscuro)
    px(ctx, 0, 0, 'rgba(78, 86, 90, 0.95)', 1, s) // perfiles verticales
    px(ctx, 0, s / 2, 'rgba(96, 104, 108, 0.75)', s, 1) // perfil secundario
  }],

  // Follaje de setos (verdes apagados)
  leaves: [16, (ctx, s) => {
    noise(ctx, s, '#6e9659', 0.06, 61)
    const r = rng(67)
    for (let i = 0; i < 22; i++) px(ctx, Math.floor(r() * s), Math.floor(r() * s), r() > 0.5 ? '#8db574' : '#4f7442', 2, 1)
    for (let i = 0; i < 10; i++) px(ctx, Math.floor(r() * s), Math.floor(r() * s), '#9cc283')
  }],

  // Ramas que cuelgan del seto: arriba lleno, abajo con borde irregular (transparente)
  leavesDrape: [16, (ctx, s) => {
    ctx.clearRect(0, 0, s, s)
    const r = rng(71)
    for (let x = 0; x < s; x++) {
      const len = 5 + Math.floor(r() * 9)
      for (let y = 0; y < len; y++) px(ctx, x, y, y === len - 1 ? '#4f7442' : r() > 0.8 ? '#8db574' : '#6e9659')
    }
  }],

  // Tablas de madera (fuentes / estructuras en medio círculo)
  wood: [32, (ctx, s) => {
    const r = rng(83)
    for (let y = 0; y < s; y += 8) {
      const base = ['#8a6446', '#7f5b3e', '#946d4c', '#86603f'][(y / 8) % 4]
      px(ctx, 0, y, base, s, 8)
      // vetas
      for (let i = 0; i < 5; i++) px(ctx, Math.floor(r() * s), y + 2 + Math.floor(r() * 4), '#6e4e34', 3 + Math.floor(r() * 5), 1)
      px(ctx, 0, y + 1, '#a07a56', s, 1) // brillo superior de la tabla
      px(ctx, 0, y + 7, '#4f3726', s, 1) // junta entre tablas
      // uniones escalonadas + clavos
      const j = ((y / 8) % 2 ? 6 : 22)
      px(ctx, j, y, '#4f3726', 1, 8)
      px(ctx, j + 2, y + 3, '#3c2a1d')
      px(ctx, j - 3, y + 3, '#3c2a1d')
    }
  }],

  rubble: [16, (ctx, s) => {
    noise(ctx, s, '#8a8378', 0.14, 43)
  }],
}

/* ------------------------------------------------------------------ */
/* API                                                                 */
/* ------------------------------------------------------------------ */

const canvasCache = new Map()

function getCanvas(name) {
  if (canvasCache.has(name)) return canvasCache.get(name)
  const recipe = RECIPES[name]
  if (!recipe) throw new Error(`Textura pixel desconocida: ${name}`)
  const [size, draw] = recipe
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  draw(canvas.getContext('2d'), size)
  canvasCache.set(name, canvas)
  return canvas
}

/**
 * Filtrado "pixel art" estable:
 *  - de cerca (magnificación) → Nearest: píxeles nítidos
 *  - de lejos (minificación) → mipmaps: sin parpadeo ni moiré al mover la cámara
 */
export function pixelateTexture(tex) {
  tex.magFilter = THREE.NearestFilter
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.generateMipmaps = true
  tex.anisotropy = 4
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

/** Crea una textura pixel (comparte el canvas, cada instancia tiene su propio repeat). */
export function makePixelTexture(name, repeatX = 1, repeatY = repeatX) {
  const tex = new THREE.CanvasTexture(getCanvas(name))
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeatX, repeatY)
  return pixelateTexture(tex)
}

/** Hook memoizado para usar en componentes R3F. */
export function usePixelTexture(name, repeatX = 1, repeatY = repeatX) {
  return useMemo(() => makePixelTexture(name, repeatX, repeatY), [name, repeatX, repeatY])
}

/** Recorre un modelo GLTF y fuerza NearestFilter en todas sus texturas (para assets finales). */
export function pixelateObject(object3d) {
  object3d.traverse((o) => {
    if (!o.isMesh) return
    const mats = Array.isArray(o.material) ? o.material : [o.material]
    mats.forEach((m) => {
      ;['map', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap'].forEach((k) => {
        if (m[k]) {
          m[k].magFilter = THREE.NearestFilter
          m[k].minFilter = THREE.LinearMipmapLinearFilter
          m[k].generateMipmaps = true
          m[k].needsUpdate = true
        }
      })
    })
  })
  return object3d
}
