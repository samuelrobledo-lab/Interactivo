import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../store/useGameStore'
import { FRAME_COUNT, frameAt, getCharacter } from '../../data/characters'
import { pixelateTexture } from '../../utils/pixelTextures'
import { CHECKPOINTS, CHECKPOINT_RADIUS, START, canStand, floorAt, inSafeZone } from './basementLayout'
import { WALK_SPEED } from '../../config'
import { inputDirection } from '../../utils/playerInput'
import { sound } from '../../audio/sound'

/**
 * Personaje pixel art 2D (billboard) dentro de la escena 3D, estilo Soulbound.
 * Usa el spritesheet del personaje elegido (data/characters.js).
 *
 * - walking  → el usuario lo mueve libremente (flechas / W A S D / cruceta táctil); anima "walk" al moverse.
 *               Al llegar al siguiente punto de control llama arriveAt(paso) y, tras las 3 decisiones,
 *               al entrar al punto de encuentro llama arriveAt('safe')
 * - deciding → quieto (fotograma 0)
 * - failing  → pánico: camina muy rápido hacia `failTarget` o en círculos
 * - won      → animación "jump" en loop
 *
 * Los sprites miran a la derecha: al moverse hacia -X se espejan (scale.x = -1).
 */

const AVATAR_HEIGHT = 1.7
const HOP = 0.12 // salto extra (unidades) en los fotogramas altos de la caminata
const tmp = new THREE.Vector3()
const dir = { x: 0, z: 0 }

export default function Avatar({ positionRef }) {
  const group = useRef(null)
  const bobber = useRef(null)
  const sprite = useRef(null)

  const character = getCharacter(useGameStore((s) => s.selectedCharacter))
  const baseTexture = useTexture(character.sheet)
  const texture = useMemo(() => {
    const t = pixelateTexture(baseTexture.clone())
    t.repeat.set(1 / FRAME_COUNT, 1)
    return t
  }, [baseTexture])
  const width = (AVATAR_HEIGHT * character.frameW) / character.frameH

  const runId = useGameStore((s) => s.runId)
  const attempts = useGameStore((s) => s.attempts)

  const anchor = useRef(new THREE.Vector3(...START)) // último punto de control alcanzado
  const facing = useRef(1)
  const clock = useRef(0)
  const lastFrame = useRef(-1)

  // Nueva partida → volver al inicio
  useLayoutEffect(() => {
    anchor.current.set(...START)
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
    const ms = t * 1000
    const { phase, failedOption, arriveAt } = useGameStore.getState()
    const g = group.current.position
    let frame = 0
    let lift = 0

    if (phase === 'walking') {
      inputDirection(dir)
      const len = Math.hypot(dir.x, dir.z)
      if (len > 0) {
        const step = (WALK_SPEED * dt) / len
        const nx = g.x + dir.x * step
        const nz = g.z + dir.z * step
        // Si choca, intenta deslizarse por cada eje (así se puede "rozar" paredes y carros)
        if (canStand(nx, nz)) g.set(nx, 0, nz)
        else if (dir.x && canStand(nx, g.z)) g.x = nx
        else if (dir.z && canStand(g.x, nz)) g.z = nz
        g.y = floorAt(g.x, g.z) ?? g.y
        if (dir.x) facing.current = Math.sign(dir.x)
        frame = frameAt('walk', ms)
        if (frame % 2 === 1) lift = HOP
      } else {
        frame = frameAt('idle', ms)
      }

      // Puntos de control: la siguiente pregunta, y al final el punto de encuentro
      const { currentStep } = useGameStore.getState()
      const cp = CHECKPOINTS[currentStep]
      if (cp && Math.hypot(g.x - cp[0], g.z - cp[2]) < CHECKPOINT_RADIUS) {
        anchor.current.copy(g)
        arriveAt(currentStep)
      } else if (!cp && inSafeZone(g.x, g.z)) {
        arriveAt('safe')
      }
    } else if (phase === 'failing') {
      frame = frameAt('panic', ms)
      const target = failedOption?.failTarget
      if (target) {
        tmp.set(...target).sub(g)
        if (Math.abs(tmp.x) > 0.05) facing.current = Math.sign(tmp.x)
        if (tmp.length() > 0.1) g.addScaledVector(tmp.normalize(), Math.min(6 * dt, tmp.length()))
      } else {
        // Pánico: correr en círculos
        const a = anchor.current
        g.set(a.x + Math.cos(t * 9) * 0.9, a.y, a.z + Math.sin(t * 9) * 0.9)
        facing.current = Math.sin(t * 9) > 0 ? -1 : 1
      }
      lift = Math.abs(Math.sin(t * 24)) * 0.2
    } else if (phase === 'won') {
      frame = frameAt('jump', ms)
      if (frame === 5) lift = 0.45 // en el aire
    }

    // Sonidos sincronizados con la animación: pasos al apoyar el pie y "boing" al despegar
    if (frame !== lastFrame.current) {
      if (phase === 'walking' && (dir.x || dir.z) && (frame === 0 || frame === 2)) sound.sfx.step()
      if (phase === 'won' && frame === 5) sound.sfx.jump()
      lastFrame.current = frame
    }
    texture.offset.x = frame / FRAME_COUNT
    bobber.current.position.y = AVATAR_HEIGHT / 2 + lift
    sprite.current.scale.x = facing.current
    positionRef.current.copy(g)

    // Al subir la rampa y llegar al exterior se acaba el temblor
    if (g.y >= 2.3 && !useGameStore.getState().isOutside) useGameStore.getState().setOutside()
  })

  return (
    <group ref={group}>
      <group ref={bobber} position-y={AVATAR_HEIGHT / 2}>
        <Billboard>
          <mesh ref={sprite}>
            <planeGeometry args={[width, AVATAR_HEIGHT]} />
            <meshBasicMaterial map={texture} transparent alphaTest={0.5} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </Billboard>
      </group>
      {/* Sombra blob */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.03}>
        <circleGeometry args={[0.5, 8]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  )
}
