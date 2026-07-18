import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/common/Sidebar'
import { Menu, Send, Paperclip, Smile, Image, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/common/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu'

interface Message {
  id: number
  user: string
  avatar: string
  text: string
  time: string
  isMe: boolean
}

const conversations = [
  { id: 1, name: 'Sistemas FC', avatar: 'https://i.pravatar.cc/72?img=11', lastMsg: '¿A qué hora es el partido?', unread: 2, online: true },
  { id: 2, name: 'ManchasBot', avatar: 'https://i.pravatar.cc/72?img=15', lastMsg: '¡Hola! ¿En qué puedo ayudarte?', unread: 0, online: true },
  { id: 3, name: 'Carlos López', avatar: 'https://i.pravatar.cc/72?img=12', lastMsg: 'Nos vemos en la cancha', unread: 0, online: false },
  { id: 4, name: 'Ana Martínez', avatar: 'https://i.pravatar.cc/72?img=9', lastMsg: 'Gracias por la invitación', unread: 1, online: true },
]

const messages: Message[] = [
  { id: 1, user: 'Carlos López', avatar: 'https://i.pravatar.cc/72?img=12', text: '¿Listos para el partido de mañana?', time: '10:30', isMe: false },
  { id: 2, user: 'Juan Camilo', avatar: 'https://i.pravatar.cc/72?img=13', text: '¡Sí! Todos confirmados 💪', time: '10:31', isMe: true },
  { id: 3, user: 'Ana Martínez', avatar: 'https://i.pravatar.cc/72?img=9', text: 'Yo llego temprano a calentar', time: '10:32', isMe: false },
  { id: 4, user: 'Juan Camilo', avatar: 'https://i.pravatar.cc/72?img=13', text: 'Perfecto, nos vemos a las 7PM en la cancha', time: '10:33', isMe: true },
  { id: 5, user: 'Carlos López', avatar: 'https://i.pravatar.cc/72?img=12', text: 'Llevo el balón ⚽', time: '10:34', isMe: false },
  { id: 6, user: 'Juan Camilo', avatar: 'https://i.pravatar.cc/72?img=13', text: 'Perfecto, yo llevo los petos 🟡🟣', time: '10:35', isMe: true },
]

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState(1)
  const [input, setInput] = useState('')
  const navigate = useNavigate()
  const activeConv = conversations.find(c => c.id === selectedChat)

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Background glow */}
      <div className="fixed top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-mid/15 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[350px] h-[350px] rounded-full bg-gold/15 blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col h-screen relative z-10">
        {/* Topbar exacta como la del Dashboard */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 bg-black/85 backdrop-blur-md border-b border-border">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <div className="flex items-center gap-3">
            <button className="text-gray-light hover:text-gold-ink transition-colors p-1" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            {activeConv && (
              <div className="flex items-center gap-3 ml-1">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gold/60 ring-offset-2 ring-offset-black shadow-lg shadow-gold/20">
                    <img src={activeConv.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  {activeConv.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 ring-2 ring-black" />
                  )}
                </div>
                <div>
                  <h1 className="text-[17px] font-bold">{activeConv.name}</h1>
                  <p className="text-[11px] text-green-400/80 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    En línea
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-[18px]">
            <button className="relative text-gray-light bg-transparent border-none p-0 hover:text-gold-ink transition-colors group" aria-label="Notificaciones">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:fill-gold/20 transition-all"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/></svg>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gold/40 ring-offset-2 ring-offset-black hover:ring-gold transition-all cursor-pointer"
            >
              <img className="w-full h-full object-cover" src="https://i.pravatar.cc/72?img=13" alt="" />
            </button>
          </div>
        </header>

        {/* Chat messages - glass style */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2.5 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              {/* Avatar con ring que sobresale */}
              <div className={`flex-shrink-0 ${msg.isMe ? 'ml-0' : 'mr-0'}`}>
                <div className={`w-8 h-8 rounded-full overflow-hidden ring-2 shadow-lg ${
                  msg.isMe ? 'ring-purple-mid/60 ring-offset-2 ring-offset-black' : 'ring-gold/40 ring-offset-2 ring-offset-black'
                }`}>
                  <img src={msg.avatar} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              
              {/* Burbuja glass */}
              <div className={`max-w-[75%] md:max-w-[60%] ${msg.isMe ? 'mr-0' : 'ml-0'}`}>
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed backdrop-blur-md border ${
                  msg.isMe 
                    ? 'bg-purple-mid/15 border-purple-mid/20 rounded-br-md' 
                    : 'bg-white/5 border-white/10 rounded-bl-md'
                }`}>
                  <p className="text-gray-light">{msg.text}</p>
                </div>
                <p className={`text-[10px] text-text-faint/60 mt-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Glass input */}
        <div className="border-t border-white/5 bg-black/60 backdrop-blur-xl p-3 md:p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 focus-within:border-gold/40 focus-within:bg-white/10 transition-all group">
              <button className="text-text-faint hover:text-gold-ink transition-colors p-1">
                <Paperclip size={18} />
              </button>
              <button className="text-text-faint hover:text-gold-ink transition-colors p-1">
                <Image size={18} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribí un mensaje..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-text-faint text-sm px-2 py-2"
                onKeyDown={(e) => e.key === 'Enter' && input && setInput('')}
              />
              <button className="text-text-faint hover:text-gold-ink transition-colors p-1">
                <Smile size={18} />
              </button>
              <button
                onClick={() => input && setInput('')}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() 
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
  )
}
