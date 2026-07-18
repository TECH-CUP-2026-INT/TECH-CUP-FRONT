import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Client, IMessage, StompSubscription } from '@stomp/stompjs'
import Sidebar from '@/components/common/Sidebar'
import { Menu, Send } from 'lucide-react'
import { getMiPerfil, getPerfilPublico, type PerfilPublicoResponse } from '@/api/usuarios'
import { getUserChats, getChatMessages, sendMessage, type Chat as ChatDto, type Message } from '@/api/chat'
import { createChatSocket, subscribeToChat } from '@/api/ws'
import { getTeamName } from '@/utils/teamNameCache'
import { getInitialsAvatar } from '@/utils/avatar'
import {
  MANCHAS_BOT_AVATAR,
  MANCHAS_BOT_GREETINGS,
  isManchasBotMessage,
  cleanManchasBotMessage,
} from '@/utils/manchasbot'

function chatLabel(chat: ChatDto): string {
  if (chat.type === 'SUPPORT') return 'Soporte'
  if (chat.teamId) return getTeamName(chat.teamId) ?? 'Equipo'
  return 'Chat'
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const [myUserId, setMyUserId] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [chats, setChats] = useState<ChatDto[]>([])
  const [chatsLoading, setChatsLoading] = useState(true)
  const [chatsError, setChatsError] = useState<string | null>(null)
  const [chatsRetry, setChatsRetry] = useState(0)

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [messagesError, setMessagesError] = useState<string | null>(null)
  const [messagesRetry, setMessagesRetry] = useState(0)

  const [input, setInput] = useState('')
  const [sendError, setSendError] = useState<string | null>(null)

  const profileCache = useRef<Map<string, PerfilPublicoResponse>>(new Map())
  const sentBotGreeting = useRef<Set<string>>(new Set())
  const [, forceRerender] = useState(0)
  const stompClientRef = useRef<Client | null>(null)
  const subscriptionRef = useRef<StompSubscription | null>(null)

  const selectedChat = chats.find(c => c.id === selectedChatId)

  // 1. Quién soy — sin tocar useAuth, se resuelve llamando al perfil real.
  useEffect(() => {
    getMiPerfil()
      .then(perfil => setMyUserId(perfil.id))
      .catch(() => setProfileError('No pudimos cargar tu perfil.'))
  }, [])

  // 2. Mis chats (GROUP + SUPPORT) + conexión WS, una vez que sé quién soy.
  useEffect(() => {
    if (!myUserId) return

    setChatsLoading(true)
    setChatsError(null)
    getUserChats(myUserId)
      .then(all => {
        const filtered = all.filter(c => c.type === 'GROUP' || c.type === 'SUPPORT')
        setChats(filtered)
        if (filtered.length > 0) setSelectedChatId(filtered[0].id)
      })
      .catch(() => setChatsError('No pudimos cargar tus chats.'))
      .finally(() => setChatsLoading(false))

    const client = createChatSocket()
    client.activate()
    stompClientRef.current = client

    return () => {
      client.deactivate()
      stompClientRef.current = null
    }
  }, [myUserId, chatsRetry])

  // 3. Historial + suscripción en vivo del chat seleccionado.
  useEffect(() => {
    subscriptionRef.current?.unsubscribe()
    subscriptionRef.current = null
    setMessages([])

    if (!selectedChatId) return

    setMessagesLoading(true)
    setMessagesError(null)
    getChatMessages(selectedChatId)
      .then(page => {
        const msgs = page.content
        setMessages(msgs)
        resolveSenderProfiles(msgs)

        // ManchasBot saluda si el chat está vacío o no tiene mensaje suyo
        const hasBotMsg = msgs.some(m => isManchasBotMessage(m.content))
        if (
          !hasBotMsg &&
          !sentBotGreeting.current.has(selectedChatId)
        ) {
          sentBotGreeting.current.add(selectedChatId)
          const greeting =
            MANCHAS_BOT_GREETINGS[Math.floor(Math.random() * MANCHAS_BOT_GREETINGS.length)]
          sendMessage(selectedChatId, `🤖 *ManchasBot*: ${greeting}`)
            .then(() => {
              // Refrescar mensajes para que aparezca el saludo
              getChatMessages(selectedChatId).then(p2 => {
                setMessages(p2.content)
                resolveSenderProfiles(p2.content)
              })
            })
            .catch(() => {
              // Si falla, igual mostramos el mensaje localmente para que se vea
              const fakeBotMsg: Message = {
                id: `manchas-${Date.now()}`,
                chatId: selectedChatId,
                senderId: 'MANCHAS_BOT',
                content: `🤖 *ManchasBot*: ${greeting}`,
                status: 'SENT',
                sentAt: new Date().toISOString(),
              }
              setMessages(prev => [...prev, fakeBotMsg])
            })
        }
      })
      .catch(() => setMessagesError('No pudimos cargar los mensajes.'))
      .finally(() => setMessagesLoading(false))

    // Los chats SUPPORT broadcastean a /topic/support/{ticketId}, no a /topic/chat/{chatId};
    // ChatResponse no expone el ticketId, así que por ahora solo GROUP tiene tiempo real.
    if (selectedChat?.type !== 'GROUP') return

    const client = stompClientRef.current
    if (!client) return

    const subscribeNow = () => {
      subscriptionRef.current = subscribeToChat(client, selectedChatId, (msg: IMessage) => {
        const message: Message = JSON.parse(msg.body)
        setMessages(prev => [...prev, message])
        resolveSenderProfiles([message])
      })
    }

    if (client.connected) {
      subscribeNow()
    } else {
      client.onConnect = subscribeNow
    }

    return () => {
      subscriptionRef.current?.unsubscribe()
      subscriptionRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatId, messagesRetry])

  function resolveSenderProfiles(msgs: Message[]) {
    const unknown = [...new Set(msgs.map(m => m.senderId))].filter(
      id => id !== myUserId && !profileCache.current.has(id),
    )
    if (unknown.length === 0) return
    Promise.all(
      unknown.map(id =>
        getPerfilPublico(id)
          .then(perfil => profileCache.current.set(id, perfil))
          .catch(() => {}),
      ),
    ).then(() => forceRerender(n => n + 1))
  }

  async function handleSend() {
    if (!input.trim() || !selectedChatId) return
    setSendError(null)
    try {
      await sendMessage(selectedChatId, input.trim())
      setInput('')
    } catch {
      setSendError('No se pudo enviar el mensaje. Intentá de nuevo.')
    }
  }

  function senderName(senderId: string): string {
    if (senderId === myUserId) return 'Tú'
    return profileCache.current.get(senderId)?.nombreCompleto ?? 'Usuario'
  }

  function senderAvatar(senderId: string): string {
    return getInitialsAvatar(senderName(senderId))
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-mid/15 blur-[120px] pointer-events-none" />

      <div className="flex-1 flex flex-col h-screen relative z-10">
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 bg-black/85 backdrop-blur-md border-b border-border">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <div className="flex items-center gap-3">
            <button className="text-gray-light hover:text-gold transition-colors p-1" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            {selectedChat && (
              <div className="flex items-center gap-3 ml-1">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gold/60 ring-offset-2 ring-offset-black shadow-lg shadow-gold/20">
                  <img src={getInitialsAvatar(chatLabel(selectedChat))} alt="" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-[17px] font-bold">{chatLabel(selectedChat)}</h1>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gold/40 ring-offset-2 ring-offset-black hover:ring-gold transition-all cursor-pointer"
          >
            <img className="w-full h-full object-cover" src={getInitialsAvatar('Tú')} alt="" />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Lista de conversaciones */}
          <div className="w-full md:w-72 shrink-0 border-r border-white/5 overflow-y-auto hidden md:block">
            {profileError && <p className="p-4 text-sm text-red-400">{profileError}</p>}
            {chatsLoading && <p className="p-4 text-sm text-text-faint">Cargando chats…</p>}
            {chatsError && (
              <div className="p-4 text-sm text-red-400 space-y-2">
                <p>{chatsError}</p>
                <button className="text-gold underline" onClick={() => setChatsRetry(n => n + 1)}>Reintentar</button>
              </div>
            )}
            {!chatsLoading && !chatsError && chats.length === 0 && (
              <p className="p-4 text-sm text-text-faint">Todavía no tenés chats.</p>
            )}
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-white/5 transition-colors ${
                  chat.id === selectedChatId ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gold/40 shrink-0">
                  <img src={getInitialsAvatar(chatLabel(chat))} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm text-gray-light truncate">{chatLabel(chat)}</span>
              </button>
            ))}
          </div>

          {/* Mensajes */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
              {messagesLoading && <p className="text-sm text-text-faint">Cargando mensajes…</p>}
              {messagesError && (
                <div className="text-sm text-red-400 space-y-2">
                  <p>{messagesError}</p>
                  <button className="text-gold underline" onClick={() => setMessagesRetry(n => n + 1)}>
                    Reintentar
                  </button>
                </div>
              )}
              {!selectedChatId && !chatsLoading && chats.length > 0 && (
                <p className="text-sm text-text-faint">Elegí un chat para empezar.</p>
              )}
              {messages.map((msg) => {
                const isMe = msg.senderId === myUserId
                const isBot = isManchasBotMessage(msg.content)
                return (
                  <div key={msg.id} className={`flex items-end gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full overflow-hidden ring-2 shadow-lg ${
                        isBot
                          ? 'ring-gold/60 ring-offset-2 ring-offset-black'
                          : isMe
                            ? 'ring-purple-mid/60 ring-offset-2 ring-offset-black'
                            : 'ring-gold/40 ring-offset-2 ring-offset-black'
                      }`}>
                        <img
                          src={isBot ? MANCHAS_BOT_AVATAR : senderAvatar(msg.senderId)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="max-w-[75%] md:max-w-[60%]">
                      <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed backdrop-blur-md border ${
                        isMe
                          ? 'bg-purple-mid/15 border-purple-mid/20 rounded-br-md'
                          : 'bg-white/5 border-white/10 rounded-bl-md'
                      }`}>
                        <p className="text-gray-light">{isBot ? cleanManchasBotMessage(msg.content) : msg.content}</p>
                      </div>
                      <p className={`text-[10px] text-text-faint/60 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                        {isBot ? 'ManchasBot' : senderName(msg.senderId)} · {formatTime(msg.sentAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t border-white/5 bg-black/60 backdrop-blur-xl p-3 md:p-4">
              <div className="max-w-4xl mx-auto space-y-2">
                {sendError && <p className="text-xs text-red-400">{sendError}</p>}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-gold/40 focus-within:bg-white/10 transition-all">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribí un mensaje..."
                    disabled={!selectedChatId}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-text-faint text-sm px-2 py-2 disabled:opacity-50"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || !selectedChatId}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      input.trim() && selectedChatId
                        ? 'bg-gold text-[#1A1206] hover:bg-gold-dark shadow-lg shadow-gold/20'
                        : 'bg-white/5 text-text-faint'
                    }`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
