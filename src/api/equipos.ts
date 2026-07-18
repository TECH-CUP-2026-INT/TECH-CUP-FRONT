/**
 * Teams Service — API Client
 *
 * Endpoints del Teams Service expuestos via APIM:
 *   POST   /api/v1/teams                        → crear equipo (multipart)
 *   POST   /api/v1/captaincy/teams/{id}/transfer → iniciar transferencia capitanía
 *   POST   /api/v1/captaincy/teams/{id}/apply    → solicitar capitanía
 *   PUT    /api/v1/captaincy/{id}/respond        → responder transferencia
 *   POST   /api/v1/invitations/teams/{id}        → enviar invitación
 *   PUT    /api/v1/invitations/{id}/respond      → responder invitación
 *   GET    /api/v1/invitations/my                → mis invitaciones
 *   GET    /api/v1/invitations/teams/{id}        → invitaciones del equipo
 *   GET    /api/v1/tournaments/{id}/teams        → equipos de un torneo
 *   POST   /api/v1/tournaments/{id}/teams/{teamId}/enrollment → inscribir equipo
 *   GET    /api/v1/audit                         → eventos de auditoría
 *
 * Endpoints internos (sin /api/v1, servicio-a-servicio):
 *   GET    /teams/{id}                           → info básica (nombre + rosterSize)
 *   GET    /teams/by-player/{playerId}/roster    → roster por jugador
 *   GET    /teams/by-player/{playerId}/active-tournament → torneo activo
 */

import api, { apiGet, apiPost } from './client'
import type { UUID } from './tipos'

// ─── Base path via APIM ──────────────────────────────────────
const BASE = '/api/v1/Teams/api/v1'

// ═══════════════════════════════════════════════════════════════
// TIPOS API (raw) — mapean directamente las respuestas del backend
// ═══════════════════════════════════════════════════════════════

export interface ApiTeam {
  id: UUID
  name: string
  colors: string
  captainId: UUID
  memberCount: number
  createdAt: string
  updatedAt: string
}

export interface ApiTeamInfo {
  teamName: string
  rosterSize: number
}

export interface ApiTeamRoster {
  teamId: UUID | null
  memberIds: UUID[]
}

export interface ApiRegisteredTeam {
  teamId: UUID
  teamName: string
  registrationStatus: string
  logoUrl: string
}

export interface ApiInvitation {
  id: UUID
  teamId: UUID
  teamName: string
  invitedUserId: UUID
  invitedBy: UUID
  status: InvitationStatus
  createdAt: string
  respondedAt: string | null
}

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface ApiCaptaincyTransfer {
  id: UUID
  teamId: UUID
  teamName: string
  currentCaptainId: UUID
  newCaptainId: UUID
  initiatedBy: 'CAPTAIN' | 'PLAYER'
  status: TransferStatus
  createdAt: string
  respondedAt: string | null
}

export type TransferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface ApiEnrollment {
  enrollmentId: UUID
  status: string
  reservationExpiresAt: string
}

export interface ApiAuditEvent {
  id: UUID
  teamId: UUID
  userId: UUID
  actionType: string
  description: string
  success: boolean
  timestamp: string
}

// ═══════════════════════════════════════════════════════════════
// EQUIPOS
// ═══════════════════════════════════════════════════════════════

/**
 * Crear un equipo (multipart: JSON + logo).
 * POST /api/v1/teams
 */
export async function createTeamApi(
  name: string,
  captainName: string,
  colors: string,
  logoFile?: File
): Promise<ApiTeam> {
  const formData = new FormData()
  const teamBlob = new Blob(
    [JSON.stringify({ name, captainName, colors })],
    { type: 'application/json' }
  )
  formData.append('team', teamBlob, 'team.json')
  if (logoFile) {
    formData.append('logo', logoFile)
  } else {
    // Logo por defecto si no se sube uno
    const defaultLogo = new Blob([''], { type: 'image/png' })
    formData.append('logo', defaultLogo, 'default.png')
  }

  const res = await api.post<ApiTeam>(`${BASE}/teams`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

// ═══════════════════════════════════════════════════════════════
// INVITACIONES
// ═══════════════════════════════════════════════════════════════

/**
 * Enviar invitación a un jugador.
 * POST /api/v1/invitations/teams/{teamId}
 */
export async function sendInvitationApi(
  teamId: UUID,
  invitedUserId: UUID
): Promise<ApiInvitation> {
  return apiPost<ApiInvitation>(`${BASE}/invitations/teams/${teamId}`, {
    invitedUserId,
  })
}

/**
 * Responder invitación (aceptar/rechazar).
 * PUT /api/v1/invitations/{invitationId}/respond
 */
export async function respondInvitationApi(
  invitationId: UUID,
  accept: boolean,
  userName?: string
): Promise<ApiInvitation> {
  const res = await api.put<ApiInvitation>(
    `${BASE}/invitations/${invitationId}/respond`,
    { accept, userName: accept ? userName : undefined }
  )
  return res.data
}

/**
 * Mis invitaciones recibidas.
 * GET /api/v1/invitations/my
 */
export async function getMyInvitationsApi(): Promise<ApiInvitation[]> {
  return apiGet<ApiInvitation[]>(`${BASE}/invitations/my`)
}

/**
 * Invitaciones enviadas por un equipo (capitán).
 * GET /api/v1/invitations/teams/{teamId}
 */
export async function getTeamInvitationsApi(
  teamId: UUID
): Promise<ApiInvitation[]> {
  return apiGet<ApiInvitation[]>(`${BASE}/invitations/teams/${teamId}`)
}

// ═══════════════════════════════════════════════════════════════
// CAPITANÍA
// ═══════════════════════════════════════════════════════════════

/**
 * Iniciar transferencia de capitanía.
 * POST /api/v1/captaincy/teams/{teamId}/transfer
 */
export async function initiateTransferApi(
  teamId: UUID,
  newCaptainId: UUID
): Promise<ApiCaptaincyTransfer> {
  return apiPost<ApiCaptaincyTransfer>(
    `${BASE}/captaincy/teams/${teamId}/transfer`,
    { newCaptainId }
  )
}

/**
 * Solicitar capitanía.
 * POST /api/v1/captaincy/teams/{teamId}/apply
 */
export async function applyForCaptaincyApi(
  teamId: UUID,
  playerName: string
): Promise<ApiCaptaincyTransfer> {
  return apiPost<ApiCaptaincyTransfer>(
    `${BASE}/captaincy/teams/${teamId}/apply`,
    { playerName }
  )
}

/**
 * Responder solicitud de transferencia.
 * PUT /api/v1/captaincy/{transferId}/respond
 */
export async function respondTransferApi(
  transferId: UUID,
  accept: boolean
): Promise<ApiCaptaincyTransfer> {
  const res = await api.put<ApiCaptaincyTransfer>(
    `${BASE}/captaincy/${transferId}/respond`,
    { accept }
  )
  return res.data
}

// ═══════════════════════════════════════════════════════════════
// TORNEOS (proxy teams→tournament)
// ═══════════════════════════════════════════════════════════════

/**
 * Equipos registrados en un torneo.
 * GET /api/v1/tournaments/{tournamentId}/teams
 */
export async function getRegisteredTeamsApi(
  tournamentId: UUID
): Promise<ApiRegisteredTeam[]> {
  return apiGet<ApiRegisteredTeam[]>(
    `${BASE}/tournaments/${tournamentId}/teams`
  )
}

/**
 * Inscribir equipo en un torneo.
 * POST /api/v1/tournaments/{tournamentId}/teams/{teamId}/enrollment
 */
export async function enrollTeamApi(
  tournamentId: UUID,
  teamId: UUID
): Promise<ApiEnrollment> {
  return apiPost<ApiEnrollment>(
    `${BASE}/tournaments/${tournamentId}/teams/${teamId}/enrollment`,
    {}
  )
}

// ═══════════════════════════════════════════════════════════════
// AUDITORÍA
// ═══════════════════════════════════════════════════════════════

/**
 * Eventos de auditoría.
 * GET /api/v1/audit
 */
export async function getAuditEventsApi(): Promise<ApiAuditEvent[]> {
  return apiGet<ApiAuditEvent[]>(`${BASE}/audit`)
}

// ═══════════════════════════════════════════════════════════════
// ENDPOINTS INTERNOS (servicio-a-servicio, pueden no estar en APIM)
// ═══════════════════════════════════════════════════════════════

/**
 * Info básica de un equipo (nombre + rosterSize).
 * Interno: GET /teams/{teamId} — puede requerir configurar APIM.
 */
export async function getTeamInfoApi(teamId: UUID): Promise<ApiTeamInfo> {
  return apiGet<ApiTeamInfo>(`/api/v1/Teams/teams/${teamId}`)
}

/**
 * Roster de un jugador (teamId + memberIds).
 * Interno: GET /teams/by-player/{playerId}/roster — puede requerir configurar APIM.
 */
export async function getTeamRosterApi(
  playerId: UUID
): Promise<ApiTeamRoster> {
  return apiGet<ApiTeamRoster>(
    `/api/v1/Teams/teams/by-player/${playerId}/roster`
  )
}
