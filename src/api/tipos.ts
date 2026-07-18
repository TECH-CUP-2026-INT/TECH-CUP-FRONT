// ─── Equipos ────────────────────────────────────────────────
export interface Team {
  id: string
  name: string
  colors: string // string libre, ej "#FF0000,#FFFFFF" — CreateTeamRequest.colors es String
  captainId: string
  memberCount: number
  createdAt: string
  updatedAt: string
}

// ─── Torneos ────────────────────────────────────────────────
export type EstadoTorneo = 'live' | 'upcoming' | 'closed'
export type Categoria = 'Fútbol 11' | 'Futsal'

export interface Torneo {
  id: string
  nombre: string
  estado: EstadoTorneo
  semestre: string
  categoria: Categoria
  equipos: number
  jugadores: number
  canchas: number
  fecha: string
  tag: string
  sub?: string
  imagen?: string
}

// ─── Partidos ──────────────────────────────────────────────────
export type MatchStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED'

export interface Partido {
  id: string
  dia: number
  mes: string
  eq1: string
  eq2: string
  hora: string
  lugar: string
  homeScore?: number
  awayScore?: number
  status?: MatchStatus
  homeTeamId?: string
  awayTeamId?: string
}

export interface Posicion {
  pos: number
  equipo: string
  pj: number
  dg: number
  pts: number
}

// ─── API types para Matches Service ─────────────────────────────
export interface MatchSummaryAPI {
  id: string
  competenciaMatchId: string
  homeTeamName: string
  awayTeamName: string
  status: MatchStatus
  manageable: boolean
  homeScore: number
  awayScore: number
}

export interface MatchDetailAPI {
  id: string
  competenciaMatchId: string
  tournamentId: string
  phase: string
  homeTeamId: string
  awayTeamId: string
  homeTeamName: string
  awayTeamName: string
  refereeId: string
  status: MatchStatus
  currentPeriod: string
  homeScore: number
  awayScore: number
  addedMinutesFirstHalf: number
  addedMinutesSecondHalf: number
  currentMinute: number
  startedAt: string
  endedAt: string
}

export interface CreateMatchRequest {
  tournamentId: string
  homeTeamId: string
  awayTeamId: string
  scheduledDate: string
  venue: string
}

export interface CreateMatchResponse {
  id: string
  homeTeamName: string
  awayTeamName: string
  tournamentId: string
  scheduledDate: string
  status: string
  message: string
}

// ─── Rankings ────────────────────────────────────────────────
export type RankingType = 'GOALS' | 'WINS' | 'FOULS' | 'MINUTES'

export interface RankingEntry {
  position: number
  playerId: string
  playerName: string
  teamName: string
  value: number
}

export interface GoalkeeperRankingEntry {
  position: number
  playerId: string
  playerName: string
  teamName: string
  saves: number
  cleanSheets: number
}

// ─── Player Statistics ──────────────────────────────────────
export interface PlayerStat {
  playerId: string
  value: number
}

export interface PlayerCards {
  yellow: number
  red: number
  total: number
}

// ─── Team Statistics ────────────────────────────────────────
export interface TeamStatistics {
  teamId: string
  teamName: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
}

export interface TeamMatchRecord {
  wins: number
  draws: number
  losses: number
  total: number
}

// ─── Tournament Statistics ──────────────────────────────────
export interface StandingsEntry {
  position: number
  teamId: string
  teamName: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface TournamentMatchAverages {
  averageGoals: number
  averageFouls: number
  averageCards: number
  totalMatches: number
}

export interface Recognition {
  id: string
  playerId: string
  playerName: string
  type: string
  description: string
  date: string
}

// ─── Match Statistics ───────────────────────────────────────
export interface MatchResult {
  homeTeam: string
  awayTeam: string
  homeGoals: number
  awayGoals: number
  status: 'scheduled' | 'live' | 'finished'
}

export interface MatchCards {
  homeTeam: { player: string; card: 'yellow' | 'red'; minute: number }[]
  awayTeam: { player: string; card: 'yellow' | 'red'; minute: number }[]
}

// ─── Events ─────────────────────────────────────────────────
export interface CreateEventRequest {
  matchId: string
  eventType: string
  refereeId: string
  occurredAt: string
  details?: Record<string, unknown>
}

export interface CreateRecognitionRequest {
  playerId: string
  type: string
  description: string
}

// =================================================================
// Tipos para servicio de Estadísticas (Statistics Service)
// =================================================================

export interface StandingsDisplay {
  pos: number
  teamId: string
  equipo: string
  pj: number
  g: number
  e: number
  p: number
  gf: number
  gc: number
  dg: number
  pts: number
  cambio?: 'sube' | 'baja' | 'igual'
}

export interface GoleadorDisplay {
  pos: number
  playerId: string
  nombre: string
  equipo: string
  goles: number
  asistencias: number
  partidos: number
}

export interface PorteroDisplay {
  pos: number
  playerId: string
  nombre: string
  equipo: string
  golesRecibidos: number
  partidos: number
  vallasInvictas: number
}

export interface FairPlayDisplay {
  pos: number
  equipo: string
  amarillas: number
  rojas: number
  puntos: number
}

export interface PlayerStatsDisplay {
  goles: number
  asistencias: number
  tarjetas: number
  faltas: number
  partidos: number
  minutos: number
  avgGoles: number
  avgAsistencias: number
  avgFaltas: number
}

export interface TeamStatsDisplay {
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export interface MatchStatDisplay {
  label: string
  local: number | string
  visitor: number | string
}
