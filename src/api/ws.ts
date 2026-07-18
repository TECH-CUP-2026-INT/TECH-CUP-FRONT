import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import { JWT_STORAGE_KEY } from './client'

// Uses VITE_COMM_WS_URL to match .env naming. Falls back to localhost only in dev.
const WS_URL = import.meta.env.VITE_COMM_WS_URL || 'ws://localhost:5628/ws'

/**
 * Cliente STOMP crudo (sin SockJS) — el endpoint del backend es WebSocket plano
 * (registry.addEndpoint("/ws") sin .withSockJS()).
 */
export function createChatSocket(): Client {
  const token = localStorage.getItem(JWT_STORAGE_KEY)
  return new Client({
    brokerURL: WS_URL,
    connectHeaders: { Authorization: `Bearer ${token ?? ''}` },
    reconnectDelay: 5000,
  })
}

/** Se suscribe al topic de un chat. Devuelve la suscripción para poder cancelarla al cambiar de chat. */
export function subscribeToChat(
  client: Client,
  chatId: string,
  onMessage: (msg: IMessage) => void,
): StompSubscription {
  return client.subscribe(`/topic/chat/${chatId}`, onMessage)
}
