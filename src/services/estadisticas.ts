/**
 * Estadísticas — Service Layer
 *
 * Estrategia:
 * 1. Intenta obtener datos del API real del Statistics Service vía APIM
 * 2. Si el API no responde, usa datos mock
 * 3. El API devuelve solo IDs (teamId, playerId) — el service layer
 *    resuelve los nombres desde un lookup interno (reemplazable por API de teams/players en el futuro)
 */

import {
  getStandingsApi,
  getRankingsApi,
  getGoalkeeperRankingApi,
  getPlayerTotalGoalsApi,
  getPlayerTotalFoulsApi,
  getPlayerAssistsApi,
  getPlayerCardsApi,
  getPlayerMatchesPlayedApi,
  getPlayerAverageGoalsApi,
  getPlayerAverageFoulsApi,
  getPlayerAverageMinutesApi,
  getTournamentCardsApi,
  getMatchResultApi,
  getMatchCardsApi,
  getTeamStatisticsApi,
  getTeamGoalsApi,
  getTeamMatchRecordApi,
  getRecognitionsApi,
  type RankingTypeParam,
} from '@/api/estadisticas'
import type {
  StandingsDisplay,
  GoleadorDisplay,
  PorteroDisplay,
  FairPlayDisplay,
  PlayerStatsDisplay,
  TeamStatsDisplay,
  MatchStatDisplay,
} from '@/api/tipos'

// ─── Name Resolution (temporal — reemplazar con API de teams/players) ──

const TEAM_NAMES: Record<string, string> = {
  'team-tigres': 'Tigres FC',
  'team-sistemas': 'Sistemas FC',
  'team-warriors': 'IA Warriors',
  'team-code': 'Code United',
  'team-dragones': 'Dragones FC',
  'team-bits': 'Los Bits',
  'team-titanes': 'Titanes',
  'team-fenix': 'Fénix',
}

const PLAYER_NAMES: Record<string, string> = {
  'player-juan': 'Juan Pérez',
  'player-esteban': 'Esteban Quintero',
  'player-daniel': 'Daniel Castro',
  'player-laura': 'Laura Gómez',
  'player-pedro': 'Pedro Gómez',
  'player-miguel': 'Miguel Ángel',
  'player-carlos': 'Carlos Marín',
  'player-sofia': 'Sofía López',
}

const TEAM_BY_PLAYER: Record<string, string> = {
  'player-juan': 'Tigres FC',
  'player-esteban': 'IA Warriors',
  'player-daniel': 'Tigres FC',
  'player-laura': 'Tigres FC',
  'player-pedro': 'Sistemas FC',
  'player-miguel': 'Code United',
  'player-carlos': 'Sistemas FC',
  'player-sofia': 'Code United',
}

function resolveTeamName(id: string): string {
  return TEAM_NAMES[id] ?? id
}

function resolvePlayerName(id: string): string {
  return PLAYER_NAMES[id] ?? id
}

function resolvePlayerTeam(playerId: string): string {
  return TEAM_BY_PLAYER[playerId] ?? '—'
}

// ─── Mock fallback data ──────────────────────────────────────

const MOCK_STANDINGS: StandingsDisplay[] = [
  { pos: 1, teamId: 'team-tigres', equipo: 'Tigres FC',   pj: 12, g: 9, e: 2, p: 1, gf: 28, gc: 10, dg: 18, pts: 29, cambio: 'sube' },
  { pos: 2, teamId: 'team-sistemas', equipo: 'Sistemas FC', pj: 12, g: 8, e: 2, p: 2, gf: 22, gc: 10, dg: 12, pts: 26, cambio: 'igual' },
  { pos: 3, teamId: 'team-warriors', equipo: 'IA Warriors', pj: 12, g: 7, e: 3, p: 2, gf: 20, gc: 12, dg: 8, pts: 24, cambio: 'sube' },
  { pos: 4, teamId: 'team-code', equipo: 'Code United',    pj: 12, g: 6, e: 2, p: 4, gf: 18, gc: 14, dg: 4, pts: 20, cambio: 'baja' },
  { pos: 5, teamId: 'team-dragones', equipo: 'Dragones FC', pj: 12, g: 4, e: 3, p: 5, gf: 15, gc: 18, dg: -3, pts: 15, cambio: 'igual' },
  { pos: 6, teamId: 'team-bits', equipo: 'Los Bits',       pj: 12, g: 3, e: 2, p: 7, gf: 12, gc: 22, dg: -10, pts: 11, cambio: 'sube' },
  { pos: 7, teamId: 'team-titanes', equipo: 'Titanes',     pj: 12, g: 2, e: 1, p: 9, gf: 8, gc: 25, dg: -17, pts: 7, cambio: 'baja' },
  { pos: 8, teamId: 'team-fenix', equipo: 'Fénix',         pj: 12, g: 1, e: 1, p: 10, gf: 6, gc: 28, dg: -22, pts: 4, cambio: 'igual' },
]

const MOCK_GOLEADORES: GoleadorDisplay[] = [
  { pos: 1, playerId: 'player-juan', nombre: 'Juan Pérez', equipo: 'Tigres FC', goles: 8, asistencias: 3, partidos: 10 },
  { pos: 2, playerId: 'player-esteban', nombre: 'Esteban Quintero', equipo: 'IA Warriors', goles: 6, asistencias: 4, partidos: 11 },
  { pos: 3, playerId: 'player-daniel', nombre: 'Daniel Castro', equipo: 'Tigres FC', goles: 5, asistencias: 2, partidos: 9 },
  { pos: 4, playerId: 'player-laura', nombre: 'Laura Gómez', equipo: 'Tigres FC', goles: 5, asistencias: 5, partidos: 12 },
  { pos: 5, playerId: 'player-pedro', nombre: 'Pedro Gómez', equipo: 'Sistemas FC', goles: 4, asistencias: 6, partidos: 12 },
  { pos: 6, playerId: 'player-miguel', nombre: 'Miguel Ángel', equipo: 'Code United', goles: 4, asistencias: 2, partidos: 10 },
  { pos: 7, playerId: 'player-carlos', nombre: 'Carlos Marín', equipo: 'Sistemas FC', goles: 3, asistencias: 4, partidos: 11 },
  { pos: 8, playerId: 'player-sofia', nombre: 'Sofía López', equipo: 'Code United', goles: 3, asistencias: 3, partidos: 10 },
]

const MOCK_PORTEROS: PorteroDisplay[] = [
  { pos: 1, playerId: 'player-luis', nombre: 'Luis Torres', equipo: 'Sistemas FC', golesRecibidos: 10, partidos: 12, vallasInvictas: 5 },
  { pos: 2, playerId: 'player-carlos-m', nombre: 'Carlos Martínez', equipo: 'Tigres FC', golesRecibidos: 10, partidos: 12, vallasInvictas: 4 },
  { pos: 3, playerId: 'player-andres', nombre: 'Andrés Ramírez', equipo: 'IA Warriors', golesRecibidos: 12, partidos: 12, vallasInvictas: 3 },
  { pos: 4, playerId: 'player-felipe', nombre: 'Felipe Rojas', equipo: 'Code United', golesRecibidos: 14, partidos: 12, vallasInvictas: 3 },
  { pos: 5, playerId: 'player-david', nombre: 'David Ocampo', equipo: 'IA Warriors', golesRecibidos: 18, partidos: 11, vallasInvictas: 2 },
]

const MOCK_FAIRPLAY: FairPlayDisplay[] = [
  { pos: 1, equipo: 'Sistemas FC', amarillas: 8, rojas: 0, puntos: 8 },
  { pos: 2, equipo: 'Code United', amarillas: 10, rojas: 0, puntos: 10 },
  { pos: 3, equipo: 'Tigres FC', amarillas: 10, rojas: 1, puntos: 13 },
  { pos: 4, equipo: 'IA Warriors', amarillas: 12, rojas: 1, puntos: 15 },
  { pos: 5, equipo: 'Dragones FC', amarillas: 14, rojas: 1, puntos: 17 },
  { pos: 6, equipo: 'Los Bits', amarillas: 15, rojas: 2, puntos: 21 },
  { pos: 7, equipo: 'Titanes', amarillas: 18, rojas: 2, puntos: 24 },
  { pos: 8, equipo: 'Fénix', amarillas: 20, rojas: 3, puntos: 29 },
]

const MOCK_PLAYER_STATS: PlayerStatsDisplay = {
  goles: 8,
  asistencias: 5,
  tarjetas: 2,
  faltas: 3,
  partidos: 12,
  minutos: 480,
  avgGoles: 0.67,
  avgAsistencias: 0.42,
  avgFaltas: 0.25,
}

// ─── Helpers ─────────────────────────────────────────────────

function mapStandings(
  apiStandings: import('@/api/estadisticas').ApiTeamStatistics[]
): StandingsDisplay[] {
  return apiStandings.map((s, i) => ({
    pos: i + 1,
    teamId: s.teamId,
    equipo: resolveTeamName(s.teamId),
    pj: s.matchesPlayed,
    g: s.wins,
    e: s.draws,
    p: s.losses,
    gf: s.goalsFor,
    gc: s.goalsAgainst,
    dg: s.goalDifference,
    pts: s.points,
  }))
}

function mapRankingToGoleadores(
  entries: import('@/api/estadisticas').ApiRankingEntry[]
): GoleadorDisplay[] {
  return entries.map((e) => ({
    pos: e.position,
    playerId: e.playerId,
    nombre: resolvePlayerName(e.playerId),
    equipo: resolvePlayerTeam(e.playerId),
    goles: e.value,
    asistencias: 0, // el ranking API no incluye asistencias
    partidos: 0,    // idem
  }))
}

function mapGoalkeepers(
  entries: import('@/api/estadisticas').ApiGoalkeeperEntry[]
): PorteroDisplay[] {
  return entries.map((e) => ({
    pos: e.position,
    playerId: e.playerId,
    nombre: resolvePlayerName(e.playerId),
    equipo: resolvePlayerTeam(e.playerId),
    golesRecibidos: e.goalsConceded,
    partidos: 0,
    vallasInvictas: 0,
  }))
}

// ─── Service Functions ───────────────────────────────────────

/**
 * Tabla de posiciones de un torneo.
 * Si el API no responde, devuelve datos mock.
 */
export async function fetchStandings(
  tournamentId?: string
): Promise<StandingsDisplay[]> {
  try {
    const effectiveId = tournamentId || 'current'
    const res = await getStandingsApi(effectiveId)
    return mapStandings(res.standings)
  } catch (error) {
    console.warn('[estadisticas] API standings falló, usando mock:', error)
    return [...MOCK_STANDINGS]
  }
}

/**
 * Ranking de goleadores.
 */
export async function fetchTopScorers(
  limit = 10,
  tournamentId?: string
): Promise<GoleadorDisplay[]> {
  try {
    const res = await getRankingsApi('GOALS', limit, tournamentId)
    return mapRankingToGoleadores(res.entries)
  } catch (error) {
    console.warn('[estadisticas] API goleadores falló, usando mock:', error)
    return [...MOCK_GOLEADORES]
  }
}

/**
 * Ranking de arqueros (valla menos vencida).
 */
export async function fetchGoalkeeperRanking(
  limit = 10,
  tournamentId?: string
): Promise<PorteroDisplay[]> {
  try {
    const res = await getGoalkeeperRankingApi(limit, tournamentId)
    return mapGoalkeepers(res.entries)
  } catch (error) {
    console.warn('[estadisticas] API arqueros falló, usando mock:', error)
    return [...MOCK_PORTEROS]
  }
}

/**
 * Tabla de fair play (basado en tarjetas del torneo).
 * El API devuelve total de tarjetas — calculamos puntos (🟨=1, 🟥=3).
 */
export async function fetchFairPlay(
  tournamentId?: string
): Promise<FairPlayDisplay[]> {
  try {
    const effectiveId = tournamentId || 'current'
    const cards = await getTournamentCardsApi(effectiveId)

    // El API devuelve total del torneo, no por equipo.
    // Para fair play por equipo necesitamos datos más granulares.
    // Por ahora devolvemos mock hasta que el API exponga por-equipo.
    console.warn('[estadisticas] Fair play por-equipo no disponible via API, usando mock')
    return [...MOCK_FAIRPLAY]
  } catch (error) {
    console.warn('[estadisticas] API fair play falló, usando mock:', error)
    return [...MOCK_FAIRPLAY]
  }
}

/**
 * Estadísticas completas de un jugador.
 * Hace múltiples llamadas en paralelo para armar el perfil.
 */
export async function fetchPlayerStats(
  playerId: string,
  tournamentId?: string
): Promise<PlayerStatsDisplay> {
  try {
    const [goals, fouls, assists, cards, matches, avgGoals, avgFouls, avgMinutes] =
      await Promise.allSettled([
        getPlayerTotalGoalsApi(playerId, tournamentId),
        getPlayerTotalFoulsApi(playerId, tournamentId),
        getPlayerAssistsApi(playerId, tournamentId),
        getPlayerCardsApi(playerId, tournamentId),
        getPlayerMatchesPlayedApi(playerId, tournamentId),
        getPlayerAverageGoalsApi(playerId, tournamentId),
        getPlayerAverageFoulsApi(playerId, tournamentId),
        getPlayerAverageMinutesApi(playerId, tournamentId),
      ])

    return {
      goles:     goals.status === 'fulfilled' ? goals.value.total : 0,
      faltas:    fouls.status === 'fulfilled' ? fouls.value.total : 0,
      asistencias: assists.status === 'fulfilled' ? assists.value.total : 0,
      tarjetas:  cards.status === 'fulfilled' ? cards.value.yellowCards + cards.value.redCards : 0,
      partidos:  matches.status === 'fulfilled' ? matches.value.matchesPlayed : 0,
      minutos:   0, // el API no da minutos totales directo; avgMinutes es promedio
      avgGoles:  avgGoals.status === 'fulfilled' ? avgGoals.value.value : 0,
      avgAsistencias: 0,
      avgFaltas: avgFouls.status === 'fulfilled' ? avgFouls.value.value : 0,
    }
  } catch {
    console.warn('[estadisticas] API player stats falló, usando mock')
    return { ...MOCK_PLAYER_STATS }
  }
}

/**
 * Estadísticas de un equipo.
 */
export async function fetchTeamStats(
  teamId: string,
  tournamentId?: string
): Promise<TeamStatsDisplay> {
  try {
    const stats = await getTeamStatisticsApi(teamId, tournamentId)
    return {
      matchesPlayed: stats.matchesPlayed,
      wins: stats.wins,
      draws: stats.draws,
      losses: stats.losses,
      goalsFor: stats.goalsFor,
      goalsAgainst: stats.goalsAgainst,
      goalDifference: stats.goalDifference,
      points: stats.points,
    }
  } catch (error) {
    console.warn('[estadisticas] API team stats falló, usando mock:', error)
    return { matchesPlayed: 12, wins: 8, draws: 2, losses: 2, goalsFor: 22, goalsAgainst: 10, goalDifference: 12, points: 26 }
  }
}

/**
 * Estadísticas comparativas de un partido (para la tab "Estadísticas" del MatchDetail).
 */
export async function fetchMatchStats(
  matchId: string,
  homeTeamId?: string,
  awayTeamId?: string
): Promise<MatchStatDisplay[]> {
  try {
    const [result, cards] = await Promise.all([
      getMatchResultApi(matchId),
      getMatchCardsApi(matchId),
    ])

    // Inferimos local/visitante del resultado
    const homeResult = result.teamResults[0]
    const awayResult = result.teamResults[1]
    const homeWon = homeResult?.result === 'WON' ? 1 : 0
    const awayWon = awayResult?.result === 'WON' ? 1 : 0
    const isDraw = homeResult?.result === 'DRAWN' ? 1 : 0

    return [
      { label: 'Partidos jugados', local: '—', visitor: '—' },
      { label: 'Resultado', local: homeWon, visitor: awayWon },
      { label: 'Empates', local: isDraw, visitor: isDraw },
      { label: 'Tarjetas amarillas', local: cards.yellowCards, visitor: 0 },
      { label: 'Tarjetas rojas', local: cards.redCards, visitor: 0 },
    ]
  } catch (error) {
    console.warn('[estadisticas] API match stats falló, usando mock:', error)
    return [
      { label: 'Partidos jugados', local: '5', visitor: '5' },
      { label: 'Goles a favor', local: '12', visitor: '8' },
      { label: 'Goles en contra', local: '3', visitor: '7' },
      { label: 'Tarjetas amarillas', local: '4', visitor: '6' },
      { label: 'Tarjetas rojas', local: '0', visitor: '1' },
    ]
  }
}
