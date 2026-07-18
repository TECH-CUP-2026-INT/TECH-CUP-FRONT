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
}

// ─── Partidos (mock hasta que Matches Service esté disponible) ──
export interface Partido {
  dia: number
  mes: string
  eq1: string
  eq2: string
  hora: string
  lugar: string
}

export interface Posicion {
  pos: number
  equipo: string
  pj: number
  dg: number
  pts: number
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
