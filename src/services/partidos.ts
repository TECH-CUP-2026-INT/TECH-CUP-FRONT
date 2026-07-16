/**
 * TODO: Reemplazar con llamadas API cuando el Matches Service (am-matches-service)
 * esté deployado.
 *
 * Endpoints esperados bajo el APIM:
 *   GET /matches          → listado de partidos
 *   GET /matches/{id}     → detalle de un partido
 *   GET /tournaments/{id}/matches  → partidos de un torneo
 *
 * Mientras tanto, datos mock.
 */

export interface Partido {
  dia: number
  mes: string
  eq1: string
  eq2: string
  hora: string
  lugar: string
}

export const partidos: Partido[] = [
  // ── Semana del 11 al 17 de Mayo ──
  // Lunes 11
  { dia:11, mes:"MAY", eq1:"Sistemas FC",     eq2:"Los Bits",     hora:"6:00 PM",  lugar:"Cancha Principal Sede Norte" },
  { dia:11, mes:"MAY", eq1:"Tigres FC",       eq2:"Code United",  hora:"8:00 PM",  lugar:"Cancha Principal Sede Norte" },
  // Martes 12
  { dia:12, mes:"MAY", eq1:"Dragones FC",     eq2:"IA Warriors",  hora:"7:00 PM",  lugar:"Cancha Principal Sede Norte 2" },
  { dia:12, mes:"MAY", eq1:"Code United",     eq2:"Los Bits",     hora:"9:00 PM",  lugar:"Cancha Principal Sede Norte" },
  // Miércoles 13
  { dia:13, mes:"MAY", eq1:"Tigres FC",       eq2:"Dragones FC",  hora:"6:30 PM",  lugar:"Cancha Principal Sede Norte" },
  { dia:13, mes:"MAY", eq1:"IA Warriors",     eq2:"Sistemas FC",  hora:"8:30 PM",  lugar:"Auditorio Principal Sede Norte" },
  // Jueves 14
  { dia:14, mes:"MAY", eq1:"Code United",     eq2:"IA Warriors",  hora:"7:00 PM",  lugar:"Cancha Principal Sede Norte" },
  { dia:14, mes:"MAY", eq1:"Tigres FC",       eq2:"Los Bits",     hora:"9:00 PM",  lugar:"Cancha Principal Sede Norte 2" },
  // Viernes 15
  { dia:15, mes:"MAY", eq1:"Sistemas FC",     eq2:"Dragones FC",  hora:"6:00 PM",  lugar:"Auditorio Principal Sede Norte" },
  { dia:15, mes:"MAY", eq1:"Tigres FC",       eq2:"IA Warriors",  hora:"8:00 PM",  lugar:"Cancha Principal Sede Norte" },
  // Sábado 16
  { dia:16, mes:"MAY", eq1:"Code United",     eq2:"Dragones FC",  hora:"10:00 AM", lugar:"Cancha Principal Sede Norte" },
  { dia:16, mes:"MAY", eq1:"Los Bits",        eq2:"IA Warriors",  hora:"12:00 PM", lugar:"Cancha Principal Sede Norte 2" },
  { dia:16, mes:"MAY", eq1:"Tigres FC",       eq2:"Sistemas FC",  hora:"4:00 PM",  lugar:"Cancha Principal Sede Norte" },
  // Domingo 17
  { dia:17, mes:"MAY", eq1:"IA Warriors",     eq2:"Code United",  hora:"11:00 AM", lugar:"Cancha Principal Sede Norte" },
  { dia:17, mes:"MAY", eq1:"Dragones FC",     eq2:"Los Bits",     hora:"5:00 PM",  lugar:"Auditorio Principal Sede Norte" },
  { dia:17, mes:"MAY", eq1:"Tigres FC",       eq2:"Code United",  hora:"8:00 PM",  lugar:"Cancha Principal Sede Norte" },
  // ── Semana del 24 al 25 (original) ──
  { dia:24, mes:"MAY", eq1:"Tigres FC",       eq2:"IA Warriors",  hora:"8:00 PM",  lugar:"Cancha Principal Sede Norte" },
  { dia:24, mes:"MAY", eq1:"Code United",      eq2:"Sistemas FC",  hora:"9:30 PM",  lugar:"Cancha Principal Sede Norte" },
  { dia:25, mes:"MAY", eq1:"Dragones FC",      eq2:"Los Bits",     hora:"5:00 PM",  lugar:"Auditorio Principal Sede Norte" },
]

/**
 * Posiciones (tabla de posiciones).
 * TODO: Migrar a llamada API cuando esté disponible:
 *   GET /api/v1/statistics/tournaments/{tournamentId}/standings
 */
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
