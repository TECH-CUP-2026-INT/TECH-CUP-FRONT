export interface Partido {
  dia: number
  mes: string
  eq1: string
  eq2: string
  hora: string
  lugar: string
}

export const partidos: Partido[] = [
  { dia:24, mes:"MAY", eq1:"Tigres FC",       eq2:"IA Warriors",  hora:"8:00 PM",  lugar:"Cancha Principal Sede Norte" },
  { dia:24, mes:"MAY", eq1:"Code United",      eq2:"Sistemas FC",  hora:"9:30 PM",  lugar:"Cancha Principal Sede Norte" },
  { dia:25, mes:"MAY", eq1:"Dragones FC",      eq2:"Los Bits",     hora:"5:00 PM",  lugar:"Auditorio Principal Sede Norte" },
]

export interface Posicion {
  pos: number
  equipo: string
  pj: number
  dg: number
  pts: number
}

export const posiciones: Posicion[] = [
  { pos:1, equipo:"Tigres FC",    pj:12, dg:18, pts:28 },
  { pos:2, equipo:"IA Warriors",  pj:12, dg:12, pts:25 },
  { pos:3, equipo:"Code United",  pj:12, dg:8,  pts:22 },
  { pos:4, equipo:"Sistemas FC",  pj:12, dg:6,  pts:20 },
  { pos:5, equipo:"Dragones FC",  pj:12, dg:2,  pts:18 },
]
