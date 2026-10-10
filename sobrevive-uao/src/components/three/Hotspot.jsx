import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, useCursor } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Pin 3D interactivo (wireframe 02: "ícono pixel art con hover; al hundirlo me lleva al lugar").
 * Hover → crece + etiqueta. Click → onSelect(id).
 */
const RISK_HEX = { alto: '#c8102e', medio: '#ffb020', bajo: '#22e07a' }
const scaleTarget = new THREE.Vector3()

export default function Hotspot({ zone, index, active, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const pin = useRef(null)
  const ring = useRef(null)
  useCursor(hovered)

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    pin.current.position.y = 1.7 + Math.sin(t * 2 + index) * 0.15
    pin.current.rotation.y += dt * 0.8
    const s = active || hovered ? 1.4 : 1
    pin.current.scale.lerp(scaleTarget.set(s, s, s), 0.2)
    const r = 1 + ((t * 0.8 + index * 0.3) % 1) * 1.2
    ring.current.scale.set(r, r, r)
    ring.current.material.opacity = 1.1 - r / 2.2
  })

  const select = (e) => {
    e.stopPropagation()
    onSelect(zone.id)
  }

  return (
    <group position={zone.position}>
      <group
        ref={pin}
        onClick={select}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <sphereGeometry args={[0.55, 8, 6]} />
          <meshLambertMaterial color="#c8102e" emissive="#5a0010" flatShading />
        </mesh>
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.24, 0.24, 1.16, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position-y={-0.72} rotation-x={Math.PI}>
          <coneGeometry args={[0.4, 0.95, 6]} />
          <meshLambertMaterial color="#a00c25" flatShading />
        </mesh>
      </group>

      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.08}>
        <ringGeometry args={[0.55, 0.75, 6]} />
        <meshBasicMaterial color={RISK_HEX[zone.risk]} transparent depthWrite={false} toneMapped={false} />
      </mesh>

      {(hovered || active) && (
        <Html center position={[0, 3.3, 0]} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
          <div className="glass-pixel pixel-corners whitespace-nowrap px-3 py-2 font-pixel text-[0.55rem] text-white">
            {zone.name}
          </div>
        </Html>
      )}
    </group>
  )
}
