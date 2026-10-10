# Sobrevive a la UAO

Experiencia web 3D (pixel art / low‑poly) sobre gestión del riesgo y evacuación en la Universidad Autónoma de Occidente.

- **Módulo 1 – Simulador 3D:** elige Terremoto, Incendio o Fuga de gas, recorre los sótanos y toma 3 decisiones. Error → secuencia caótica + tarjeta reflexiva + **Reintentar**. Acierto → llegada al punto de encuentro.
- **Módulo 2 – Mapa 3D:** campus con pins interactivos; al hacer clic la cámara se enfoca (GSAP) y abre la ficha *¿Qué lugar es? / ¿Por qué es riesgoso? / ¿Cómo evacuar?*

## Ver en línea (GitHub Pages)

La carpeta `docs/` contiene la versión ya compilada de la app, lista para publicarse.

1. Sube esta carpeta a un repositorio de GitHub.
2. En el repositorio ve a **Settings → Pages**.
3. En *Build and deployment* elige **Source: Deploy from a branch**, rama **main** y carpeta **/docs**. Guarda.
4. En 1–2 minutos la app queda publicada en `https://<tu-usuario>.github.io/<nombre-del-repo>/`.

Si cambias el código, vuelve a generar `docs/` antes de subir:

```bash
npm run build:pages
```

## Ejecutar en local

Requiere [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install
npm run dev
```

## Stack

React 19 · Vite · @react-three/fiber + drei · Zustand · GSAP · Tailwind CSS v4

## Estructura

```
src/
├── App.jsx                     # Router por estado (home | select | simulator | map)
├── config.js                   # DPR pixelado, tiempos, rutas a modelos GLB
├── store/useGameStore.js       # Máquina de estados (phase, currentStep, isPaused, hasFailed, hasWon, feedbackMessage…)
├── data/
│   ├── emergencies.js          # Guion: historia + 3 decisiones por emergencia
│   └── zones.js                # Zonas del mapa y fichas informativas
├── utils/
│   ├── pixelTextures.js        # Texturas pixel procedurales (NearestFilter) + pixelateObject() para GLB
│   └── sprites.js              # Sprites del personaje, iconos pixel, viñetas de selección
├── views/                      # Home, EmergencySelect, SimulatorView, MapView, CampusBackdrop
└── components/
    ├── ui/                     # primitives (GlassPanel, PixelButton, IconButton…), SimulatorOverlays, InfoCard
    └── three/                  # BasementScene, CampusModel, Avatar, CameraRig, HazardEffects, Particles, Hotspot, ModelSlot
```

## Integrar assets finales

| Asset | Dónde |
| --- | --- |
| Modelo de sótanos `.glb` | `public/models/` → `MODELS.basement` en `src/config.js` |
| Modelo del campus `.glb` | `public/models/` → `MODELS.campus` |
| Recorrido del avatar | `src/components/three/basementLayout.js` (`PATH`) — ajustar a las coordenadas del GLB |
| Posición de pins | `src/data/zones.js` (`position`, `cameraOffset`) |
| Fotos/renders de zonas | `public/images/` → campo `image` de cada zona |
| Spritesheet del personaje | `src/components/three/Avatar.jsx` (ver comentario) |
| Logo oficial UAO | reemplazar `UaoMark` en `src/components/ui/primitives.jsx` |

Los GLB pasan por `ModelSlot`, que aplica `NearestFilter` a sus texturas y vuelve al placeholder si falla la carga.

> ⚠️ Los textos de decisiones y fichas son recomendaciones generales de gestión del riesgo: validarlos con la Brigada / SST de la UAO antes de publicar.
