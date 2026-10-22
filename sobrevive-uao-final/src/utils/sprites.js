import * as THREE from 'three'
import { pixelateTexture, rng } from './pixelTextures'

/**
 * Sprites pixel art definidos como matrices de caracteres.
 * Cada carácter = 1 píxel según la paleta indicada ('.' = transparente).
 * (Los personajes usan spritesheets PNG: ver data/characters.js.)
 */

/** Dibuja una matriz de sprite en un canvas nuevo (tamaño 1px por celda). */
export function spriteToCanvas(rows, palette) {
  const w = Math.max(...rows.map((r) => r.length))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = rows.length
  const ctx = canvas.getContext('2d')
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === '.' || !palette[ch]) return
      ctx.fillStyle = palette[ch]
      ctx.fillRect(x, y, 1, 1)
    }),
  )
  return canvas
}

export function spriteToTexture(rows, palette) {
  return pixelateTexture(new THREE.CanvasTexture(spriteToCanvas(rows, palette)))
}

/* ------------------------------------------------------------------ */
/* Iconos UI pixel (se renderizan como <rect> SVG en PixelIcon)        */
/* ------------------------------------------------------------------ */

const mirror = (grid) => grid.map((r) => [...r].reverse().join(''))
const ARROW_LEFT = ['..#.....', '.##.....', '########', '########', '.##.....', '..#.....']

export const ICONS = {
  home: ['...##...', '..####..', '.######.', '########', '.##..##.', '.##..##.', '.##..##.'],
  back: ARROW_LEFT,
  next: mirror(ARROW_LEFT),
  retry: ['..####.#', '.#....##', '#....###', '#.......', '#......#', '#......#', '.#....#.', '..####..'],
  close: ['##....##', '.##..##.', '..####..', '...##...', '..####..', '.##..##.', '##....##'],
  pin: ['..####..', '.######.', '###..###', '###..###', '.######.', '..####..', '...##...', '...##...'],
  check: ['.......#', '......##', '.....##.', '#...##..', '##.##...', '.###....', '..#.....'],
  map: ['##..##..', '#.##.###', '#.##.#.#', '#.##.#.#', '#.##.#.#', '###.##.#', '..##..##'],
  soundOn: ['...#....', '..##..#.', '####.#.#', '####.#.#', '####.#.#', '..##..#.', '...#....'],
  soundOff: ['...#....', '..##....', '####.#.#', '####..#.', '####.#.#', '..##....', '...#....'],
  plus: ['...##...', '...##...', '########', '########', '...##...', '...##...'],
  minus: ['........', '........', '########', '########', '........', '........'],
  help: ['..####..', '.##..##.', '.....##.', '....##..', '...##...', '........', '...##...'],
  eye: ['..####..', '.#....#.', '#..##..#', '#..##..#', '.#....#.', '..####..'],
}

/* ------------------------------------------------------------------ */
/* Viñetas pixel para la selección de amenaza (hover = emergencia)     */
/* ------------------------------------------------------------------ */

/**
 * Dibuja el campus UAO en pixel art (48x36) con la variante de emergencia.
 * variant: 'base' | 'quake' | 'fire' | 'gas'; frame anima llamas/humo.
 */
export function drawCampusVignette(ctx, variant = 'base', frame = 0) {
  const W = 48
  const H = 36
  const r = rng(7 + frame * 13)
  const p = (x, y, c, w = 1, h = 1) => {
    ctx.fillStyle = c
    ctx.fillRect(x, y, w, h)
  }
  ctx.clearRect(0, 0, W, H)

  // Cielo por franjas
  const skies = {
    base: ['#3d3a7a', '#6a4f9a', '#b06a8f', '#e79a7a'],
    fire: ['#3a0f0f', '#7a1d10', '#c2401a', '#ff8a2a'],
    gas: ['#1d2b22', '#2d4a33', '#4f7a43', '#9ec26a'],
    quake: ['#3a3430', '#5c524a', '#8a7a68', '#b9a58c'],
  }[variant]
  skies.forEach((c, i) => p(0, i * 5, c, W, 5))

  const shake = variant === 'quake' ? (frame % 2 ? 1 : -1) : 0

  // Edificio (fachada de ladrillo con arcos)
  p(6 + shake, 12, '#8a3f22', 36, 14)
  p(6 + shake, 11, '#d9c7a6', 36, 1)
  for (let x = 8; x < 40; x += 4) {
    p(x + shake, 14, variant === 'fire' && r() > 0.5 ? '#ffb347' : '#ffd877', 2, 3)
    p(x + shake, 20, '#2b2238', 2, 4)
    p(x + shake, 19, '#2b2238', 2, 1)
  }
  p(20 + shake, 18, '#1a1220', 8, 8) // entrada
  // Torre central
  p(21 + shake, 6, '#a24d2a', 6, 6)
  p(21 + shake, 5, '#d9c7a6', 6, 1)

  // Plazoleta circular
  p(4, 27, '#6e3229', 40, 9)
  p(10, 29, '#b2513e', 28, 4)
  p(18, 30, '#e0b25a', 12, 2)

  // Palmas
  ;[2, 44].forEach((x) => {
    p(x, 14, '#6b4a2b', 1, 13)
    p(x - 2, 12, '#3f8f3a', 5, 1)
    p(x - 3, 13, '#2f6f2b', 2, 1)
    p(x + 2, 13, '#2f6f2b', 2, 1)
  })

  if (variant === 'fire') {
    for (let i = 0; i < 40; i++) {
      const x = 6 + Math.floor(r() * 36)
      const y = 6 + Math.floor(r() * 10)
      p(x, y, ['#ffdd55', '#ff8a2a', '#e8401c'][i % 3])
    }
    for (let i = 0; i < 30; i++) p(Math.floor(r() * W), Math.floor(r() * 8), 'rgba(30,20,20,.75)', 2, 2)
  }
  if (variant === 'gas') {
    for (let i = 0; i < 26; i++) {
      const x = Math.floor(((r() * W + frame) % W))
      const y = 14 + Math.floor(r() * 18)
      p(x, y, 'rgba(150,255,120,.45)', 3, 2)
    }
  }
  if (variant === 'quake') {
    const crack = [[14, 12], [15, 13], [15, 14], [16, 15], [15, 16], [16, 17], [33, 12], [32, 13], [33, 14], [32, 15], [31, 16]]
    crack.forEach(([x, y]) => p(x + shake, y, '#1a1220'))
    for (let i = 0; i < 10; i++) p(Math.floor(r() * W), 4 + Math.floor(r() * 26), '#c9b79c', 1, 1)
  }
}

/* ------------------------------------------------------------------ */
/* Pin del mapa (pixel art 2D, 13x19) — basado en el diseño entregado   */
/* ------------------------------------------------------------------ */

export const PIN_PALETTE = {
  k: '#2a1418', // contorno vino oscuro
  r: '#e3263a', // rojo UAO aclarado (se lee sobre el pasto)
  d: '#a50f25', // sombra lateral
  h: '#ff8a96', // brillo
}

export const PIN_SPRITE = [
  '...kkkkkkk...',
  '..krrrrrrdk..',
  '.krhrrrrrrdk.',
  'khrrrkkkrrrdk',
  'khrrk...krrdk',
  'khrk.....krdk',
  'krrk.....krdk',
  'krrrk...krrdk',
  'krrrrkkkrrrdk',
  'krrrrrrrrrrdk',
  '.krrrrrrrrdk.',
  '.krrrrrrrrdk.',
  '..krrrrrrdk..',
  '..krrrrrrdk..',
  '...krrrrdk...',
  '...krrrrdk...',
  '....krrdk....',
  '.....kdk.....',
  '......k......',
]
