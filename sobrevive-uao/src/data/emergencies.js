/**
 * Guion del Módulo 1. Cada emergencia tiene 3 decisiones (3 momentos distintos).
 *
 * Opción:
 *   correct      → true/false
 *   failTarget   → [x,y,z] opcional: hacia dónde corre el avatar en la secuencia caótica
 *                  (si es null, el avatar entra en pánico dando vueltas en su sitio)
 *   chaosLine    → texto grande del overlay caótico
 *   feedback     → tarjeta reflexiva "Te equivocaste por…": qué pasó, qué aprendiste, cómo evitarlo
 *
 * ⚠️ Los textos son recomendaciones generales de gestión del riesgo.
 *    Validarlos con la Brigada de Emergencias / Seguridad y Salud en el Trabajo de la UAO.
 *
 * Las posiciones de failTarget corresponden al escenario placeholder (BasementScene):
 *   ascensor Sótano 2 ≈ [-10, 0, -6.8], interruptor ≈ [-12.5, 0, -6.8],
 *   ascensor Sótano 1 ≈ [4, 1.2, -6.8], rampa de salida ≈ [15, 1.5, 0], fachada ≈ [22, 2.4, -6]
 */

export const EMERGENCIES = {
  terremoto: {
    id: 'terremoto',
    name: 'Terremoto / temblor',
    hazard: 'quake',
    accent: '#f0b44a',
    story: {
      title: 'Historia',
      lines: [
        'Son las 10:00 a.m. Bajaste al Sótano 2 a dejar tu bici.',
        'De repente el piso empieza a moverse: las lámparas se balancean, las alarmas de los carros chillan y cae polvo del techo.',
        'Tu misión: llegar sano y salvo al punto de encuentro.',
      ],
    },
    decisions: [
      {
        id: 'q1',
        moment: 'Durante el sismo',
        prompt: '¡Está temblando fuerte! ¿Qué haces?',
        options: [
          {
            id: 'run',
            label: 'Correr hacia la salida mientras tiembla',
            correct: false,
            failTarget: null,
            chaosLine: '¡Te cayó el cielo raso encima!',
            feedback: {
              title: 'Te equivocaste por correr durante el sismo',
              why: 'Mientras tiembla, la mayoría de lesiones ocurren por caídas y por objetos que se desprenden (lámparas, cielo raso, vidrios) cuando intentas moverte.',
              learned: 'Durante el movimiento: Agáchate, Cúbrete y Sujétate.',
              avoid: 'Protégete donde estás, lejos de objetos que puedan caer, y evacúa solo cuando el sismo termine.',
            },
          },
          {
            id: 'drop',
            label: 'Agacharte, cubrirte la cabeza y sujetarte, lejos de lámparas',
            correct: true,
            successLine: '¡Agáchate, Cúbrete, Sujétate! Ahora sí, a evacuar.',
          },
        ],
      },
      {
        id: 'q2',
        moment: 'Después del sismo',
        prompt: 'El movimiento paró. El ascensor del Sótano 1 está abierto… ¿cómo subes?',
        options: [
          {
            id: 'stairs',
            label: 'Por las escaleras, sin correr y atento a réplicas',
            correct: true,
            successLine: 'Escaleras, paso firme y sin empujar. ¡Muy bien!',
          },
          {
            id: 'elevator',
            label: 'En el ascensor, ya dejó de temblar',
            correct: false,
            failTarget: [4, 1.2, -6.8],
            chaosLine: '¡Réplica! El ascensor quedó atascado.',
            feedback: {
              title: 'Te equivocaste por usar el ascensor tras un sismo',
              why: 'Después de un sismo los ascensores pueden estar dañados, y una réplica o un corte de energía te puede dejar atrapado.',
              learned: 'Tras un sismo, el ascensor NO es una opción.',
              avoid: 'Usa las escaleras, camina sin correr, por tu derecha y atento a nuevas réplicas.',
            },
          },
        ],
      },
      {
        id: 'q3',
        moment: 'Punto de encuentro',
        prompt: 'Ya estás afuera y ves grietas en la fachada. ¿Qué haces?',
        options: [
          {
            id: 'film',
            label: 'Quedarte junto a la fachada grabando para redes',
            correct: false,
            failTarget: [22, 2.4, -6],
            chaosLine: '¡Réplica! Llueven vidrios de la fachada.',
            feedback: {
              title: 'Te equivocaste por quedarte cerca del edificio',
              why: 'Las réplicas pueden desprender vidrios, cornisas y partes de fachadas dañadas. Cerca de edificios, postes y cables no es seguro.',
              learned: 'El video puede esperar; tu seguridad no.',
              avoid: 'Ve al punto de encuentro en un espacio abierto, lejos de estructuras, y repórtate con la brigada.',
            },
          },
          {
            id: 'meet',
            label: 'Ir al punto de encuentro en un espacio abierto',
            correct: true,
            successLine: '¡Directo al punto de encuentro!',
          },
        ],
      },
    ],
  },

  incendio: {
    id: 'incendio',
    name: 'Incendio',
    hazard: 'fire',
    accent: '#ff6a1a',
    story: {
      title: 'Historia',
      lines: [
        'Son las 10:00 a.m. Estás en el Sótano 2 cuando una alarma rompe el silencio.',
        'Huele a quemado: sale humo negro del cuarto eléctrico y empieza a llenar el parqueadero.',
        'Tu misión: llegar sano y salvo al punto de encuentro.',
      ],
    },
    decisions: [
      {
        id: 'f1',
        moment: 'Salida inicial',
        prompt: '¿Cómo sales del Sótano 2?',
        options: [
          {
            id: 'elevator',
            label: 'Tomar el ascensor, es más rápido',
            correct: false,
            failTarget: [-10, 0, -6.8],
            chaosLine: '¡Se fue la luz con el ascensor lleno de humo!',
            feedback: {
              title: 'Te equivocaste por usar el ascensor en un incendio',
              why: 'Durante un incendio la energía puede cortarse y dejarte atrapado. Además, el foso del ascensor actúa como chimenea y se llena de humo.',
              learned: 'Los ascensores NO son ruta de evacuación.',
              avoid: 'Sigue la señal verde de SALIDA y usa siempre las escaleras de emergencia.',
            },
          },
          {
            id: 'stairs',
            label: 'Caminar hacia las escaleras de emergencia',
            correct: true,
            successLine: '¡Bien! Las escaleras son la ruta segura.',
          },
        ],
      },
      {
        id: 'f2',
        moment: 'Desplazamiento',
        prompt: 'El pasillo del Sótano 1 se está llenando de humo. ¿Qué haces?',
        options: [
          {
            id: 'crouch',
            label: 'Avanzar agachado, cubriendo nariz y boca, siguiendo la señalización',
            correct: true,
            successLine: 'Agachado y con la nariz cubierta. ¡Así se hace!',
          },
          {
            id: 'panic',
            label: 'Correr erguido y sin rumbo para salir rápido',
            correct: false,
            failTarget: null,
            chaosLine: '¡No ves nada y el humo te ahoga!',
            feedback: {
              title: 'Te equivocaste por correr desorientado entre el humo',
              why: 'El humo caliente y los gases tóxicos suben y se acumulan arriba. Correr erguido te hace respirarlos, perder la orientación y chocar o caer.',
              learned: 'En un incendio, el humo es más peligroso que las llamas.',
              avoid: 'Avanza agachado o gateando, cúbrete nariz y boca con tela y sigue la señalización pegado a la pared.',
            },
          },
        ],
      },
      {
        id: 'f3',
        moment: 'Punto de encuentro',
        prompt: '¡Saliste! Pero recuerdas que dejaste tu portátil en el sótano…',
        options: [
          {
            id: 'meet',
            label: 'Ir al punto de encuentro y reportarte con la brigada',
            correct: true,
            successLine: 'Nada material vale más que tu vida. ¡Bien!',
          },
          {
            id: 'laptop',
            label: 'Volver rápido por el portátil',
            correct: false,
            failTarget: [15, 1.5, 0],
            chaosLine: '¡Volviste a entrar al humo!',
            feedback: {
              title: 'Te equivocaste por regresar al edificio',
              why: 'Las condiciones de un incendio empeoran en segundos: el humo puede bloquear la misma salida que usaste hace un momento.',
              learned: 'Una vez afuera, NO se vuelve a entrar hasta que la brigada lo autorice.',
              avoid: 'Ve al punto de encuentro, repórtate y avisa si alguien falta.',
            },
          },
        ],
      },
    ],
  },

  gas: {
    id: 'gas',
    name: 'Fuga de gas',
    hazard: 'gas',
    accent: '#7be35a',
    story: {
      title: 'Historia',
      lines: [
        'Son las 10:00 a.m. Bajas al Sótano 2 y un fuerte olor a huevo podrido te golpea.',
        'Hay una fuga de gas cerca del cuarto de máquinas. Está oscuro… y el interruptor de la luz está justo a tu lado.',
        'Tu misión: llegar sano y salvo al punto de encuentro.',
      ],
    },
    decisions: [
      {
        id: 'g1',
        moment: 'Primer contacto',
        prompt: 'Está oscuro y huele a gas. ¿Qué haces?',
        options: [
          {
            id: 'switch',
            label: 'Prender la luz para ver de dónde viene la fuga',
            correct: false,
            failTarget: [-12.5, 0, -6.8],
            chaosLine: '¡CHISPA! ¡BOOM!',
            feedback: {
              title: 'Te equivocaste por accionar un interruptor con gas en el ambiente',
              why: 'Encender o apagar un interruptor produce una pequeña chispa capaz de encender el gas acumulado y causar una explosión.',
              learned: 'Con olor a gas: nada de interruptores, encendedores ni aparatos eléctricos.',
              avoid: 'Deja todo como está, no enciendas nada y aléjate del área de inmediato.',
            },
          },
          {
            id: 'leave',
            label: 'No tocar ningún interruptor y alejarte del olor',
            correct: true,
            successLine: 'Sin chispas, sin drama. ¡Bien!',
          },
        ],
      },
      {
        id: 'g2',
        moment: 'Desplazamiento',
        prompt: 'Hay compañeros alrededor y la salida está al otro lado del Sótano 1.',
        options: [
          {
            id: 'push',
            label: 'Correr empujando para salir de primero',
            correct: false,
            failTarget: null,
            chaosLine: '¡Caída en cadena!',
            feedback: {
              title: 'Te equivocaste por correr y empujar',
              why: 'Correr y empujar en espacios cerrados provoca caídas y aplastamientos, y termina bloqueando la salida para todos.',
              learned: 'Evacuar rápido no es evacuar corriendo.',
              avoid: 'Camina rápido pero sin correr ni empujar, mantén tu derecha y avisa a los demás que evacúen.',
            },
          },
          {
            id: 'calm',
            label: 'Salir caminando con calma y avisar a los demás',
            correct: true,
            successLine: 'Calma y comunicación. ¡Excelente!',
          },
        ],
      },
      {
        id: 'g3',
        moment: 'Zona segura',
        prompt: 'Ya estás afuera, con el corazón a mil. ¿Y ahora?',
        options: [
          {
            id: 'smoke',
            label: 'Prender un cigarrillo para calmar los nervios',
            correct: false,
            failTarget: null,
            chaosLine: '¡La nube de gas te alcanzó!',
            feedback: {
              title: 'Te equivocaste por encender fuego cerca de una fuga',
              why: 'El gas puede salir por rampas y ventilaciones y acumularse cerca de la salida. Una sola llama basta para encenderlo.',
              learned: 'Ninguna llama ni chispa cerca de la zona de la fuga.',
              avoid: 'Aléjate a un espacio abierto, repórtate en el punto de encuentro y llama a emergencias desde allí.',
            },
          },
          {
            id: 'report',
            label: 'Ir al punto de encuentro y reportar la fuga desde allí',
            correct: true,
            successLine: '¡Reporte hecho desde zona segura!',
          },
        ],
      },
    ],
  },
}

/** Orden de las tarjetas en la pantalla de selección (según wireframe). */
export const EMERGENCY_ORDER = ['terremoto', 'incendio', 'gas']
