import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../store/useGameStore'
import { Fire, Smoke, GasCloud, Dust, Explosion, Debris, FlickerLight } from './Particles'
import { LEVEL } from './basementLayout'

/**
 * Efectos ambientales por amenaza (escalan con el avance) + secuencia caótica al fallar.
 * hazard: 'fire' | 'gas' | 'quake'
 */
export default function HazardEffects({ hazard, avatarRef }) {
  const currentStep = useGameStore((s) => s.currentStep)
  const phase = useGameStore((s) => s.phase)
  const attempts = useGameStore((s) => s.attempts)

  return (
    <>
      {hazard === 'fire' && <FireAmbient step={currentStep} />}
      {hazard === 'gas' && <GasAmbient step={currentStep} />}
      {hazard === 'quake' && <QuakeAmbient step={currentStep} />}
      {phase === 'failing' && (
        <FollowAvatar avatarRef={avatarRef}>
          <ChaosBurst key={attempts} hazard={hazard} />
        </FollowAvatar>
      )}
    </>
  )
}

function FireAmbient({ step }) {
  return (
    <>
      {/* Foco: cuarto eléctrico del Sótano 2 */}
      <Fire position={[-16, LEVEL.s2, -6.5]} scale={1.4} />
      <Fire position={[-13.5, LEVEL.s2, -6.8]} scale={0.8} light={false} />
      <Smoke position={[-14, LEVEL.s2 + 2.2, -4]} scale={1.6} count={36} />
      {step >= 1 && (
        <>
          <Fire position={[10, LEVEL.s1, -6.5]} scale={1} />
          <Smoke position={[5, LEVEL.s1 + 1.8, -2]} scale={1.8} count={40} />
        </>
      )}
      {step >= 2 && <Smoke position={[14, LEVEL.s1 + 2.5, 0]} scale={1.2} />}
    </>
  )
}

function GasAmbient({ step }) {
  return (
    <>
      <GasCloud position={[-14, LEVEL.s2 + 0.6, -5]} scale={1.6} count={40} />
      <GasCloud position={[-6, LEVEL.s2 + 0.6, 4]} scale={1.2} />
      {step >= 1 && <GasCloud position={[5, LEVEL.s1 + 0.6, -3]} scale={1.5} count={36} />}
      {step >= 2 && <GasCloud position={[16, LEVEL.s1 + 1.4, 0]} scale={0.9} count={20} />}
    </>
  )
}

function QuakeAmbient({ step }) {
  return (
    <>
      {/* Mientras no se tome la 1ª decisión, sigue temblando: polvo cayendo por todo el sótano */}
      {step === 0 && <Dust position={[-12, LEVEL.s2 + 3.2, 0]} area={[20, 0.5, 14]} count={120} />}
      {step === 0 && <FlickerLight position={[-12, 2.5, 0]} color="#ffe6c4" intensity={3} distance={14} speed={30} />}
      {/* Escombros estáticos */}
      {[
        [-15, LEVEL.s2, 2.5, 0.5],
        [-7.5, LEVEL.s2, -4, 0.7],
        [6, LEVEL.s1, 3, 0.6],
        [11, LEVEL.s1, -2.8, 0.4],
      ].map(([x, y, z, s]) => (
        <mesh key={`${x}${z}`} position={[x, y + s / 2, z]} rotation={[0.3, x, 0.2]}>
          <boxGeometry args={[s, s, s * 1.3]} />
          <meshLambertMaterial color="#8a8378" flatShading />
        </mesh>
      ))}
    </>
  )
}

/** Mantiene a sus hijos sobre la posición actual del avatar. */
function FollowAvatar({ avatarRef, children }) {
  const ref = useRef(null)
  useFrame(() => ref.current.position.copy(avatarRef.current))
  return <group ref={ref}>{children}</group>
}

/** Secuencia caótica "Dumb Ways to Die": exagerada, ruidosa, pero breve. */
function ChaosBurst({ hazard }) {
  if (hazard === 'fire')
    return (
      <>
        <Fire position={[0, 0, 0]} scale={1.8} />
        <Smoke position={[0, 1.5, 0]} scale={1.5} count={40} />
      </>
    )
  if (hazard === 'gas')
    return (
      <>
        <Explosion position={[0, 0.8, 0]} />
        <Smoke position={[0, 1.2, 0]} scale={1.4} />
      </>
    )
  return <Debris position={[0, 0, 0]} />
}
