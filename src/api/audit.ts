/**
 * Audit Service (ga-audit-service) — API Client
 *
 * Central audit event registry for the TechCup ecosystem.
 * Receives and queries match events (goals, cards, substitutions, etc.)
 * as well as generic domain events from all other microservices.
 *
 * APIM path: /audit (prefix) + /api/v1/audit/events (service path)
 *
 * Source: openapi.yaml (ga-audit-service v1.0.0)
 */

import { apiGet, apiPost } from './client'

// ─── APIM base path ───────────────────────────────────────────
const AUDIT_PATH = '/audit/api/v1/audit'

// ─── Enums ────────────────────────────────────────────────────

export type MatchEventType =
  | 'MATCH_STARTED'
  | 'MATCH_PAUSED'
  | 'MATCH_RESUMED'
  | 'MATCH_FINISHED'
  | 'GOAL_SCORED'
  | 'CARD_ISSUED'
  | 'SUBSTITUTION_MADE'
  | 'GENERIC'

// ─── Request types ────────────────────────────────────────────

export interface RegisterMatchEventRequest {
  matchId: string
  eventType: MatchEventType
  refereeId: string
  occurredAt: string
  details?: {
    minute?: number
    playerId?: string
    teamId?: string
    [k: string]: unknown
  }
}

export interface IngestEventRequest {
  source: string
  eventType: string
  occurredAt: string
  actorId?: string
  entityId?: string
  detail?: string
  raw?: Record<string, unknown>
}

// ─── Response types ───────────────────────────────────────────

export interface AuditEventResponse {
  id: string
  matchId: string
  eventType: MatchEventType
  refereeId: string
  occurredAt: string
  details?: {
    minute?: number
    playerId?: string
    teamId?: string
    [k: string]: unknown
  }
}

export interface AuditEventIngestResponse {
  eventId: string
  message: string
}

// ─── Query params for listEvents ──────────────────────────────

export interface ListAuditEventsParams {
  matchId?: string
  eventType?: MatchEventType
  refereeId?: string
  from?: string
  to?: string
}

// ─── API functions ────────────────────────────────────────────

/**
 * List audit events with optional filters.
 * GET /api/v1/audit/events?matchId=&eventType=&refereeId=&from=&to=
 */
export async function listAuditEventsApi(
  params?: ListAuditEventsParams,
): Promise<AuditEventResponse[]> {
  const query: Record<string, string> = {}
  if (params?.matchId) query.matchId = params.matchId
  if (params?.eventType) query.eventType = params.eventType
  if (params?.refereeId) query.refereeId = params.refereeId
  if (params?.from) query.from = params.from
  if (params?.to) query.to = params.to
  return apiGet<AuditEventResponse[]>(`${AUDIT_PATH}/events`, {
    params: query,
  })
}

/**
 * Get a specific audit event by ID.
 * GET /api/v1/audit/events/{id}
 */
export async function getAuditEventApi(id: string): Promise<AuditEventResponse> {
  return apiGet<AuditEventResponse>(`${AUDIT_PATH}/events/${id}`)
}

/**
 * Register a match event (goals, cards, substitutions, etc.).
 * Only accepts the canonical MatchEventType enum.
 * POST /api/v1/audit/events
 */
export async function registerMatchEventApi(
  body: RegisterMatchEventRequest,
): Promise<AuditEventResponse> {
  return apiPost<AuditEventResponse>(`${AUDIT_PATH}/events`, body)
}

/**
 * Ingest a generic audit event from any service.
 * Flexible endpoint for non-match domains (identity, teams, tournament, etc.).
 * POST /api/v1/audit/ingest
 */
export async function ingestEventApi(
  body: IngestEventRequest,
): Promise<AuditEventIngestResponse> {
  return apiPost<AuditEventIngestResponse>(`${AUDIT_PATH}/ingest`, body)
}
