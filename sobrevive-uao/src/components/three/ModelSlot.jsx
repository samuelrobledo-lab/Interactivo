import { Component, Suspense, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { pixelateObject } from '../../utils/pixelTextures'

/**
 * Punto de integración de modelos finales (.glb/.gltf).
 *
 *   <ModelSlot url={MODELS.basement} fallback={<BasementScene />} />
 *
 * - url null        → renderiza el placeholder procedural
 * - url válido      → carga el GLB, aplica NearestFilter a sus texturas (look pixel art)
 * - error de carga  → vuelve al placeholder y lo reporta en consola
 */
export default function ModelSlot({ url, fallback = null, ...props }) {
  if (!url) return fallback
  return (
    <ModelErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GltfModel url={url} {...props} />
      </Suspense>
    </ModelErrorBoundary>
  )
}

function GltfModel({ url, ...props }) {
  const { scene } = useGLTF(url)
  const object = useMemo(() => pixelateObject(scene.clone(true)), [scene])
  return <primitive object={object} {...props} />
}

class ModelErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('[ModelSlot] No se pudo cargar el modelo, usando placeholder.', error)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
