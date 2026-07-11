export interface Cancha {
  id: string
  nombre: string
  ubicacion: string
  tipo: 'fútbol 11' | 'fútbol 7' | 'fútbol 5' | 'baloncesto' | 'voleibol'
  estado: 'disponible' | 'ocupado' | 'mantenimiento'
  partidoActual?: {
    eq1: string
    eq2: string
    hora: string
    jornada: string
  }
  proximos?: {
    hora: string
    eq1: string
    eq2: string
  }[]
  rating: number // 1-5 estado del césped
  iluminacion: boolean
  techada: boolean
}

export const canchas: Cancha[] = [
  {
    id: 'cancha-1',
    nombre: 'Cancha Principal',
    ubicacion: 'Sede Norte',
    tipo: 'fútbol 11',
    estado: 'ocupado',
    partidoActual: {
      eq1: 'Tigres FC',
      eq2: 'IA Warriors',
      hora: '8:00 PM',
      jornada: 'Jornada 12',
    },
    proximos: [
      { hora: '9:30 PM', eq1: 'Code United', eq2: 'Sistemas FC' },
    ],
    rating: 4,
    iluminacion: true,
    techada: false,
  },
  {
    id: 'cancha-2',
    nombre: 'Cancha Secundaria',
    ubicacion: 'Sede Norte',
    tipo: 'fútbol 7',
    estado: 'disponible',
    proximos: [
      { hora: '7:00 PM', eq1: 'Dragones FC', eq2: 'Los Bits' },
    ],
    rating: 3,
    iluminacion: true,
    techada: false,
  },
  {
    id: 'cancha-3',
    nombre: 'Coliseo Cubierto',
    ubicacion: 'Sede Norte',
    tipo: 'fútbol 5',
    estado: 'disponible',
    rating: 5,
    iluminacion: true,
    techada: true,
  },
  {
    id: 'cancha-4',
    nombre: 'Auditorio Deportivo',
    ubicacion: 'Sede Norte',
    tipo: 'fútbol 5',
    estado: 'ocupado',
    partidoActual: {
      eq1: 'Los Bits',
      eq2: 'Code United',
      hora: '5:00 PM',
      jornada: 'Amistoso',
    },
    rating: 4,
    iluminacion: true,
    techada: true,
  },
  {
    id: 'cancha-5',
    nombre: 'Cancha Sintética',
    ubicacion: 'Sede Sur',
    tipo: 'fútbol 11',
    estado: 'mantenimiento',
    rating: 2,
    iluminacion: false,
    techada: false,
  },
  {
    id: 'cancha-6',
    nombre: 'Cancha de Baloncesto',
    ubicacion: 'Sede Norte',
    tipo: 'baloncesto',
    estado: 'disponible',
    rating: 4,
    iluminacion: true,
    techada: false,
  },
  {
    id: 'cancha-7',
    nombre: 'Cancha de Voleibol',
    ubicacion: 'Sede Norte',
    tipo: 'voleibol',
    estado: 'disponible',
    rating: 3,
    iluminacion: false,
    techada: false,
  },
]
