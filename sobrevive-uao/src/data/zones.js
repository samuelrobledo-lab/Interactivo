/**
 * Zonas del Módulo 2 (Mapa 3D interactivo).
 *
 * position     → dónde se ubica el pin en el CampusModel placeholder
 * cameraOffset → desde dónde mira la cámara al enfocar la zona
 * image        → foto/render opcional (ej. '/images/sotano-1.jpg'); null = placeholder pixel
 *
 * Estructura de la ficha según wireframe: ¿Qué lugar es? · ¿Por qué es riesgoso? · ¿Cómo evacuar?
 * ⚠️ Contenido de referencia: reemplazar/validar con los protocolos oficiales de la UAO.
 */

export const ZONES = [
  {
    id: 'sotano-1',
    name: 'Sótano 1',
    category: 'Sótanos',
    risk: 'alto',
    position: [-17, 0, -1],
    cameraOffset: [-8, 10, 12],
    image: null,
    whatIs: 'Primer nivel subterráneo: parqueadero de carros y motos, cuartos técnicos y conexión con las escaleras hacia el campus.',
    whyRisky: 'Ventilación limitada (el humo y el gas se acumulan), poca luz natural, tráfico vehicular y pocas salidas hacia el exterior.',
    howToEvacuate: [
      'Sigue las flechas verdes de SALIDA, nunca el ascensor.',
      'Camina por la zona peatonal, lejos de los carros en movimiento.',
      'Sube por la rampa peatonal o las escaleras de emergencia.',
      'Dirígete al punto de encuentro y repórtate.',
    ],
  },
  {
    id: 'sotano-2',
    name: 'Sótano 2',
    category: 'Sótanos',
    risk: 'alto',
    position: [-17, 0, 4.5],
    cameraOffset: [-9, 9, 13],
    image: null,
    whatIs: 'Nivel más profundo del parqueadero: bicicletas, depósitos y cuartos de máquinas.',
    whyRisky: 'Es el punto más alejado de la superficie: la ruta de evacuación es la más larga y depende por completo de escaleras.',
    howToEvacuate: [
      'Ubica de antemano las escaleras de emergencia más cercanas.',
      'Ante humo: agáchate, cúbrete nariz y boca y avanza pegado a la pared.',
      'Ante olor a gas: no actives interruptores ni enciendas nada.',
      'Sube sin correr y sin devolverte por objetos personales.',
    ],
  },
  {
    id: 'edificio-principal',
    name: 'Edificio Principal',
    category: 'Edificios',
    risk: 'medio',
    position: [0, 10.3, -9.5],
    cameraOffset: [10, 6, 18],
    image: null,
    whatIs: 'Edificio central del campus: aulas, oficinas administrativas y auditorios, con alta concentración de personas.',
    whyRisky: 'Muchas personas evacuando a la vez, varios pisos y zonas con vidrio en fachada.',
    howToEvacuate: [
      'Atiende las indicaciones de los brigadistas (chalecos).',
      'Baja por las escaleras por tu derecha, sin correr ni empujar.',
      'Aléjate de ventanales y fachadas al salir.',
      'Ve al punto de encuentro asignado a tu bloque.',
    ],
  },
  {
    id: 'pasillos-estrechos',
    name: 'Pasillos estrechos',
    category: 'Circulaciones',
    risk: 'alto',
    position: [11.5, 0, -6],
    cameraOffset: [0, 13, 11],
    image: null,
    whatIs: 'Corredores angostos entre bloques que conectan aulas con las zonas abiertas.',
    whyRisky: 'Se generan cuellos de botella: un empujón o una caída pueden provocar aplastamientos.',
    howToEvacuate: [
      'Avanza en fila, a paso rápido pero sin correr.',
      'No te detengas en el pasillo a grabar o buscar a alguien.',
      'Ayuda a personas con movilidad reducida sin bloquear el paso.',
    ],
  },
  {
    id: 'escaleras-emergencia',
    name: 'Escaleras de emergencia',
    category: 'Rutas',
    risk: 'bajo',
    position: [-11.6, 6.2, -3],
    cameraOffset: [-10, 6, 10],
    image: null,
    whatIs: 'Escaleras señalizadas y protegidas, diseñadas para evacuar los pisos y sótanos.',
    whyRisky: 'Son seguras si se usan bien; el riesgo aparece cuando la gente corre, se empuja o se queda quieta en ellas.',
    howToEvacuate: [
      'Usa el pasamanos y baja/sube por tu derecha.',
      'Nunca uses el ascensor en una emergencia.',
      'Mantén las puertas cortafuego cerradas detrás de ti.',
    ],
  },
  {
    id: 'extintores',
    name: 'Extintores y gabinetes',
    category: 'Equipos',
    risk: 'bajo',
    position: [5.4, 0, -2],
    cameraOffset: [-6, 6, 9],
    image: null,
    whatIs: 'Puntos con extintores y gabinetes contra incendio distribuidos por el campus y los sótanos.',
    whyRisky: 'Un extintor bloqueado o mal usado hace perder segundos valiosos.',
    howToEvacuate: [
      'Úsalo solo si el fuego es pequeño, tienes salida a tu espalda y sabes cómo hacerlo.',
      'Recuerda: Hala el pasador, Apunta a la base, Presiona, Barre.',
      'Si el fuego crece, abandona y evacúa.',
    ],
  },
  {
    id: 'punto-encuentro',
    name: 'Punto de encuentro',
    category: 'Zona segura',
    risk: 'bajo',
    position: [8, 0, 16],
    cameraOffset: [8, 9, 12],
    image: null,
    whatIs: 'Zona abierta señalizada donde se reúnen las personas evacuadas para el conteo.',
    whyRisky: 'Es la zona segura; el riesgo es no llegar o irse sin reportarse.',
    howToEvacuate: [
      'Repórtate con la brigada de tu bloque.',
      'Avisa si alguien falta o está herido.',
      'No regreses a los edificios hasta recibir autorización.',
    ],
  },
]

export const RISK_LABEL = { alto: 'Riesgo alto', medio: 'Riesgo medio', bajo: 'Riesgo bajo' }
