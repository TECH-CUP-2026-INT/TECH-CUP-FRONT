/**
 * Matches Service — API Client
 *
 * Endpoints del Matches Service expuestos via APIM:
 *   GET /api/partidos            → listado de partidos
 *   GET /api/partidos/{matchId}  → detalle de un partido
 *   POST /api/partidos           → crear un nuevo partido
 */

import { apiGet, apiPost } from './client'
import type { MatchSummaryAPI, MatchDetailAPI, CreateMatchRequest, CreateMatchResponse } from './tipos'

const DEV = import.meta.env.DEV
const MATCHES_BASE = DEV
  ? 'https://matches-service.bluebush-a05ae8bd.eastus2.azurecontainerapps.io'
  : ''

/**
 * Obtiene todos los partidos.
 * GET /api/partidos
 */
export async function getPartidosApi(): Promise<MatchSummaryAPI[]> {
  return apiGet<MatchSummaryAPI[]>(`${MATCHES_BASE}/api/partidos`)
}

/**
 * Obtiene detalle de un partido por ID.
 * GET /api/partidos/{matchId}
 */
export async function getPartidoPorIdApi(
  matchId: string
): Promise<MatchDetailAPI> {
  return apiGet<MatchDetailAPI>(`${MATCHES_BASE}/api/partidos/${matchId}`)
}

/**
 * Crea un nuevo partido.
 * POST /api/partidos/crear
 */
export async function crearPartidoApi(
  data: CreateMatchRequest
): Promise<CreateMatchResponse> {
  return apiPost<CreateMatchResponse>(`${MATCHES_BASE}/api/partidos/crear`, {
    tournamentId: data.tournamentId,
    homeTeamName: data.homeTeamId === 'eq-1' ? 'Tigres FC' : data.homeTeamId === 'eq-2' ? 'Sistemas FC' : data.homeTeamId === 'eq-3' ? 'Code United' : data.homeTeamId === 'eq-4' ? 'IA Warriors' : data.homeTeamId === 'eq-5' ? 'Dragones FC' : data.homeTeamId === 'eq-6' ? 'Los Bits' : 'Equipo',
    awayTeamName: data.awayTeamId === 'eq-1' ? 'Tigres FC' : data.awayTeamId === 'eq-2' ? 'Sistemas FC' : data.awayTeamId === 'eq-3' ? 'Code United' : data.awayTeamId === 'eq-4' ? 'IA Warriors' : data.awayTeamId === 'eq-5' ? 'Dragones FC' : data.awayTeamId === 'eq-6' ? 'Los Bits' : 'Equipo',
    scheduledDate: data.scheduledDate,
    venue: data.venue,
  })
}
