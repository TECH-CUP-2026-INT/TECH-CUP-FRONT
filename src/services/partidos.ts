/**
 * Partidos — Service Layer
 *
 * Estrategia:
 * 1. Intenta obtener datos del API real del Matches Service vía APIM
 * 2. Si falla (red, 401, 403, etc.), usa datos mock
 * 3. El API no expone fecha/hora/lugar directamente — se enriquecen
 *    desde datos mock hasta que el servicio los incluya
 */

import { getPartidosApi } from '@/api/partidos'
import type { Partido, Posicion } from '@/api/tipos'

// ─── Mock data (fallback + enrichment) ───────────────────────

const MOCK_PARTIDOS: Partido[] = [
  { id: 'mock-1', dia: 11, mes: 'MAY', eq1: 'Sistemas FC',   eq2: 'Los Bits',     hora: '6:00 PM',  lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-2', dia: 11, mes: 'MAY', eq1: 'Tigres FC',     eq2: 'Code United',  hora: '8:00 PM',  lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-3', dia: 12, mes: 'MAY', eq1: 'Dragones FC',   eq2: 'IA Warriors',  hora: '7:00 PM',  lugar: 'Cancha Principal Sede Norte 2' },
  { id: 'mock-4', dia: 12, mes: 'MAY', eq1: 'Code United',   eq2: 'Los Bits',     hora: '9:00 PM',  lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-5', dia: 13, mes: 'MAY', eq1: 'Tigres FC',     eq2: 'Dragones FC',  hora: '6:30 PM',  lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-6', dia: 13, mes: 'MAY', eq1: 'IA Warriors',   eq2: 'Sistemas FC',  hora: '8:30 PM',  lugar: 'Auditorio Principal Sede Norte' },
  { id: 'mock-7', dia: 14, mes: 'MAY', eq1: 'Code United',   eq2: 'IA Warriors',  hora: '7:00 PM',  lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-8', dia: 14, mes: 'MAY', eq1: 'Tigres FC',     eq2: 'Los Bits',     hora: '9:00 PM',  lugar: 'Cancha Principal Sede Norte 2' },
  { id: 'mock-9', dia: 15, mes: 'MAY', eq1: 'Sistemas FC',   eq2: 'Dragones FC',  hora: '6:00 PM',  lugar: 'Auditorio Principal Sede Norte' },
  { id: 'mock-10', dia: 15, mes: 'MAY', eq1: 'Tigres FC',   eq2: 'IA Warriors',  hora: '8:00 PM',  lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-11', dia: 16, mes: 'MAY', eq1: 'Code United',  eq2: 'Dragones FC',  hora: '10:00 AM', lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-12', dia: 16, mes: 'MAY', eq1: 'Los Bits',     eq2: 'IA Warriors',  hora: '12:00 PM', lugar: 'Cancha Principal Sede Norte 2' },
  { id: 'mock-13', dia: 16, mes: 'MAY', eq1: 'Tigres FC',    eq2: 'Sistemas FC',  hora: '4:00 PM',  lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-14', dia: 17, mes: 'MAY', eq1: 'IA Warriors',  eq2: 'Code United',  hora: '11:00 AM', lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-15', dia: 17, mes: 'MAY', eq1: 'Dragones FC',  eq2: 'Los Bits',     hora: '5:00 PM',  lugar: 'Auditorio Principal Sede Norte' },
  { id: 'mock-16', dia: 17, mes: 'MAY', eq1: 'Tigres FC',    eq2: 'Code United',  hora: '8:00 PM',  lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-17', dia: 24, mes: 'MAY', eq1: 'Tigres FC',    eq2: 'IA Warriors',  hora: '8:00 PM',  lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-18', dia: 24, mes: 'MAY', eq1: 'Code United',  eq2: 'Sistemas FC',  hora: '9:30 PM',  lugar: 'Cancha Principal Sede Norte' },
  { id: 'mock-19', dia: 25, mes: 'MAY', eq1: 'Dragones FC',  eq2: 'Los Bits',     hora: '5:00 PM',  lugar: 'Auditorio Principal Sede Norte' },
]

const MOCK_POSICIONES: Posicion[] = [
  { pos: 1, equipo: 'Tigres FC',   pj: 12, dg: 18, pts: 28 },
  { pos: 2, equipo: 'IA Warriors', pj: 12, dg: 12, pts: 25 },
  { pos: 3, equipo: 'Code United', pj: 12, dg: 8,  pts: 22 },
  { pos: 4, equipo: 'Sistemas FC', pj: 12, dg: 6,  pts: 20 },
  { pos: 5, equipo: 'Dragones FC', pj: 12, dg: 2,  pts: 18 },
]

// ─── Module-level arrays ─────────────────────────────────────
// Patrón compartido: las páginas importan `partidos` y reciben
// la misma referencia. fetchPartidos() muta el array in-place.

const _partidos: Partido[] = [...MOCK_PARTIDOS]
const _posiciones: Posicion[] = [...MOCK_POSICIONES]

export let partidos: Partido[] = _partidos
export let posiciones: Posicion[] = _posiciones

function updatePartidos(data: Partido[]): void {
  _partidos.splice(0, _partidos.length, ...data)
}

// ─── Helpers ─────────────────────────────────────────────────

function enrichWithMock(
  api: { id: string; homeTeamName: string; awayTeamName: string; homeScore: number; awayScore: number; status: string },
): Partido {
  const existing = _partidos.length > 0
    ? _partidos[Math.floor(Math.random() * _partidos.length)]
    : MOCK_PARTIDOS[Math.floor(Math.random() * MOCK_PARTIDOS.length)]

  return {
    id: api.id,
    dia: existing.dia,
    mes: existing.mes,
    eq1: api.homeTeamName,
    eq2: api.awayTeamName,
    hora: existing.hora,
    lugar: existing.lugar,
    homeScore: api.homeScore,
    awayScore: api.awayScore,
    status: api.status as Partido['status'],
  }
}

// ─── API functions ───────────────────────────────────────────

/**
 * Obtiene partidos desde el API real y actualiza el módulo.
 * Si el API no responde (red, 401, 403), mantiene el mock actual.
 *
 * Llamar en el useEffect de las páginas que necesiten datos frescos.
 */
export async function fetchPartidos(): Promise<Partido[]> {
  try {
    const data = await getPartidosApi()
    const mapped: Partido[] = data.map(enrichWithMock)
    updatePartidos(mapped)
    return mapped
  } catch (error) {
    console.warn('[partidos] API falló, usando mock:', error)
    return [..._partidos]
  }
}
