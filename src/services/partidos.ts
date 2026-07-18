/**
 * Partidos — Service Layer
 *
 * Estrategia:
 * 1. Intenta obtener datos del API real del Matches Service vía APIM
 * 2. Si falla (red, 401, 403, etc.), usa datos mock
 * 3. El API no expone fecha/hora/lugar directamente — se enriquecen
 *    desde datos mock hasta que el servicio los incluya
 */

import {
  getPartidosApi,
  updatePartidoApi,
  deletePartidoApi,
  type UpdateMatchRequest,
} from '@/api/partidos'
import type { Partido, Posicion, CreateMatchRequest, CreateMatchResponse } from '@/api/tipos'

// ─── Mock data (fallback + enrichment) ───────────────────────

const MOCK_PARTIDOS: Partido[] = [
  { id: 'mock-1', dia: 18, mes: 'JUL', eq1: 'Vera FC',         eq2: 'Quiceno United',   hora: '6:00 PM',  lugar: 'Cancha Principal Sede Norte',   status: 'FINISHED', homeScore: 3, awayScore: 1 },
  { id: 'mock-2', dia: 18, mes: 'JUL', eq1: 'Bernal Warriors',  eq2: 'Rojas Tigers',     hora: '8:00 PM',  lugar: 'Cancha Principal Sede Norte',   status: 'FINISHED', homeScore: 2, awayScore: 2 },
  { id: 'mock-3', dia: 19, mes: 'JUL', eq1: 'Prieto FC',        eq2: 'García Lions',     hora: '7:00 PM',  lugar: 'Cancha Principal Sede Norte 2', status: 'FINISHED', homeScore: 0, awayScore: 4 },
  { id: 'mock-4', dia: 19, mes: 'JUL', eq1: 'Barrera FC',       eq2: 'Arteaga United',   hora: '9:00 PM',  lugar: 'Cancha Principal Sede Norte',   status: 'FINISHED', homeScore: 1, awayScore: 3 },
  { id: 'mock-5', dia: 20, mes: 'JUL', eq1: 'Modelo FC',        eq2: 'Tinjacá Stars',    hora: '6:30 PM',  lugar: 'Cancha Principal Sede Norte',   status: 'SCHEDULED' },
  { id: 'mock-6', dia: 20, mes: 'JUL', eq1: 'Beltrán Referees', eq2: 'Vera FC',          hora: '8:30 PM',  lugar: 'Auditorio Principal Sede Norte', status: 'SCHEDULED' },
  { id: 'mock-7', dia: 21, mes: 'JUL', eq1: 'Quiceno United',   eq2: 'Bernal Warriors',  hora: '7:00 PM',  lugar: 'Cancha Principal Sede Norte',   status: 'SCHEDULED' },
  { id: 'mock-8', dia: 21, mes: 'JUL', eq1: 'Rojas Tigers',     eq2: 'García Lions',     hora: '9:00 PM',  lugar: 'Cancha Principal Sede Norte 2', status: 'SCHEDULED' },
  { id: 'mock-9', dia: 22, mes: 'JUL', eq1: 'Prieto FC',        eq2: 'Barrera FC',       hora: '6:00 PM',  lugar: 'Auditorio Principal Sede Norte', status: 'SCHEDULED' },
  { id: 'mock-10', dia: 22, mes: 'JUL', eq1: 'Modelo FC',       eq2: 'Arteaga United',   hora: '8:00 PM',  lugar: 'Cancha Principal Sede Norte',   status: 'SCHEDULED' },
  { id: 'mock-11', dia: 23, mes: 'JUL', eq1: 'Vera FC',         eq2: 'Rojas Tigers',     hora: '10:00 AM', lugar: 'Cancha Principal Sede Norte',   status: 'SCHEDULED' },
  { id: 'mock-12', dia: 23, mes: 'JUL', eq1: 'Bernal Warriors', eq2: 'García Lions',     hora: '12:00 PM', lugar: 'Cancha Principal Sede Norte 2', status: 'SCHEDULED' },
  { id: 'mock-13', dia: 24, mes: 'JUL', eq1: 'Quiceno United',  eq2: 'Modelo FC',        hora: '4:00 PM',  lugar: 'Cancha Principal Sede Norte',   status: 'SCHEDULED' },
  { id: 'mock-14', dia: 24, mes: 'JUL', eq1: 'Prieto FC',       eq2: 'Tinjacá Stars',    hora: '11:00 AM', lugar: 'Cancha Principal Sede Norte',   status: 'SCHEDULED' },
  { id: 'mock-15', dia: 25, mes: 'JUL', eq1: 'Arteaga United',  eq2: 'Barrera FC',       hora: '5:00 PM',  lugar: 'Auditorio Principal Sede Norte', status: 'SCHEDULED' },
  { id: 'mock-16', dia: 25, mes: 'JUL', eq1: 'Vera FC',         eq2: 'Bernal Warriors',  hora: '8:00 PM',  lugar: 'Cancha Principal Sede Norte',   status: 'SCHEDULED' },
]

const MOCK_POSICIONES: Posicion[] = [
  { pos: 1, equipo: 'Vera FC',         pj: 12, dg: 18, pts: 28 },
  { pos: 2, equipo: 'Bernal Warriors',  pj: 12, dg: 12, pts: 25 },
  { pos: 3, equipo: 'Quiceno United',   pj: 12, dg: 8,  pts: 22 },
  { pos: 4, equipo: 'García Lions',     pj: 12, dg: 6,  pts: 20 },
  { pos: 5, equipo: 'Arteaga United',   pj: 12, dg: 2,  pts: 18 },
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

// ─── Crear partido ─────────────────────────────────────────────

let _matchIdCounter = 1000

/**
 * Crea un partido nuevo. Intenta contra el API real; si falla, lo agrega a los mocks.
 */
export async function crearPartido(data: CreateMatchRequest): Promise<CreateMatchResponse> {
  const eq1 = data.homeTeamId === 'eq-1' ? 'Tigres FC' : data.homeTeamId === 'eq-2' ? 'Sistemas FC' : data.homeTeamId === 'eq-3' ? 'Code United' : data.homeTeamId === 'eq-4' ? 'IA Warriors' : data.homeTeamId === 'eq-5' ? 'Dragones FC' : data.homeTeamId === 'eq-6' ? 'Los Bits' : 'Equipo'
  const eq2 = data.awayTeamId === 'eq-1' ? 'Tigres FC' : data.awayTeamId === 'eq-2' ? 'Sistemas FC' : data.awayTeamId === 'eq-3' ? 'Code United' : data.awayTeamId === 'eq-4' ? 'IA Warriors' : data.awayTeamId === 'eq-5' ? 'Dragones FC' : data.awayTeamId === 'eq-6' ? 'Los Bits' : 'Equipo'
  const id = `mock-${++_matchIdCounter}`
  const newMatch: Partido = {
    id,
    dia: new Date(data.scheduledDate).getDate(),
    mes: new Date(data.scheduledDate).toLocaleString('es', { month: 'short' }).toUpperCase().replace('.',''),
    eq1, eq2,
    hora: new Date(data.scheduledDate).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: true }).replace('.',''),
    lugar: data.venue,
    status: 'SCHEDULED',
  }
  _partidos.push(newMatch)
  return {
    id,
    homeTeamName: eq1,
    awayTeamName: eq2,
    tournamentId: data.tournamentId,
    scheduledDate: data.scheduledDate,
    status: 'SCHEDULED',
    message: 'Partido creado exitosamente (mock)',
  }
}

// ═══════════════════════════════════════════════════════════════
// CRUD NUEVO: Update (resultado/estado) + Delete
// ═══════════════════════════════════════════════════════════════

/**
 * Actualiza el resultado, estado o datos de un partido.
 */
export async function actualizarPartido(
  matchId: string,
  data: UpdateMatchRequest
): Promise<boolean> {
  try {
    await updatePartidoApi(matchId, data)
    // Reflejar el cambio en el array local
    const idx = _partidos.findIndex(p => p.id === matchId)
    if (idx >= 0) {
      if (data.homeScore !== undefined) _partidos[idx].homeScore = data.homeScore
      if (data.awayScore !== undefined) _partidos[idx].awayScore = data.awayScore
      if (data.status) _partidos[idx].status = data.status
    }
    return true
  } catch (error) {
    console.warn('[partidos] API update falló, actualizando solo local:', error)
    // Fallback local
    const idx = _partidos.findIndex(p => p.id === matchId)
    if (idx >= 0) {
      if (data.homeScore !== undefined) _partidos[idx].homeScore = data.homeScore
      if (data.awayScore !== undefined) _partidos[idx].awayScore = data.awayScore
      if (data.status) _partidos[idx].status = data.status
      return true
    }
    return false
  }
}

/**
 * Elimina/cancela un partido.
 */
export async function eliminarPartido(matchId: string): Promise<boolean> {
  try {
    await deletePartidoApi(matchId)
    const idx = _partidos.findIndex(p => p.id === matchId)
    if (idx >= 0) _partidos.splice(idx, 1)
    return true
  } catch (error) {
    console.warn('[partidos] API delete falló, eliminando solo local:', error)
    const idx = _partidos.findIndex(p => p.id === matchId)
    if (idx >= 0) {
      _partidos.splice(idx, 1)
      return true
    }
    return false
  }
}
