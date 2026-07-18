/**
 * Statistics Service — API Client
 *
 * Endpoints del Statistics Service expuestos via APIM:
 *   GET    /tournaments/{id}/standings     → tabla de posiciones
 *   GET    /tournaments/{id}/match-averages → promedios del torneo
 *   GET    /tournaments/{id}/cards         → tarjetas totales del torneo
 *   GET    /tournaments/{id}/recognitions  → reconocimientos del torneo
 *   GET    /players/{id}/average-*         → promedios de jugador
 *   GET    /players/{id}/total-*           → totales de jugador
 *   GET    /players/{id}/cards             → tarjetas del jugador
 *   GET    /players/{id}/matches-played    → partidos jugados
 *   GET    /players/{id}/assists           → asistencias
 *   GET    /teams/{id}/statistics          → estadísticas de equipo
 *   GET    /teams/{id}/match-record        → récord de equipo
 *   GET    /teams/{id}/goals               → goles de equipo
 *   GET    /matches/{id}/result            → resultado del partido
 *   GET    /matches/{id}/cards             → tarjetas del partido
 *   GET    /rankings?type=GOALS&limit=10   → rankings
 *   GET    /goalkeeper-ranking?limit=10    → ranking de arqueros
 */

import { apiGet } from './client'

// ─── Base path via APIM ──────────────────────────────────────
// APIM mapea cada servicio bajo su propio prefijo.
// Statistics Service: path = /api/v1/Statistics (controller base = /api/v1/statistics)
const BASE = '/api/v1/Statistics/api/v1/statistics'

// ─── Tipos API (raw) ─────────────────────────────────────────

export interface ApiTeamStatistics {
  teamId: string
  tournamentId: string
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface ApiStandingsResponse {
  tournamentId: string
  standings: ApiTeamStatistics[]
}

export interface ApiPlayerAverageResponse {
  playerId: string
  tournamentId: string
  metric: string
  value: number
  matchesConsidered: number
}

export interface ApiTotalResponse {
  entityId: string
  tournamentId: string
  metric: string
  total: number
  eventsConsidered: number
}

export interface ApiPlayerCardsResponse {
  playerId: string
  tournamentId: string
  yellowCards: number
  redCards: number
}

export interface ApiMatchesPlayedResponse {
  playerId: string
  tournamentId: string
  matchesPlayed: number
}

export interface ApiRankingEntry {
  position: number
  playerId: string
  value: number
}

export interface ApiRankingResponse {
  type: string
  tournamentId: string
  entries: ApiRankingEntry[]
}

export interface ApiGoalkeeperEntry {
  position: number
  playerId: string
  goalsConceded: number
}

export interface ApiGoalkeeperRankingResponse {
  tournamentId: string
  entries: ApiGoalkeeperEntry[]
}

export interface ApiMatchResultResponse {
  matchId: string
  tournamentId: string
  teamResults: {
    teamId: string
    result: 'WON' | 'DRAWN' | 'LOST'
  }[]
}

export interface ApiCardsTotalResponse {
  scope: string
  id: string
  yellowCards: number
  redCards: number
}

export interface ApiTournamentMatchAveragesResponse {
  tournamentId: string
  matchesConsidered: number
  averageGoalsPerMatch: number
  averageFoulsPerMatch: number
  averageCardsPerMatch: number
}

export interface ApiTeamGoalsResponse {
  teamId: string
  tournamentId: string
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

export interface ApiTeamAverageResponse {
  teamId: string
  tournamentId: string
  metric: string
  value: number
  matchesConsidered: number
}

export interface ApiTeamMatchRecordResponse {
  teamId: string
  tournamentId: string
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  winRatePercentage: number
  drawRatePercentage: number
  lossRatePercentage: number
}

export interface ApiRecognitionResponse {
  tournamentId: string
  topScorers: { playerId: string; goals: number }[]
  topScorersGoals: number
  bestDefenseTeams: { teamId: string; goalsAgainst: number }[]
  bestDefenseGoalsAgainst: number
  generatedAt: string
}

// ─── Tipos de ranking ────────────────────────────────────────
export type RankingTypeParam = 'GOALS' | 'WINS' | 'FOULS' | 'MINUTES'
export type MatchResultParam = 'WON' | 'DRAWN' | 'LOST'

// ─── API Functions ───────────────────────────────────────────

// ── Standings ──

/**
 * Tabla de posiciones de un torneo.
 * GET /tournaments/{tournamentId}/standings
 */
export async function getStandingsApi(
  tournamentId: string
): Promise<ApiStandingsResponse> {
  return apiGet<ApiStandingsResponse>(
    `${BASE}/tournaments/${tournamentId}/standings`
  )
}

// ── Tournament averages ──

/**
 * Promedios del torneo (goles, faltas, tarjetas por partido).
 * GET /tournaments/{tournamentId}/match-averages
 */
export async function getTournamentMatchAveragesApi(
  tournamentId: string
): Promise<ApiTournamentMatchAveragesResponse> {
  return apiGet<ApiTournamentMatchAveragesResponse>(
    `${BASE}/tournaments/${tournamentId}/match-averages`
  )
}

// ── Tournament cards ──

/**
 * Total de tarjetas en el torneo.
 * GET /tournaments/{tournamentId}/cards
 */
export async function getTournamentCardsApi(
  tournamentId: string
): Promise<ApiCardsTotalResponse> {
  return apiGet<ApiCardsTotalResponse>(
    `${BASE}/tournaments/${tournamentId}/cards`
  )
}

// ── Recognitions ──

/**
 * Reconocimientos del torneo (goleadores, mejor defensa).
 * GET /tournaments/{tournamentId}/recognitions
 */
export async function getRecognitionsApi(
  tournamentId: string
): Promise<ApiRecognitionResponse> {
  return apiGet<ApiRecognitionResponse>(
    `${BASE}/tournaments/${tournamentId}/recognitions`
  )
}

// ── Player stats ──

/**
 * Promedio de goles de un jugador en un torneo.
 * GET /players/{playerId}/average-goals?tournamentId=
 */
export async function getPlayerAverageGoalsApi(
  playerId: string,
  tournamentId?: string
): Promise<ApiPlayerAverageResponse> {
  return apiGet<ApiPlayerAverageResponse>(
    `${BASE}/players/${playerId}/average-goals`,
    { params: tournamentId ? { tournamentId } : undefined }
  )
}

/**
 * Promedio de faltas de un jugador.
 * GET /players/{playerId}/average-fouls?tournamentId=
 */
export async function getPlayerAverageFoulsApi(
  playerId: string,
  tournamentId?: string
): Promise<ApiPlayerAverageResponse> {
  return apiGet<ApiPlayerAverageResponse>(
    `${BASE}/players/${playerId}/average-fouls`,
    { params: tournamentId ? { tournamentId } : undefined }
  )
}

/**
 * Promedio de minutos jugados.
 * GET /players/{playerId}/average-minutes-played?tournamentId=
 */
export async function getPlayerAverageMinutesApi(
  playerId: string,
  tournamentId?: string
): Promise<ApiPlayerAverageResponse> {
  return apiGet<ApiPlayerAverageResponse>(
    `${BASE}/players/${playerId}/average-minutes-played`,
    { params: tournamentId ? { tournamentId } : undefined }
  )
}

/**
 * Total de goles de un jugador.
 * GET /players/{playerId}/total-goals?tournamentId=
 */
export async function getPlayerTotalGoalsApi(
  playerId: string,
  tournamentId?: string
): Promise<ApiTotalResponse> {
  return apiGet<ApiTotalResponse>(
    `${BASE}/players/${playerId}/total-goals`,
    { params: tournamentId ? { tournamentId } : undefined }
  )
}

/**
 * Total de faltas de un jugador.
 * GET /players/{playerId}/total-fouls?tournamentId=
 */
export async function getPlayerTotalFoulsApi(
  playerId: string,
  tournamentId?: string
): Promise<ApiTotalResponse> {
  return apiGet<ApiTotalResponse>(
    `${BASE}/players/${playerId}/total-fouls`,
    { params: tournamentId ? { tournamentId } : undefined }
  )
}

/**
 * Asistencias de un jugador.
 * GET /players/{playerId}/assists?tournamentId=
 */
export async function getPlayerAssistsApi(
  playerId: string,
  tournamentId?: string
): Promise<ApiTotalResponse> {
  return apiGet<ApiTotalResponse>(
    `${BASE}/players/${playerId}/assists`,
    { params: tournamentId ? { tournamentId } : undefined }
  )
}

/**
 * Tarjetas de un jugador.
 * GET /players/{playerId}/cards?tournamentId=
 */
export async function getPlayerCardsApi(
  playerId: string,
  tournamentId?: string
): Promise<ApiPlayerCardsResponse> {
  return apiGet<ApiPlayerCardsResponse>(
    `${BASE}/players/${playerId}/cards`,
    { params: tournamentId ? { tournamentId } : undefined }
  )
}

/**
 * Partidos jugados por un jugador.
 * GET /players/{playerId}/matches-played?tournamentId=
 */
export async function getPlayerMatchesPlayedApi(
  playerId: string,
  tournamentId?: string
): Promise<ApiMatchesPlayedResponse> {
  return apiGet<ApiMatchesPlayedResponse>(
    `${BASE}/players/${playerId}/matches-played`,
    { params: tournamentId ? { tournamentId } : undefined }
  )
}

// ── Team stats ──

/**
 * Estadísticas completas de un equipo.
 * GET /teams/{teamId}/statistics?tournamentId=
 */
export async function getTeamStatisticsApi(
  teamId: string,
  tournamentId?: string
): Promise<ApiTeamStatistics> {
  return apiGet<ApiTeamStatistics>(
    `${BASE}/teams/${teamId}/statistics`,
    { params: tournamentId ? { tournamentId } : undefined }
  )
}

/**
 * Goles de un equipo.
 * GET /teams/{teamId}/goals?tournamentId=
 */
export async function getTeamGoalsApi(
  teamId: string,
  tournamentId?: string
): Promise<ApiTeamGoalsResponse> {
  return apiGet<ApiTeamGoalsResponse>(
    `${BASE}/teams/${teamId}/goals`,
    { params: tournamentId ? { tournamentId } : undefined }
  )
}

/**
 * Récord de partidos de un equipo.
 * GET /teams/{teamId}/match-record?tournamentId=
 */
export async function getTeamMatchRecordApi(
  teamId: string,
  tournamentId?: string
): Promise<ApiTeamMatchRecordResponse> {
  return apiGet<ApiTeamMatchRecordResponse>(
    `${BASE}/teams/${teamId}/match-record`,
    { params: tournamentId ? { tournamentId } : undefined }
  )
}

// ── Match stats ──

/**
 * Resultado de un partido.
 * GET /matches/{matchId}/result
 */
export async function getMatchResultApi(
  matchId: string
): Promise<ApiMatchResultResponse> {
  return apiGet<ApiMatchResultResponse>(
    `${BASE}/matches/${matchId}/result`
  )
}

/**
 * Tarjetas de un partido.
 * GET /matches/{matchId}/cards
 */
export async function getMatchCardsApi(
  matchId: string
): Promise<ApiCardsTotalResponse> {
  return apiGet<ApiCardsTotalResponse>(
    `${BASE}/matches/${matchId}/cards`
  )
}

// ── Rankings ──

/**
 * Rankings globales (goleadores, victorias, faltas, minutos).
 * GET /rankings?type=GOALS&tournamentId=&limit=10
 */
export async function getRankingsApi(
  type: RankingTypeParam,
  limit = 10,
  tournamentId?: string
): Promise<ApiRankingResponse> {
  const params: Record<string, string | number> = { type, limit }
  if (tournamentId) params.tournamentId = tournamentId
  return apiGet<ApiRankingResponse>(`${BASE}/rankings`, { params })
}

/**
 * Ranking de arqueros (valla menos vencida).
 * GET /goalkeeper-ranking?tournamentId=&limit=10
 */
export async function getGoalkeeperRankingApi(
  limit = 10,
  tournamentId?: string
): Promise<ApiGoalkeeperRankingResponse> {
  const params: Record<string, string | number> = { limit }
  if (tournamentId) params.tournamentId = tournamentId
  return apiGet<ApiGoalkeeperRankingResponse>(
    `${BASE}/goalkeeper-ranking`,
    { params }
  )
}
