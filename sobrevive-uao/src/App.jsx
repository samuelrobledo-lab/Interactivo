import { useGameStore } from './store/useGameStore'
import CampusBackdrop from './views/CampusBackdrop'
import Home from './views/Home'
import EmergencySelect from './views/EmergencySelect'
import SimulatorView from './views/SimulatorView'
import MapView from './views/MapView'

/**
 * Componente raíz: enruta por `screen` del store.
 *
 * HOME ─┬─ MÓDULO 1: select → simulator (intro → 3 decisiones → éxito / error+reintentar)
 *       └─ MÓDULO 2: map (pins → ficha informativa)
 */
export default function App() {
  const screen = useGameStore((s) => s.screen)
  const showBackdrop = screen === 'home' || screen === 'select'

  return (
    <main className="scanlines relative h-dvh w-full overflow-hidden bg-carbon-950 text-white select-none">
      {showBackdrop && <CampusBackdrop />}
      {screen === 'home' && <Home />}
      {screen === 'select' && <EmergencySelect />}
      {screen === 'simulator' && <SimulatorView />}
      {screen === 'map' && <MapView />}
    </main>
  )
}
