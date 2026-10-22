import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../store/useGameStore'
import { spriteToTexture } from '../../utils/sprites'
import { CHECKPOINTS, SAFE_ZONE } from './basementLayout'

/**
 * Señal "!" flotando sobre el siguiente punto de control (o el punto de encuentro al final):
 * indica a dónde ir sin marcar el camino. Solo se ve mientras el personaje camina.
 */
const MARK = [
  '.kkkk.',
  'kyyyyk',
  'kyyyyk',
  'kyyyyk',
  '.kyyk.',
  '.kyyk.',
  '..kk..',
  '.kkkk.',
  'kyyyyk',
  '.kkkk.',
]
const W = 0.6
const H = (W * MARK.length) / MARK[0].length

export default function CheckpointBeacon() {
  const phase = useGameStore((s) => s.phase)
  const step = useGameStore((s) => s.currentStep)
  const sprite = useRef(null)
  const texture = useMemo(() => spriteToTexture(MARK, { k: '#3a2408', y: '#ffc23a' }), [])
  const [x, y, z] = CHECKPOINTS[step] ?? SAFE_ZONE.center

  useFrame(({ clock }) => {
    if (sprite.current) sprite.current.position.y = y + 2.6 + Math.abs(Math.sin(clock.elapsedTime * 2.5)) * 0.3
  })

  if (phase !== 'walking') return null
  return (
    <sprite ref={sprite} position={[x, y + 2.6, z]} scale={[W, H, 1]}>
      <spriteMaterial map={texture} alphaTest={0.5} fog={false} toneMapped={false} />
    </sprite>
  )
}
