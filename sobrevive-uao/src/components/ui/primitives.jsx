import { useEffect, useRef } from 'react'
import { ICONS, spriteToCanvas, AVATAR_FRAMES, drawCampusVignette } from '../../utils/sprites'

/**
 * Primitivas de UI reutilizables: panel glass, botones, iconos y sprites pixel.
 */

/** Panel "liquid glass" con esquinas pixel. */
export function GlassPanel({ as: Tag = 'div', light = false, large = true, className = '', children, ...rest }) {
  return (
    <Tag
      className={`${light ? 'glass-pixel-light' : 'glass-pixel'} pixel-corners ${large ? 'pixel-corners-lg' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Botón principal pixel. variant: 'primary' | 'ghost' | 'green' */
export function PixelButton({ variant = 'primary', className = '', children, ...rest }) {
  const v = variant === 'primary' ? '' : variant
  return (
    <button type="button" className={`btn-pixel pixel-corners ${v} ${className}`} {...rest}>
      {children}
    </button>
  )
}

/** Icono pixel en SVG (crispEdges). */
export function PixelIcon({ name, size = 18, color = 'currentColor', className = '' }) {
  const grid = ICONS[name]
  if (!grid) return null
  const w = Math.max(...grid.map((r) => r.length))
  const h = grid.length
  return (
    <svg
      width={size}
      height={(size * h) / w}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {grid.flatMap((row, y) =>
        [...row].map((c, x) => (c === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} /> : null)),
      )}
    </svg>
  )
}

/** Botón circular de navegación (home / back / retry) como en el wireframe. */
export function IconButton({ icon, label, solid = false, className = '', ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`grid size-12 cursor-pointer place-items-center rounded-full ${solid ? 'bg-carbon-800' : 'bg-white/15'} text-white shadow-[inset_0_-4px_0_rgb(0_0_0/0.3),inset_0_2px_0_rgb(255_255_255/0.25)] backdrop-blur-md transition hover:bg-uao-red focus-visible:outline-3 focus-visible:outline-signal-amber active:translate-y-0.5 ${className}`}
      {...rest}
    >
      <PixelIcon name={icon} size={18} />
    </button>
  )
}

/** Dibuja un sprite pixel (matriz) escalado en un <canvas>. */
export function PixelSprite({ frame = 'idle', rows, scale = 6, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const src = spriteToCanvas(rows ?? AVATAR_FRAMES[frame])
    const c = ref.current
    c.width = src.width
    c.height = src.height
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.drawImage(src, 0, 0)
  }, [frame, rows])
  return (
    <canvas
      ref={ref}
      className={`pixelated ${className}`}
      style={{ width: 16 * scale, height: 20 * scale }}
      aria-hidden="true"
    />
  )
}

/** Viñeta pixel del campus con variante de emergencia; anima mientras `animate` sea true. */
export function CampusVignette({ variant = 'base', animate = false, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = ref.current.getContext('2d')
    let frame = 0
    drawCampusVignette(ctx, variant, frame)
    if (!animate) return
    const id = setInterval(() => drawCampusVignette(ctx, variant, ++frame), 140)
    return () => clearInterval(id)
  }, [variant, animate])
  return <canvas ref={ref} width={48} height={36} className={`pixelated ${className}`} aria-hidden="true" />
}

/** Wordmark temporal. Reemplazar por el logo oficial (SVG) en /public/images. */
export function UaoMark({ className = '' }) {
  return (
    <span className={`font-sans text-2xl font-bold tracking-tight text-uao-red lowercase ${className}`} aria-label="UAO">
      uao
    </span>
  )
}

/** Pantalla de carga pixel mientras la escena 3D compila shaders/texturas. */
export function LoadingScreen({ label = 'Cargando escena' }) {
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-carbon-950" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-5">
        <PixelSprite frame="walkA" scale={4} className="anim-float" />
        <p className="font-pixel text-[0.65rem] text-white/80">
          {label}
          <span className="anim-blink">…</span>
        </p>
      </div>
    </div>
  )
}
