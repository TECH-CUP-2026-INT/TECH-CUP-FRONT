import { apiGet, apiPost } from './client'
import type {
  RankingEntry,
  GoalkeeperRankingEntry,
  RankingType,
  PlayerStat,
  PlayerCards,
  TeamStatistics,
  TeamMatchRecord,
  StandingsEntry,
  TournamentMatchAverages,
  Recognition,
  CreateRecognitionRequest,
  MatchResult,
  MatchCards,
} from './tipos'

// ─── Rankings ───────────────────────────────────────────────

/** GET /api/v1/statistics/rankings?type={type}&limit={limit} */
export async function getRankings(type: RankingType, limit: number = 10): Promise<RankingEntry[]> {
  return apiGet<RankingEntry[]>('/api/v1/statistics/rankings', {
    params: { type, limit },
  })
}

/** GET /api/v1/statistics/goalkeeper-ranking?limit={limit} */
export async function getGoalkeeperRanking(limit: number = 10): Promise<GoalkeeperRankingEntry[]> {
  return apiGet<GoalkeeperRankingEntry[]>('/api/v1/statistics/goalkeeper-ranking', {
    params: { limit },
  })
}

// ─── Player Statistics ──────────────────────────────────────

/** GET /api/v1/statistics/players/{playerId}/average-win-rate */
export async function getPlayerAverageWinRate(playerId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/players/${playerId}/average-win-rate`)
}

/** GET /api/v1/statistics/players/{playerId}/average-goals */
export async function getPlayerAverageGoals(playerId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/players/${playerId}/average-goals`)
}

/** GET /api/v1/statistics/players/{playerId}/average-fouls */
export async function getPlayerAverageFouls(playerId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/players/${playerId}/average-fouls`)
}

/** GET /api/v1/statistics/players/{playerId}/average-minutes-played */
export async function getPlayerAverageMinutesPlayed(playerId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/players/${playerId}/average-minutes-played`)
}

/** GET /api/v1/statistics/players/{playerId}/matches-played */
export async function getPlayerMatchesPlayed(playerId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/players/${playerId}/matches-played`)
}

/** GET /api/v1/statistics/players/{playerId}/total-goals */
export async function getPlayerTotalGoals(playerId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/players/${playerId}/total-goals`)
}

/** GET /api/v1/statistics/players/{playerId}/total-fouls */
export async function getPlayerTotalFouls(playerId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/players/${playerId}/total-fouls`)
}

/** GET /api/v1/statistics/players/{playerId}/assists */
export async function getPlayerAssists(playerId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/players/${playerId}/assists`)
}

/** GET /api/v1/statistics/players/{playerId}/cards */
export async function getPlayerCards(playerId: string): Promise<PlayerCards> {
  return apiGet<PlayerCards>(`/api/v1/statistics/players/${playerId}/cards`)
}

// ─── Team Statistics ────────────────────────────────────────

/** GET /api/v1/statistics/teams/{teamId}/statistics */
export async function getTeamStatistics(teamId: string): Promise<TeamStatistics> {
  return apiGet<TeamStatistics>(`/api/v1/statistics/teams/${teamId}/statistics`)
}

/** GET /api/v1/statistics/teams/{teamId}/match-record */
export async function getTeamMatchRecord(teamId: string): Promise<TeamMatchRecord> {
  return apiGet<TeamMatchRecord>(`/api/v1/statistics/teams/${teamId}/match-record`)
}

/** GET /api/v1/statistics/teams/{teamId}/average-goals */
export async function getTeamAverageGoals(teamId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/teams/${teamId}/average-goals`)
}

/** GET /api/v1/statistics/teams/{teamId}/average-fouls */
export async function getTeamAverageFouls(teamId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/teams/${teamId}/average-fouls`)
}

/** GET /api/v1/statistics/teams/{teamId}/total-fouls */
export async function getTeamTotalFouls(teamId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/teams/${teamId}/total-fouls`)
}

/** GET /api/v1/statistics/teams/{teamId}/goals */
export async function getTeamGoals(teamId: string): Promise<PlayerStat> {
  return apiGet<PlayerStat>(`/api/v1/statistics/teams/${teamId}/goals`)
}

// ─── Tournament Statistics ──────────────────────────────────

/** GET /api/v1/statistics/tournaments/{tournamentId}/standings */
export async function getStandings(tournamentId: string): Promise<StandingsEntry[]> {
  return apiGet<StandingsEntry[]>(`/api/v1/statistics/tournaments/${tournamentId}/standings`)
}

/** GET /api/v1/statistics/tournaments/{tournamentId}/match-averages */
export async function getTournamentMatchAverages(tournamentId: string): Promise<TournamentMatchAverages> {
  return apiGet<TournamentMatchAverages>(
    `/api/v1/statistics/tournaments/${tournamentId}/match-averages`,
  )
}

/** GET /api/v1/statistics/tournaments/{tournamentId}/cards */
export async function getTournamentCards(tournamentId: string): Promise<number> {
  return apiGet<number>(`/api/v1/statistics/tournaments/${tournamentId}/cards`)
}

/** GET /api/v1/statistics/tournaments/{tournamentId}/recognitions */
export async function getTournamentRecognitions(tournamentId: string): Promise<Recognition[]> {
  return apiGet<Recognition[]>(`/api/v1/statistics/tournaments/${tournamentId}/recognitions`)
}

/** POST /api/v1/statistics/tournaments/{tournamentId}/recognitions */
export async function createRecognition(
  tournamentId: string,
  data: CreateRecognitionRequest,
): Promise<Recognition> {
  return apiPost<Recognition>(
    `/api/v1/statistics/tournaments/${tournamentId}/recognitions`,
    data,
  )
}

/** POST /api/v1/statistics/events */
export async function createEvent(eventData: Record<string, unknown>): Promise<{ id: string }> {
  return apiPost<{ id: string }>('/api/v1/statistics/events', eventData)
}

// ─── Match Statistics ───────────────────────────────────────

/** GET /api/v1/statistics/matches/{matchId}/result */
export async function getMatchResult(matchId: string): Promise<MatchResult> {
  return apiGet<MatchResult>(`/api/v1/statistics/matches/${matchId}/result`)
}

/** GET /api/v1/statistics/matches/{matchId}/cards */
export async function getMatchCards(matchId: string): Promise<MatchCards> {
  return apiGet<MatchCards>(`/api/v1/statistics/matches/${matchId}/cards`)
}
