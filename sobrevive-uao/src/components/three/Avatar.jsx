import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../store/useGameStore'
import { AVATAR_FRAMES, spriteToTexture } from '../../utils/sprites'
import { PATH } from './basementLayout'
import { WALK_SPEED } from '../../config'

/**
 * Personaje pixel art 2D (billboard) dentro de la escena 3D, estilo Soulbound.
 *
 * - walking  → recorre PATH y llama arriveAt(stop) en cada punto de control
 * - deciding → quieto, respiración
 * - failing  → pánico: corre hacia `failTarget` o da vueltas en su sitio
 * - won      → salta feliz
 *
 * Para usar un spritesheet final: reemplaza `textures` por frames cargados con
 * useTexture('/images/avatar-sheet.png') + pixelateTexture() y ajusta `offset/repeat`.
 */

const tmp = new THREE.Vector3()

export default function Avatar({ positionRef }) {
  const group = useRef(null)
  const bobber = useRef(null)
  const sprite = useRef(null)
  const material = useRef(null)

  const textures = useMemo(
    () => Object.fromEntries(Object.entries(AVATAR_FRAMES).map(([k, rows]) => [k, spriteToTexture(rows)])),
    [],
  )

  const runId = useGameStore((s) => s.runId)
  const attempts = useGameStore((s) => s.attempts)

  const pathIndex = useRef(0)
  const anchor = useRef(new THREE.Vector3(...PATH[0].p)) // último punto de control alcanzado
  const facing = useRef(1)
  const clock = useRef(0)

  // Nueva partida → volver al inicio del recorrido
  useLayoutEffect(() => {
    pathIndex.current = 0
    anchor.current.set(...PATH[0].p)
    group.current.position.copy(anchor.current)
    positionRef.current.copy(anchor.current)
  }, [runId, positionRef])

  // Reintento → volver al punto de control de la decisión fallida
  useLayoutEffect(() => {
    group.current.position.copy(anchor.current)
  }, [attempts])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const t = (clock.current += dt)
    const { phase, failedOption, arriveAt } = useGameStore.getState()
    const g = group.current.position
    let frame = 'idle'
    let bob = Math.sin(t * 3) * 0.03

    if (phase === 'walking') {
      const next = PATH[pathIndex.current + 1]
      if (next) {
        tmp.set(...next.p).sub(g)
        const dist = tmp.length()
        const step = WALK_SPEED * dt
        if (Math.abs(tmp.x) > 0.05) facing.current = Math.sign(tmp.x)
        if (dist <= step) {
          g.set(...next.p)
          pathIndex.current += 1
          if (next.stop !== undefined) {
            anchor.current.copy(g)
            arriveAt(next.stop)
          }
        } else {
          g.addScaledVector(tmp.normalize(), step)
        }
        frame = Math.floor(t * 8) % 2 ? 'walkA' : 'walkB'
        bob = Math.abs(Math.sin(t * 16)) * 0.08
      }
    } else if (phase === 'failing') {
      frame = 'scared'
      const target = failedOption?.failTarget
      if (target) {
        tmp.set(...target).sub(g)
        if (tmp.length() > 0.1) g.addScaledVector(tmp.normalize(), Math.min(6 * dt, tmp.length()))
        facing.current = Math.sin(t * 20) > 0 ? 1 : -1
      } else {
        // Pánico: correr en círculos
        const a = anchor.current
        g.set(a.x + Math.cos(t * 9) * 0.9, a.y, a.z + Math.sin(t * 9) * 0.9)
        facing.current = Math.sin(t * 9) > 0 ? -1 : 1
      }
      bob = Math.abs(Math.sin(t * 24)) * 0.25
    } else if (phase === 'won') {
      frame = 'happy'
      bob = Math.abs(Math.sin(t * 6)) * 0.5
    } else if (phase === 'deciding' || phase === 'failed') {
      frame = 'scared'
    }

    material.current.map = textures[frame]
    bobber.current.position.y = 0.8 + bob
    sprite.current.scale.x = facing.current
    positionRef.current.copy(g)
  })

  return (
    <group ref={group}>
      <group ref={bobber} position-y={0.8}>
        <Billboard>
          <mesh ref={sprite}>
            <planeGeometry args={[1.2, 1.5]} />
            <meshBasicMaterial ref={material} map={textures.idle} transparent alphaTest={0.5} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </Billboard>
      </group>
      {/* Sombra blob */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.03}>
        <circleGeometry args={[0.45, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  )
}
