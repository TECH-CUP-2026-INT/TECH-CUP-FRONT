/**
 * Equipos — Service Layer
 *
 * Estrategia:
 * 1. Datos mock iniciales para que el frontend no rompa
 * 2. fetchEquipos() reemplaza el array con datos reales del API
 * 3. Las páginas que necesiten datos frescos llaman a fetch*() en onMount
 * 4. El API devuelve solo IDs — el service layer resuelve nombres desde lookup interno
 */

import {
  createTeamApi,
  sendInvitationApi,
  respondInvitationApi,
  getMyInvitationsApi,
  getRegisteredTeamsApi,
  enrollTeamApi,
  getTeamInfoApi,
  updateTeamApi,
  deleteTeamApi,
  removeMemberApi,
  type ApiTeam,
  type ApiRegisteredTeam,
  type ApiInvitation,
  type UpdateTeamRequest,
} from '@/api/equipos'
import type {
  EquipoDisplay,
  EquipoRosterDisplay,
  InvitacionDisplay,
  InscripcionDisplay,
  UUID,
} from '@/api/tipos'
import { hasJwt, apiGet } from '@/api/client'

// ─── Module-level state ──────────────────────────────────────

/** Equipos registrados en el torneo activo */
const _equipos: EquipoDisplay[] = []

// eslint-disable-next-line prefer-const
export let equipos: EquipoDisplay[] = _equipos

/** Roster del equipo del usuario logueado (por API interna) */
let _miEquipo: EquipoDisplay | null = null
let _miRoster: string[] = []

// ─── Mock fallback data ──────────────────────────────────────

const MOCK_EQUIPOS: EquipoDisplay[] = [
  {
    id: 'team-tigres', nombre: 'Tigres FC', colores: '#EF4444,#F97316',
    capitanId: 'player-carlos-m', capitanNombre: 'Carlos Martínez', miembros: 11,
    stats: { pj: 12, g: 9, e: 2, p: 1, gf: 28, gc: 10, pts: 29 },
  },
  {
    id: 'team-sistemas', nombre: 'Sistemas FC', colores: '#6D28D9,#F5A623',
    capitanId: 'player-juan', capitanNombre: 'Juan Pérez', miembros: 10,
    stats: { pj: 12, g: 8, e: 2, p: 2, gf: 22, gc: 10, pts: 26 },
  },
  {
    id: 'team-warriors', nombre: 'IA Warriors', colores: '#8B5CF6,#A855F7',
    capitanId: 'player-maria', capitanNombre: 'María López', miembros: 10,
    stats: { pj: 12, g: 7, e: 3, p: 2, gf: 20, gc: 12, pts: 24 },
  },
  {
    id: 'team-code', nombre: 'Code United', colores: '#3B82F6,#60A5FA',
    capitanId: 'player-pedro', capitanNombre: 'Pedro Sánchez', miembros: 12,
    stats: { pj: 12, g: 6, e: 2, p: 4, gf: 18, gc: 14, pts: 20 },
  },
  {
    id: 'team-dragones', nombre: 'Dragones FC', colores: '#F97316,#FB923C',
    capitanId: 'player-ana', capitanNombre: 'Ana Torres', miembros: 9,
    stats: { pj: 12, g: 4, e: 3, p: 5, gf: 15, gc: 18, pts: 15 },
  },
  {
    id: 'team-bits', nombre: 'Los Bits', colores: '#000000,#FFFFFF',
    capitanId: 'player-andres', capitanNombre: 'Andrés López', miembros: 8,
    stats: { pj: 12, g: 3, e: 2, p: 7, gf: 12, gc: 22, pts: 11 },
  },
]

const MOCK_MI_EQUIPO: EquipoDisplay = {
  id: 'team-sistemas', nombre: 'Sistemas FC', colores: '#6D28D9,#F5A623',
  capitanId: 'player-juan', capitanNombre: 'Juan Pérez', miembros: 10,
  stats: { pj: 12, g: 8, e: 2, p: 2, gf: 22, gc: 10, pts: 26 },
}

// ─── Helpers ─────────────────────────────────────────────────

function updateEquipos(data: EquipoDisplay[]): void {
  _equipos.splice(0, _equipos.length, ...data)
}

function mapRegisteredTeam(t: ApiRegisteredTeam): EquipoDisplay {
  return {
    id: t.teamId,
    nombre: t.teamName,
    logoUrl: t.logoUrl,
    miembros: 0, // el endpoint no devuelve cantidad de miembros
  }
}

// ─── Service Functions ───────────────────────────────────────

/**
 * Obtener equipos registrados en un torneo.
 * Si el API falla, usa datos mock.
 */
export async function fetchEquiposTorneo(
  tournamentId?: string
): Promise<EquipoDisplay[]> {
  try {
    const effectiveId = tournamentId || 'current'
    const data = await getRegisteredTeamsApi(effectiveId)
    const mapped = data.map(mapRegisteredTeam)
    updateEquipos(mapped)
    return mapped
  } catch (error) {
    console.warn('[equipos] API equipos falló, usando mock:', error)
    updateEquipos(MOCK_EQUIPOS)
    return [...MOCK_EQUIPOS]
  }
}

/**
 * Obtener el equipo del usuario autenticado.
 * Usa el endpoint interno /teams/by-player/{playerId}/roster
 * (requiere APIM configurado para exponer TeamInfoController).
 * Fallback a mock si no está disponible.
 */
export async function fetchMiEquipo(
  playerId?: UUID
): Promise<EquipoDisplay | null> {
  if (!hasJwt()) return null

  if (!playerId) {
    console.warn('[equipos] playerId requerido para fetchMiEquipo, usando mock')
    _miEquipo = MOCK_MI_EQUIPO
    return MOCK_MI_EQUIPO
  }

  try {
    const roster = await apiGet<{ teamId: UUID | null; memberIds: UUID[] }>(
      `/api/v1/Teams/teams/by-player/${playerId}/roster`
    )
    if (!roster.teamId) return null

    _miRoster = roster.memberIds

    // Obtener info del equipo
    const info = await getTeamInfoApi(roster.teamId)
    _miEquipo = {
      id: roster.teamId,
      nombre: info.teamName,
      miembros: info.rosterSize,
    }
    return _miEquipo
  } catch (error) {
    console.warn('[equipos] API mi equipo falló, usando mock:', error)
    _miEquipo = MOCK_MI_EQUIPO
    return MOCK_MI_EQUIPO
  }
}

/**
 * Obtener el roster del equipo del usuario.
 * Devuelve array de UUIDs de miembros.
 */
export function getMiRoster(): string[] {
  return _miRoster
}

/**
 * Crear un equipo.
 * POST /api/v1/teams (multipart)
 */
export async function crearEquipo(
  name: string,
  captainName: string,
  colors: string,
  logoFile?: File
): Promise<ApiTeam | null> {
  try {
    const result = await createTeamApi(name, captainName, colors, logoFile)
    console.log('[equipos] Equipo creado:', result.id)
    return result
  } catch (error) {
    console.error('[equipos] Error al crear equipo:', error)
    return null
  }
}

/**
 * Inscribir equipo en un torneo.
 */
export async function inscribirEnTorneo(
  tournamentId: UUID,
  teamId: UUID
): Promise<InscripcionDisplay | null> {
  try {
    const result = await enrollTeamApi(tournamentId, teamId)
    return {
      enrollmentId: result.enrollmentId,
      status: result.status,
      vence: result.reservationExpiresAt,
    }
  } catch (error) {
    console.error('[equipos] Error al inscribir:', error)
    return null
  }
}

/**
 * Enviar invitación a un jugador.
 */
export async function invitarJugador(
  teamId: UUID,
  invitedUserId: UUID
): Promise<boolean> {
  try {
    await sendInvitationApi(teamId, invitedUserId)
    return true
  } catch (error) {
    console.error('[equipos] Error al invitar:', error)
    return false
  }
}

/**
 * Responder invitación.
 */
export async function responderInvitacion(
  invitationId: UUID,
  accept: boolean,
  userName?: string
): Promise<boolean> {
  try {
    await respondInvitationApi(invitationId, accept, userName)
    return true
  } catch (error) {
    console.error('[equipos] Error al responder invitación:', error)
    return false
  }
}

/**
 * Obtener las invitaciones del usuario autenticado.
 */
export async function fetchMisInvitaciones(): Promise<InvitacionDisplay[]> {
  try {
    const data = await getMyInvitationsApi()
    return data.map(mapInvitacion)
  } catch (error) {
    console.warn('[equipos] API invitaciones falló:', error)
    return []
  }
}

function mapInvitacion(api: ApiInvitation): InvitacionDisplay {
  return {
    id: api.id,
    teamId: api.teamId,
    teamName: api.teamName,
    estado: api.status === 'PENDING'
      ? 'pendiente'
      : api.status === 'ACCEPTED'
        ? 'aceptada'
        : 'rechazada',
    createdAt: api.createdAt,
  }
}

// ═══════════════════════════════════════════════════════════════
// CRUD NUEVO: Update + Delete
// ═══════════════════════════════════════════════════════════════

/**
 * Actualiza los datos de un equipo.
 */
export async function actualizarEquipo(
  teamId: string,
  data: UpdateTeamRequest
): Promise<EquipoDisplay | null> {
  try {
    const result = await updateTeamApi(teamId, data)
    // Reflejar en array local
    const idx = _equipos.findIndex(e => e.id === teamId)
    if (idx >= 0) {
      if (data.name) _equipos[idx].nombre = data.name
      if (data.colors) _equipos[idx].colores = data.colors
    }
    if (_miEquipo?.id === teamId) {
      if (data.name) _miEquipo.nombre = data.name
      if (data.colors) _miEquipo.colores = data.colors
    }
    return {
      id: result.id,
      nombre: result.name,
      colores: result.colors,
      miembros: result.memberCount,
    }
  } catch (error) {
    console.warn('[equipos] API update falló:', error)
    return null
  }
}

/**
 * Elimina un equipo.
 */
export async function eliminarEquipo(teamId: string): Promise<boolean> {
  try {
    await deleteTeamApi(teamId)
    const idx = _equipos.findIndex(e => e.id === teamId)
    if (idx >= 0) _equipos.splice(idx, 1)
    if (_miEquipo?.id === teamId) _miEquipo = null
    return true
  } catch (error) {
    console.warn('[equipos] API delete falló:', error)
    return false
  }
}

/**
 * Expulsa un miembro del equipo.
 */
export async function expulsarMiembro(
  teamId: string,
  memberId: string
): Promise<boolean> {
  try {
    await removeMemberApi(teamId, memberId)
    return true
  } catch (error) {
    console.warn('[equipos] API remove member falló:', error)
    return false
  }
}
