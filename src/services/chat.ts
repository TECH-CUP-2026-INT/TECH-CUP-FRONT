/**
 * Chat — Service Layer
 *
 * Estrategia (patrón "tournament"):
 * 1. Intenta llamar al API real del Communications Service vía APIM
 * 2. Si falla, usa datos mock
 * 3. Update de cierre de chat y eliminación de mensajes
 */

import {
  getUserChats as apiGetUserChats,
  getChatMessages as apiGetChatMessages,
  sendMessage as apiSendMessage,
  createChat as apiCreateChat,
  addTeamChatParticipant as apiAddTeamChatParticipant,
  closeChatApi,
  deleteMessageApi,
  type Chat,
  type Message,
  type ChatType,
  type ParticipantRole,
} from '@/api/chat'

// ─── Module-level state ──────────────────────────────────────

let _chats: Chat[] = []

export function getChats(): Chat[] {
  return _chats
}

// ─── Service Functions (existents) ───────────────────────────

export async function fetchUserChats(userId: string): Promise<Chat[]> {
  try {
    const data = await apiGetUserChats(userId)
    _chats = data
    return data
  } catch (error) {
    console.warn('[chat] API getUserChats falló:', error)
    return []
  }
}

export async function fetchChatMessages(chatId: string, page = 0, size = 20) {
  try {
    return await apiGetChatMessages(chatId, page, size)
  } catch (error) {
    console.warn('[chat] API getChatMessages falló:', error)
    return { content: [], page, size, totalElements: 0, totalPages: 0 }
  }
}

export async function sendChatMessage(chatId: string, content: string): Promise<Message | null> {
  try {
    return await apiSendMessage(chatId, content)
  } catch (error) {
    console.warn('[chat] API sendMessage falló:', error)
    return null
  }
}

export async function crearChat(
  type: ChatType,
  teamId: string | null,
  participants: { userId: string; role: ParticipantRole }[],
): Promise<Chat | null> {
  try {
    return await apiCreateChat(type, teamId, participants)
  } catch (error) {
    console.warn('[chat] API createChat falló:', error)
    return null
  }
}

// ═══════════════════════════════════════════════════════════════
// CRUD NUEVO: Cerrar chat + Eliminar mensaje
// ═══════════════════════════════════════════════════════════════

/**
 * Cierra un chat.
 */
export async function cerrarChat(chatId: string): Promise<boolean> {
  try {
    const result = await closeChatApi(chatId)
    // Reflejar en estado local
    const idx = _chats.findIndex(c => c.id === chatId)
    if (idx >= 0) _chats[idx].status = 'CLOSED'
    return result.status === 'CLOSED'
  } catch (error) {
    console.warn('[chat] API closeChat falló:', error)
    // Fallback local
    const idx = _chats.findIndex(c => c.id === chatId)
    if (idx >= 0) {
      _chats[idx].status = 'CLOSED'
      return true
    }
    return false
  }
}

/**
 * Elimina un mensaje del chat.
 */
export async function eliminarMensaje(messageId: string): Promise<boolean> {
  try {
    await deleteMessageApi(messageId)
    return true
  } catch (error) {
    console.warn('[chat] API deleteMessage falló:', error)
    return false
  }
}
