import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '../../store/useGameStore'

/**
 * Cámara en 3ª persona que sigue al avatar.
 * - Se acerca en los momentos de decisión (drama)
 * - Tiembla en la secuencia caótica y durante el sismo
 * - Orbita al personaje al ganar
 * - Se aleja en pantallas angostas (móvil)
 */
const desired = new THREE.Vector3()
const lookTarget = new THREE.Vector3()

export default function CameraRig({ targetRef, hazard }) {
  const size = useThree((s) => s.size)
  const look = useRef(new THREE.Vector3())
  const elapsed = useRef(0)

  useFrame(({ camera }, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    elapsed.current += dt
    const { phase, isOutside } = useGameStore.getState()
    const narrow = size.width < 640 || size.width / size.height < 0.9
    const target = targetRef.current

    let off = narrow ? [0, 10, 13] : [0, 7, 10]
    if (phase === 'deciding' || phase === 'failed') off = off.map((v) => v * 0.78)
    if (phase === 'won') {
      const a = elapsed.current * 0.4
      off = [Math.sin(a) * 8, 5, Math.cos(a) * 8]
    }

    desired.set(target.x + off[0], target.y + off[1], target.z + off[2])
    camera.position.lerp(desired, 1 - Math.exp(-dt * 3))
    // Al ganar miramos un poco más abajo: el personaje queda en la parte alta, sobre el panel final
    lookTarget.set(target.x, target.y + (phase === 'won' ? -1.2 : 0.8), target.z)
    look.current.lerp(lookTarget, 1 - Math.exp(-dt * 5))

    let shake = 0
    if (phase === 'failing') shake = 0.35
    // Terremoto: la pantalla tiembla todo el tiempo que el personaje siga en los sótanos
    else if (hazard === 'quake' && !isOutside && phase !== 'won') shake = phase === 'walking' ? 0.16 : 0.09
    if (shake) camera.position.add(desired.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(shake))

    camera.lookAt(look.current)
  })

  return null
}
