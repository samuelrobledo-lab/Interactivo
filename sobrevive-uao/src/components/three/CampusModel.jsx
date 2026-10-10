import { TexBox, Palm, MeetingSign, Extinguisher, TexPlane } from './Props'

/**
 * Campus UAO placeholder (low-poly + texturas pixel) para el Home (giro 360) y el Mapa 3D.
 * Distribución aproximada: Edificio Principal en U, plazoleta circular, acceso a sótanos,
 * bloque B con pasillo estrecho, torre de escaleras y punto de encuentro.
 * Reemplazar por el GLB final (MODELS.campus) manteniendo las coordenadas de data/zones.js.
 */
export default function CampusModel() {
  return (
    <group>
      {/* Terreno */}
      <TexBox size={[64, 0.5, 52]} position={[0, -0.25, 2]} tex="grass" repeat={[32, 26]} />

      {/* Senderos */}
      <TexBox size={[4, 0.06, 16]} position={[0, 0.03, 18]} tex="stone" repeat={[2, 8]} />
      <TexBox size={[30, 0.06, 3]} position={[-1, 0.03, 12]} tex="stone" repeat={[15, 1.5]} />
      <TexBox size={[3, 0.06, 18]} position={[11.5, 0.03, -3]} tex="stone" repeat={[1.5, 9]} />

      {/* Plazoleta circular (como la foto de la UAO) */}
      <mesh position={[0, 0.06, 5]}>
        <cylinderGeometry args={[5.5, 5.5, 0.12, 16]} />
        <meshLambertMaterial color="#8c3b2f" flatShading />
      </mesh>
      <mesh position={[0, 0.1, 5]}>
        <cylinderGeometry args={[4, 4, 0.12, 16]} />
        <meshLambertMaterial color="#b2513e" flatShading />
      </mesh>
      <mesh position={[0, 0.16, 5]}>
        <cylinderGeometry args={[1.6, 1.6, 0.14, 12]} />
        <meshLambertMaterial color="#e0b25a" flatShading />
      </mesh>

      <MainBuilding />

      {/* Bloque B (x 13..19) → pasillo estrecho entre x 10 y 13 */}
      <TexBox size={[6, 5, 12]} position={[16, 2.5, -6]} tex="facade" repeat={[2, 2]} />
      <Roof size={[6.4, 12.4]} position={[16, 5, -6]} />

      {/* Acceso a sótanos */}
      <TexBox size={[7, 0.08, 10]} position={[-17, 0.04, 2]} tex="asphalt" repeat={[3, 5]} />
      {[
        [-20.6, 2],
        [-13.4, 2],
      ].map(([x, z]) => (
        <TexBox key={x} size={[0.3, 0.6, 10]} position={[x, 0.3, z]} tex="hazardStripes" repeat={[1, 10]} />
      ))}
      <TexPlane tex="exitSign" size={[1.4, 1.4]} position={[-17, 1.6, -3.05]} emissive />
      <TexBox size={[7, 1.2, 0.3]} position={[-17, 0.6, -3.2]} tex="concrete" repeat={[3, 1]} />

      {/* Torre de escaleras de emergencia (ala oeste) */}
      <TexBox size={[2, 6, 2.4]} position={[-11.6, 3, -3]} tex="concrete" repeat={[1, 3]} />
      {[1, 2.5, 4].map((y) => (
        <TexBox key={y} size={[2.05, 0.25, 2.45]} position={[-11.6, y, -3]} tex="hazardStripes" repeat={[2, 1]} />
      ))}

      <Extinguisher position={[5.4, 0, -2]} />

      {/* Punto de encuentro */}
      <mesh position={[8, 0.04, 16]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[2.6, 2.9, 4, 1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <MeetingSign position={[10.5, 0, 15]} rotation={-0.4} />

      {/* Palmas */}
      {[
        [-7, 12], [7, 12], [-4, 20], [4, 22], [-22, 14], [22, 10], [-26, -6], [24, -10], [-9, 6], [9, 6], [15, 20], [-15, 20],
      ].map(([x, z], i) => (
        <Palm key={i} position={[x, 0, z]} height={3.5 + (i % 3) * 0.6} rotation={i} />
      ))}
    </group>
  )
}

/** Edificio Principal en U con arcadas. */
function MainBuilding() {
  return (
    <group>
      <TexBox size={[20, 7, 5]} position={[0, 3.5, -9.5]} tex="facade" repeat={[6, 2]} />
      <Roof size={[20.4, 5.4]} position={[0, 7, -9.5]} />
      {[-8, 8].map((x) => (
        <group key={x}>
          <TexBox size={[4, 6, 8]} position={[x, 3, -3]} tex="facade" repeat={[2, 2]} />
          <Roof size={[4.4, 8.4]} position={[x, 6, -3]} />
        </group>
      ))}
      {/* Torre central */}
      <TexBox size={[4, 3, 4]} position={[0, 8.5, -9.5]} tex="brick" repeat={[2, 2]} />
      <Roof size={[4.4, 4.4]} position={[0, 10, -9.5]} />
      {/* Arcadas */}
      {[-6, -3, 0, 3, 6].map((x) => (
        <mesh key={x} position={[x, 1.3, -6.95]}>
          <boxGeometry args={[1.6, 2.6, 0.1]} />
          <meshLambertMaterial color="#2b2238" />
        </mesh>
      ))}
    </group>
  )
}

function Roof({ size, position }) {
  return <TexBox size={[size[0], 0.3, size[1]]} position={[position[0], position[1] + 0.15, position[2]]} tex="roof" repeat={[4, 2]} />
}
