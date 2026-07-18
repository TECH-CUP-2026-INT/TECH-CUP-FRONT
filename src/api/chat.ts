import { apiGet, apiPost, CHAT_SERVICE_PREFIX } from './client'

export type ChatType = 'DIRECT' | 'GROUP' | 'SUPPORT'
export type ChatStatus = 'OPEN' | 'CLOSED'
export type ParticipantRole = 'MEMBER' | 'MODERATOR' | 'ORGANIZER'

export interface Participant {
  id: string
  userId: string
  role: ParticipantRole
  joinedAt: string
}

export interface Chat {
  id: string
  type: ChatType
  teamId: string | null
  status: ChatStatus
  participants: Participant[]
  createdAt: string
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  status: string
  sentAt: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

/** Lista todos los chats en los que participa un usuario (GROUP, DIRECT y SUPPORT mezclados). */
export function getUserChats(userId: string): Promise<Chat[]> {
  return apiGet<Chat[]>(`${CHAT_SERVICE_PREFIX}/users/${userId}/chats`)
}

/** Historial paginado de mensajes de un chat, ordenado de más viejo a más nuevo. */
export function getChatMessages(
  chatId: string,
  page = 0,
  size = 20,
): Promise<PageResponse<Message>> {
  return apiGet<PageResponse<Message>>(`${CHAT_SERVICE_PREFIX}/chats/${chatId}/messages`, {
    params: { page, size },
  })
}

/** Envía un mensaje por REST — la entrega en vivo llega vía WebSocket para todos los participantes. */
export function sendMessage(chatId: string, content: string): Promise<Message> {
  return apiPost<Message>(`${CHAT_SERVICE_PREFIX}/messages`, { chatId, content })
}

/** Crea un chat nuevo (usado al crear un equipo, para su chat GROUP). */
export function createChat(
  type: ChatType,
  teamId: string | null,
  participants: { userId: string; role: ParticipantRole }[],
): Promise<Chat> {
  return apiPost<Chat>(`${CHAT_SERVICE_PREFIX}/chats`, { type, teamId, participants })
}

/**
 * Suma al caller como participante del chat GROUP de un equipo, resuelto por teamId (no por
 * chatId) — pensado para alguien que recién se unió al equipo y todavía no conoce el chat.
 */
export function addTeamChatParticipant(
  teamId: string,
  userId: string,
  role: ParticipantRole,
): Promise<Chat> {
  return apiPost<Chat>(`${CHAT_SERVICE_PREFIX}/chats/team/${teamId}/participants`, {
    userId,
    role,
  })
}
