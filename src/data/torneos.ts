export type EstadoTorneo = 'live' | 'upcoming' | 'closed'
export type Categoria = 'Fútbol 11' | 'Futsal'

export interface Torneo {
  id: number
  nombre: string
  estado: EstadoTorneo
  semestre: string
  categoria: Categoria
  equipos: number
  jugadores: number
  canchas: number
  fecha: string
  tag: string
  sub?: string
}

export const torneos: Torneo[] = [
  { id:1, nombre:"TechCup 2024-I",  estado:"live",     semestre:"2024-I", categoria:"Fútbol 11", equipos:32, jugadores:384, canchas:4, fecha:"Mar 5 – Jun 15, 2024",         tag:"Torneo oficial" },
  { id:2, nombre:"TechCup 2024-II", estado:"upcoming", semestre:"2024-II",categoria:"Fútbol 11", equipos:32, jugadores:384, canchas:4, fecha:"Ago 20 – Nov 30, 2024",        tag:"Torneo oficial" },
  { id:3, nombre:"TechCup 2025-I",  estado:"upcoming", semestre:"2025-I", categoria:"Fútbol 11", equipos:32, jugadores:384, canchas:4, fecha:"Mar 3 – Jun 14, 2025",         tag:"Torneo oficial" },
  { id:4, nombre:"TechCup 2023-II", estado:"closed",   semestre:"2023-II",categoria:"Fútbol 11", equipos:28, jugadores:320, canchas:4, fecha:"Ago 14 – Nov 25, 2023",        tag:"Torneo oficial" },
  { id:5, nombre:"TechCup 2023-I",  estado:"closed",   semestre:"2023-I", categoria:"Fútbol 11", equipos:24, jugadores:276, canchas:4, fecha:"Mar 6 – Jun 10, 2023",         tag:"Torneo oficial" },
  { id:6, nombre:"TechCup 2022-II", estado:"closed",   semestre:"2022-II",categoria:"Fútbol 11", equipos:20, jugadores:240, canchas:3, fecha:"Ago 15 – Nov 26, 2022",        tag:"Torneo oficial" },
  { id:7, nombre:"TechCup Futsal 2024", estado:"upcoming", semestre:"2024-II", categoria:"Futsal", equipos:16, jugadores:128, canchas:2, fecha:"Sep 1 – Dic 15, 2024", tag:"Torneo oficial" },
  { id:8, nombre:"TechCup Apertura 2024", estado:"live", semestre:"2024-I", categoria:"Fútbol 11", equipos:8, jugadores:96, canchas:2, fecha:"Mar 5 – Jun 15, 2024", tag:"Torneo oficial" },
]
