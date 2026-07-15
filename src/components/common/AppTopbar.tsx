import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Send, Paperclip, X, Search, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { useAuth } from '@/hooks/auth/useAuth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu'

interface AppTopbarProps {
  title: string
  sidebarOpen?: boolean
  sidebarCollapsed?: boolean
  onMenuClick: () => void
}

const conversations = [
  { id: 1, name: 'Tigres FC', avatar: 'https://i.pravatar.cc/72?img=11', lastMsg: '¿A qué hora es el partido?', unread: 2, online: true, isTeam: true },
  { id: 2, name: 'Sistemas FC', avatar: 'https://i.pravatar.cc/72?img=8', lastMsg: 'Entrenamiento mañana 7AM', unread: 0, online: false, isTeam: true },
  { id: 3, name: 'ManchasBot', avatar: '/manchas-callcenter.png', lastMsg: '¡Hola! ¿En qué puedo ayudarte?', unread: 0, online: true, isSoporte: true },
]

const messages: Record<number, { text: string; me: boolean }[]> = {
  1: [{ text: '¿Listos para el partido de mañana?', me: false }, { text: '¡Sí! Todos confirmados 💪', me: true }, { text: 'Yo llego temprano a calentar', me: false }, { text: 'Perfecto, nos vemos a las 7PM', me: true }],
  2: [{ text: '¡Hola! Soy ManchasBot 🤖 ¿En qué puedo ayudarte?', me: false }, { text: '¿Cómo me inscribo en un torneo?', me: true }, { text: 'Para inscribirte, tu capitán debe completar el registro del equipo y cargar el comprobante de pago. El organizador revisa y aprueba la inscripción.', me: false }],
}

export default function AppTopbar({ title, sidebarOpen, sidebarCollapsed, onMenuClick }: AppTopbarProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [chatOpen, setChatOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifSettings, setNotifSettings] = useState(false)
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [input, setInput] = useState('')
  const [notifTeams, setNotifTeams] = useState<Record<string, boolean>>({ 'Tigres FC': true, 'Sistemas FC': true, 'Code United': false, 'IA Warriors': false, 'Dragones FC': false, 'Los Bits': false })
  const activeConv = conversations.find(c => c.id === selectedChat)

  const greeting = useMemo(() => {
    const stored = localStorage.getItem('techcup_user')
    const storedUser = stored ? JSON.parse(stored) : null
    const name = user?.name?.split(' ')[0] || storedUser?.name?.split(' ')[0] || ''
    return name ? `Hola, ${name} 👋` : `Hola 👋`
  }, [user])

  const handleSend = () => {
    if (!input.trim()) return
    setInput('')
  }

  return (
    <>
      <div className="h-[64px]" /> {/* spacer para fixed header */}
      <header className="fixed top-0 z-50 flex items-center justify-between px-8 py-[18px] bg-[#2F1350] dark:bg-[#100D1E] border-b border-white/10 max-md:px-4 transition-all duration-300 right-0"
        style={{ left: sidebarOpen ? (sidebarCollapsed ? '72px' : '260px') : '0px' }}>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-mid/60 to-transparent" />
        
        <div className="flex items-center gap-3">
          <button className="text-white p-1.5 hover:text-gold transition-colors" onClick={onMenuClick} aria-label="Menú">
            <Menu size={22} />
          </button>
          <h1 className="text-[17px] font-bold">{title}</h1>
        </div>

        <div className="flex items-center gap-[18px]">
          <span className="text-[14px] text-text-muted font-medium hidden md:block">{greeting}</span>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`relative p-1.5 rounded-lg transition-all ${
              chatOpen
                ? 'bg-purple-mid text-white border border-purple-mid'
                : 'bg-transparent text-gray-light border border-transparent hover:border-purple-mid/40 hover:bg-purple-mid/10'
            }`}
            aria-label="Chat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={chatOpen ? "white" : "none"} stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>
          </button>

          <button onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) setChatOpen(false); }}
            className={`relative p-1.5 rounded-lg transition-all ${
              notifOpen
                ? 'bg-purple-mid text-white border border-purple-mid'
                : 'bg-transparent text-gray-light border border-transparent hover:border-purple-mid/40 hover:bg-purple-mid/10'
            }`} aria-label="Notificaciones">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={notifOpen ? "white" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/></svg>
            <span className="absolute -top-[5px] -right-[7px] bg-purple-mid text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-black">3</span>
          </button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gold/40 ring-offset-2 ring-offset-black hover:ring-gold transition-all cursor-pointer">
                <img className="w-full h-full object-cover" src="https://i.pravatar.cc/72?img=13" alt="" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 border-border bg-surface text-gray-light rounded-2xl p-1.5 mt-2">
              <div className="flex items-center gap-3 px-3 pt-3 pb-3">
                <img className="w-10 h-10 rounded-full object-cover ring-2 ring-gold/60" src="https://i.pravatar.cc/72?img=13" alt="" />
                <div className="leading-tight">
                  <p className="text-sm font-bold">Juan Camilo Rivera</p>
                  <p className="text-xs text-text-muted">Estudiante · Ing. Sistemas</p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer text-sm font-semibold focus:bg-purple-mid/20 focus:text-purple-mid" onClick={() => navigate('/perfil')}>👤 Mi perfil</DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer text-sm font-semibold focus:bg-purple-mid/20 focus:text-purple-mid" onClick={() => navigate('/configuracion')}>⚙️ Configuración</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="rounded-xl py-2.5 cursor-pointer text-sm text-red-400 focus:bg-red-500/10 focus:text-red-400" onClick={() => navigate('/')}>🚪 Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Notificaciones — slide-in derecho como el chat */}
      <AnimatePresence>
        {notifOpen && (
          <>
            <div className="fixed inset-0 z-[65]" onClick={() => setNotifOpen(false)} />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-[380px] max-w-[90vw] bg-[#1e0d33] border-l border-white/10 flex flex-col"
            >
              {!notifSettings ? (
                /* ─── Lista de notificaciones ─── */
                <>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h2 className="text-sm font-bold flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/></svg>
                      Notificaciones
                    </h2>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setNotifSettings(true)} className="text-gray-light hover:text-gold transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Configurar notificaciones">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                      </button>
                      <button onClick={() => setNotifOpen(false)} className="text-gray-light hover:text-red-400 transition-colors p-1"><X size={18} /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {[
                      { title: 'Partido en 2 horas', desc: 'Tigres FC vs IA Warriors — Cancha Principal', time: 'Hace 5 min', color: '#22C55E' },
                      { title: 'Inscripción aprobada', desc: 'TechCup 2026-II — Ya estás inscrito', time: 'Hace 1 hora', color: '#8B5CF6' },
                      { title: 'Nuevo mensaje de Tigres FC', desc: 'Nos vemos en la cancha mañana', time: 'Hace 3 horas', color: '#3B82F6' },
                      { title: 'Recordatorio de pago', desc: 'Tienes un pago pendiente por $20.000', time: 'Ayer', color: '#F59E0B' },
                      { title: 'Cambio de horario', desc: 'Partido Sistemas FC vs Code United movido a las 9PM', time: 'Ayer', color: '#EF4444' },
                    ].map((n, i) => (
                      <button key={i} className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-white/5 transition-colors text-left border-b border-white/5">
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.color }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{n.title}</p>
                          <p className="text-xs text-text-muted mt-0.5">{n.desc}</p>
                          <p className="text-[10px] text-text-faint mt-1">{n.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-5 py-3 text-center border-t border-white/5">
                    <p className="text-xs text-text-muted">— No hay más notificaciones —</p>
                  </div>
                </>
              ) : (
                /* ─── Configuración de notificaciones ─── */
                <>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setNotifSettings(false)} className="text-gray-light hover:text-gold transition-colors p-1">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                      </button>
                      <h2 className="text-sm font-bold">Config. notificaciones</h2>
                    </div>
                    <button onClick={() => setNotifOpen(false)} className="text-gray-light hover:text-red-400 transition-colors p-1"><X size={18} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Notificarme cuando juegue...</h3>
                      <div className="space-y-2">
                        {Object.entries(notifTeams).map(([team, enabled]) => (
                          <label key={team} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                            <span className="text-sm font-medium text-white">{team}</span>
                            <button
                              onClick={() => setNotifTeams(prev => ({ ...prev, [team]: !prev[team] }))}
                              className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-purple-mid' : 'bg-white/10'}`}
                            >
                              <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">General</h3>
                      <div className="space-y-2">
                        {[
                          { label: 'Resultados de partidos', key: 'resultados' },
                          { label: 'Cambios de horario', key: 'horarios' },
                          { label: 'Inscripciones', key: 'inscripciones' },
                          { label: 'Mensajes del equipo', key: 'mensajes' },
                        ].map(item => (
                          <label key={item.key} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                            <span className="text-sm font-medium text-white">{item.label}</span>
                            <div className="relative w-10 h-5 rounded-full bg-purple-mid">
                              <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white translate-x-5" />
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <div className="fixed inset-0 z-[65] bg-black/40 backdrop-blur-sm" onClick={() => setChatOpen(false)} />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-[70] w-[380px] max-w-[90vw] bg-[#1e0d33] border-l border-white/10 flex flex-col shadow-2xl shadow-black/50"
            >
              {!selectedChat ? (
                /* Lista de conversaciones */
                <>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h2 className="text-sm font-bold flex items-center gap-2">
                      <img src="https://i.pravatar.cc/72?img=13" alt="" className="w-6 h-6 rounded-full ring-2 ring-gold/40" />
                      Mensajes
                    </h2>
                    <button onClick={() => setChatOpen(false)} className="text-gray-light hover:text-red-400 transition-colors p-1"><X size={18} /></button>
                  </div>
                  <div className="px-4 py-2 border-b border-border">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                      <Search size={14} className="text-text-faint" />
                      <input placeholder="Buscar equipo o chat..." className="bg-transparent border-none outline-none text-white placeholder:text-text-faint text-sm w-full" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                      <button key={conv.id} onClick={() => setSelectedChat(conv.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-border/50 text-left">
                        <div className="relative flex-shrink-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gold/30"><img src={conv.avatar} alt="" className="w-full h-full object-cover" /></div>
                          {conv.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-black" />}
                          {conv.isTeam && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold flex items-center justify-center ring-1 ring-black"><svg width="8" height="8" viewBox="0 0 24 24" fill="#1A1206" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">{conv.isTeam ? <><span className="text-gold">🏆</span> {conv.name}</> : conv.name}</p>
                            {conv.unread > 0 && <span className="bg-purple-mid text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{conv.unread}</span>}
                          </div>
                          <p className="text-xs text-text-muted truncate">{conv.lastMsg}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {/* Botón nuevo equipo */}
                  <div className="border-t border-border p-3">
                    <button onClick={() => { const name = prompt('Nombre del equipo:'); if (name) { alert(`Chat de equipo "${name}" creado`); } }} 
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold text-sm font-semibold hover:bg-gold/20 transition-all">
                      <Plus size={16} /> Nuevo equipo
                    </button>
                  </div>
                </>
              ) : (
                /* Chat abierto con contacto */
                <>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSelectedChat(null)} className="text-gray-light hover:text-gold transition-colors p-1"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg></button>
                      {activeConv && (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gold/40"><img src={activeConv.avatar} alt="" className="w-full h-full object-cover" /></div>
                          <div>
                            <p className="text-sm font-bold">{activeConv.name}</p>
                            {activeConv.online && <p className="text-[10px] text-green-400"><span className="w-1 h-1 rounded-full bg-green-400 animate-pulse inline-block mr-1" />En línea</p>}
                          </div>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setChatOpen(false)} className="text-gray-light hover:text-red-400 transition-colors p-1"><X size={18} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {selectedChat && messages[selectedChat]?.map((msg, i) => (
                      <div key={i} className={`flex ${msg.me ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.me ? 'bg-purple-mid/20 border border-purple-mid/30 rounded-br-md' : 'bg-white/5 border border-white/10 rounded-bl-md'}`}>
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    )) || <p className="text-center text-text-muted text-sm py-8">No hay mensajes aún</p>}
                  </div>
                  <div className="border-t border-border p-3">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 focus-within:border-gold/40 transition-all">
                      <button className="text-text-faint hover:text-gold p-1"><Paperclip size={16} /></button>
                      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Escribí un mensaje..." className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-text-faint text-sm py-1.5" />
                      <button onClick={handleSend} className="w-8 h-8 rounded-lg bg-gold text-[#1A1206] flex items-center justify-center hover:bg-gold-dark transition-colors"><Send size={14} /></button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
