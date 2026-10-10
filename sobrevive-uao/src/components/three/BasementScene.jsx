import { useMemo } from 'react'
import { PATH, LEVEL } from './basementLayout'
import { TexBox, TexPlane, Car, Pillar, EmergencyLight, Extinguisher, Palm, MeetingSign } from './Props'

/**
 * Escenario placeholder de los Sótanos UAO (estilo pixel art / low-poly, vista "cutaway").
 *
 *   x: -23 ─── Sótano 2 ─── -5 ▸escaleras▸ -2 ─── Sótano 1 ─── 14 ▸rampa▸ 18 ─── Exterior ─── 34
 *
 * Sin techo y con muro sur bajo para que la cámara en 3ª persona siempre vea al avatar.
 * Reemplazar por el GLB modelado (ver ModelSlot + MODELS.basement en config.js).
 */
export default function BasementScene() {
  return (
    <group>
      <Floors />
      <Walls />
      <Stairs />
      <Ramp />
      <Outside />
      <ParkingDetails />
      <Elevator position={[-10, LEVEL.s2, -7.98]} />
      <Elevator position={[4, LEVEL.s1, -7.98]} />
      {/* Interruptor de luz (decisión de fuga de gas) */}
      <mesh position={[-12.5, LEVEL.s2 + 1.3, -7.95]}>
        <boxGeometry args={[0.3, 0.45, 0.08]} />
        <meshLambertMaterial color="#f2f0ea" />
      </mesh>
      <ExitSigns />
      <FloorArrows />
    </group>
  )
}

function Floors() {
  return (
    <>
      {/* Sótano 2: x[-23,-5] */}
      <TexBox size={[18, 0.6, 16]} position={[-14, LEVEL.s2 - 0.3, 0]} tex="concrete" repeat={[9, 8]} />
      {/* Sótano 1: x[-2,14] (bloque alto: sus laterales se ven como el desnivel) */}
      <TexBox size={[16, 1.8, 16]} position={[6, 0.3, 0]} tex="concrete" repeat={[8, 8]} />
      {/* Rellenos junto a la rampa */}
      <TexBox size={[4, 3, 5]} position={[16, 0.9, -5.5]} tex="concrete" repeat={[2, 2]} />
      <TexBox size={[4, 3, 5]} position={[16, 0.9, 5.5]} tex="concrete" repeat={[2, 2]} />
    </>
  )
}

function Walls() {
  return (
    <>
      <TexBox size={[21, 3.2, 0.4]} position={[-12.5, LEVEL.s2 + 1.6, -8.2]} tex="wallPaint" repeat={[10, 1]} />
      <TexBox size={[16, 3.2, 0.4]} position={[6, LEVEL.s1 + 1.6, -8.2]} tex="wallPaint" repeat={[8, 1]} />
      <TexBox size={[0.4, 3.2, 16.4]} position={[-23.2, LEVEL.s2 + 1.6, 0]} tex="wallPaint" repeat={[8, 1]} />
      {/* Muro sur bajo (corte para la cámara) */}
      <TexBox size={[18, 0.5, 0.4]} position={[-14, LEVEL.s2 + 0.25, 8.2]} tex="hazardStripes" repeat={[18, 1]} />
      <TexBox size={[16, 0.5, 0.4]} position={[6, LEVEL.s1 + 0.25, 8.2]} tex="hazardStripes" repeat={[16, 1]} />
      {[-20, -14, -6].map((x) => (
        <EmergencyLight key={x} position={[x, LEVEL.s2 + 2.8, -7.95]} />
      ))}
      {[0, 8].map((x) => (
        <EmergencyLight key={x} position={[x, LEVEL.s1 + 2.8, -7.95]} />
      ))}
      <Extinguisher position={[-6.8, LEVEL.s2, -7.7]} />
      <Extinguisher position={[9.5, LEVEL.s1, -7.7]} />
    </>
  )
}

function Stairs() {
  const steps = 6
  return (
    <group>
      {Array.from({ length: steps }, (_, i) => {
        const top = ((i + 1) / steps) * LEVEL.s1
        const h = top + 0.6
        return (
          <TexBox
            key={i}
            size={[0.5, h, 4]}
            position={[-5 + 0.25 + i * 0.5, top - h / 2, 0]}
            tex={i === 0 ? 'hazardStripes' : 'concrete'}
            repeat={[1, 2]}
          />
        )
      })}
      {/* Barandas */}
      {[-2.1, 2.1].map((z) => (
        <mesh key={z} position={[-3.5, 1.3, z]} rotation-z={Math.atan2(LEVEL.s1, 3)}>
          <boxGeometry args={[3.4, 0.1, 0.1]} />
          <meshLambertMaterial color="#f0c419" />
        </mesh>
      ))}
    </group>
  )
}

function Ramp() {
  const len = Math.hypot(4, LEVEL.outside - LEVEL.s1)
  const angle = Math.atan2(LEVEL.outside - LEVEL.s1, 4)
  return (
    <group>
      <TexBox size={[len, 0.3, 6]} position={[16, 1.65, 0]} rotation-z={angle} tex="asphalt" repeat={[2, 3]} />
      {[-3.1, 3.1].map((z) => (
        <TexBox key={z} size={[len, 0.5, 0.2]} position={[16, 2.05, z]} rotation-z={angle} tex="hazardStripes" repeat={[4, 1]} />
      ))}
    </group>
  )
}

function Outside() {
  const y = LEVEL.outside
  return (
    <group>
      <TexBox size={[16, 3, 24]} position={[26, y - 1.5, 0]} tex="grass" repeat={[16, 24]} />
      {/* Sendero hacia el punto de encuentro */}
      <TexBox size={[10, 0.05, 2.4]} position={[23, y + 0.02, 0.6]} rotation-y={-0.2} tex="stone" repeat={[5, 1]} />
      {/* Fachada del edificio (zona de riesgo en terremoto) */}
      <TexBox size={[16, 6, 2]} position={[26, y + 3, -11]} tex="facade" repeat={[4, 2]} />
      <mesh position={[26, y + 6.1, -11]}>
        <boxGeometry args={[16.4, 0.3, 2.4]} />
        <meshLambertMaterial color="#e2d3b8" />
      </mesh>
      {/* Área demarcada del punto de encuentro */}
      {[
        [27, 0.6, 4.5, 0.15],
        [27, 0.6, 1.5, 0.15],
        [25.5, 0.6, 3, 0.15, true],
        [28.5, 0.6, 3, 0.15, true],
      ].map(([x, , z, w, vertical], i) => (
        <mesh key={i} position={[x, y + 0.03, z]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={vertical ? [w, 3] : [3, w]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      <MeetingSign position={[29, y, 4.8]} rotation={-0.5} />
      <Palm position={[33, y, 0]} height={4.5} />
      <Palm position={[31, y, -4]} height={5} rotation={1} />
      <Palm position={[32, y, 7]} height={4} rotation={2} />
      <Palm position={[19.5, y, -6]} height={4.2} rotation={0.5} />
    </group>
  )
}

function ParkingDetails() {
  const lines = []
  for (let x = -22; x < -6; x += 3) lines.push([x, LEVEL.s2, -6], [x, LEVEL.s2, 6])
  for (let x = -1; x < 14; x += 3) lines.push([x, LEVEL.s1, -6], [x, LEVEL.s1, 6])
  return (
    <group>
      {lines.map(([x, y, z]) => (
        <mesh key={`${x}${y}${z}`} position={[x, y + 0.01, z]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.12, 3]} />
          <meshBasicMaterial color="#e8c33a" />
        </mesh>
      ))}
      {[-20, -14].map((x) => (
        <Pillar key={x} position={[x, LEVEL.s2, -4.5]} />
      ))}
      {[-20, -14, -8].map((x) => (
        <Pillar key={x} position={[x, LEVEL.s2, 4.5]} />
      ))}
      {[1, 7, 12].map((x) => (
        <Pillar key={x} position={[x, LEVEL.s1, -4.5]} />
      ))}
      {[1, 7].map((x) => (
        <Pillar key={x} position={[x, LEVEL.s1, 4.5]} />
      ))}
      <Car position={[-17.5, LEVEL.s2, -6]} color={0} />
      <Car position={[-11, LEVEL.s2, 6]} color={2} rotation={Math.PI} />
      <Car position={[-17.5, LEVEL.s2, 6]} color={4} />
      <Car position={[8.5, LEVEL.s1, -6]} color={1} />
      <Car position={[2.5, LEVEL.s1, 6]} color={3} rotation={Math.PI} />
      <Car position={[10, LEVEL.s1, 6]} color={2} />
      {/* Bicicletero (inicio) */}
      {[-21, -20.3, -19.6].map((x) => (
        <mesh key={x} position={[x, 0.45, 5.6]}>
          <torusGeometry args={[0.35, 0.05, 4, 8]} />
          <meshLambertMaterial color="#c8102e" />
        </mesh>
      ))}
    </group>
  )
}

function Elevator({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.4, 0.05]}>
        <boxGeometry args={[2.6, 2.8, 0.1]} />
        <meshLambertMaterial color="#2a2c33" />
      </mesh>
      <TexPlane tex="elevator" size={[2.1, 2.5]} position={[0, 1.3, 0.12]} />
      <mesh position={[1.6, 1.3, 0.1]}>
        <boxGeometry args={[0.18, 0.3, 0.06]} />
        <meshBasicMaterial color="#ffb020" toneMapped={false} />
      </mesh>
    </group>
  )
}

function ExitSigns() {
  return (
    <>
      <TexPlane tex="exitSign" size={[1, 1]} position={[-4, LEVEL.s2 + 2.4, -7.97]} emissive />
      <TexPlane tex="exitSign" size={[1, 1]} position={[13, LEVEL.s1 + 2.4, -7.97]} emissive />
      <TexPlane tex="exitSign" size={[1, 1]} position={[-15, LEVEL.s2 + 2.4, -7.97]} emissive />
    </>
  )
}

/** Flechas verdes en el piso a lo largo de los tramos planos del recorrido. */
function FloorArrows() {
  const arrows = useMemo(() => {
    const out = []
    for (let i = 0; i < PATH.length - 1; i++) {
      const [ax, ay, az] = PATH[i].p
      const [bx, by, bz] = PATH[i + 1].p
      if (ay !== by) continue
      const dx = bx - ax
      const dz = bz - az
      const len = Math.hypot(dx, dz)
      const rot = Math.atan2(-dz, dx)
      for (let d = 1.2; d < len - 0.8; d += 2.4) out.push({ pos: [ax + (dx / len) * d, ay + 0.02, az + (dz / len) * d], rot })
    }
    return out
  }, [])
  return arrows.map(({ pos, rot }, i) => (
    <group key={i} position={pos} rotation-y={rot}>
      <TexPlane tex="floorArrow" size={[1.3, 1.3]} rotation-x={-Math.PI / 2} emissive transparent />
    </group>
  ))
}
