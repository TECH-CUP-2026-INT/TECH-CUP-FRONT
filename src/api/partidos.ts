/**
 * Matches Service — API Client
 *
 * Endpoints del Matches Service expuestos via APIM:
 *   GET /api/partidos            → listado de partidos
 *   GET /api/partidos/{matchId}  → detalle de un partido
 */

import { apiGet } from './client'
import type { MatchSummaryAPI, MatchDetailAPI } from './tipos'

const BASE = '/api/v1/Partidos'

/**
 * Obtiene todos los partidos.
 * GET /api/partidos
 */
export async function getPartidosApi(): Promise<MatchSummaryAPI[]> {
  return apiGet<MatchSummaryAPI[]>(`${BASE}/api/partidos`)
}

/**
 * Obtiene detalle de un partido por ID.
 * GET /api/partidos/{matchId}
 */
export async function getPartidoPorIdApi(
  matchId: string
): Promise<MatchDetailAPI> {
  return apiGet<MatchDetailAPI>(`${BASE}/api/partidos/${matchId}`)
}
