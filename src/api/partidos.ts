/**
 * Matches Service — API Client
 *
 * Endpoints del Matches Service expuestos via APIM:
 *   GET /api/partidos            → listado de partidos
 *   GET /api/partidos/{matchId}  → detalle de un partido
 *   POST /api/partidos           → crear un nuevo partido
 */

import { apiGet, apiPost, apiPut, apiDelete } from './client'
import type { MatchSummaryAPI, MatchDetailAPI, CreateMatchRequest, CreateMatchResponse } from './tipos'

// Siempre via APIM — el client.ts ya apunta a https://techapi.azure-api.net
const MATCHES_PATH = '/api/v1/matches'

/**
 * Obtiene todos los partidos via APIM.
 * GET /api/v1/matches
 */
export async function getPartidosApi(): Promise<MatchSummaryAPI[]> {
  return apiGet<MatchSummaryAPI[]>(`${MATCHES_PATH}`)
}

/**
 * Obtiene detalle de un partido por ID via APIM.
 * GET /api/v1/matches/{matchId}
 */
export async function getPartidoPorIdApi(
  matchId: string
): Promise<MatchDetailAPI> {
  return apiGet<MatchDetailAPI>(`${MATCHES_PATH}/${matchId}`)
}

/**
 * Crea un nuevo partido via APIM.
 * POST /api/v1/matches
 */
export async function crearPartidoApi(
  data: CreateMatchRequest
): Promise<CreateMatchResponse> {
  return apiPost<CreateMatchResponse>(`${MATCHES_PATH}`, {
    tournamentId: data.tournamentId,
    homeTeamName: data.homeTeamId === 'eq-1' ? 'Tigres FC' : data.homeTeamId === 'eq-2' ? 'Sistemas FC' : data.homeTeamId === 'eq-3' ? 'Code United' : data.homeTeamId === 'eq-4' ? 'IA Warriors' : data.homeTeamId === 'eq-5' ? 'Dragones FC' : data.homeTeamId === 'eq-6' ? 'Los Bits' : 'Equipo',
    awayTeamName: data.awayTeamId === 'eq-1' ? 'Tigres FC' : data.awayTeamId === 'eq-2' ? 'Sistemas FC' : data.awayTeamId === 'eq-3' ? 'Code United' : data.awayTeamId === 'eq-4' ? 'IA Warriors' : data.awayTeamId === 'eq-5' ? 'Dragones FC' : data.awayTeamId === 'eq-6' ? 'Los Bits' : 'Equipo',
    scheduledDate: data.scheduledDate,
    venue: data.venue,
  })
}

// ═══════════════════════════════════════════════════════════════
// CRUD NUEVO: Update (resultado/estado) + Delete
// ═══════════════════════════════════════════════════════════════

export interface UpdateMatchRequest {
  homeScore?: number
  awayScore?: number
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED'
  currentMinute?: number
  currentPeriod?: string
  refereeId?: string
  venue?: string
  scheduledDate?: string
}

export interface UpdateMatchResponse {
  id: string
  message: string
}

/**
 * Actualiza un partido (resultado, estado, minuto, etc.).
 * PUT /api/v1/matches/{matchId}
 */
export async function updatePartidoApi(
  matchId: string,
  data: UpdateMatchRequest
): Promise<UpdateMatchResponse> {
  return apiPut<UpdateMatchResponse>(`${MATCHES_PATH}/${matchId}`, data)
}

/**
 * Elimina/cancela un partido.
 * DELETE /api/v1/matches/{matchId}
 */
export async function deletePartidoApi(
  matchId: string
): Promise<{ message: string }> {
  return apiDelete<{ message: string }>(`${MATCHES_PATH}/${matchId}`)
}
