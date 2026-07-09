import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Send, Paperclip, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AppTopbarProps {
  title: string
  onMenuClick: () => void
}

export default function AppTopbar({ title, onMenuClick }: AppTopbarProps) {
  const navigate = useNavigate()
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-[18px] bg-black/85 backdrop-blur-md border-b border-border max-md:px-4">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-mid/60 to-transparent" />
        
        <div className="flex items-center gap-3">
          <button className="text-white p-1.5 hover:text-gold transition-colors" onClick={onMenuClick} aria-label="Menú">
            <Menu size={22} />
          </button>
          <h1 className="text-[17px] font-bold">{title}</h1>
        </div>

        <div className="flex items-center gap-[18px]">
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

          <button className="relative text-gray-light bg-transparent border-none p-0 hover:text-gold transition-colors group" aria-label="Notificaciones">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:fill-gold/20 transition-all"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/></svg>
            <span className="absolute -top-[5px] -right-[7px] bg-purple-mid text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-black">3</span>
          </button>

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

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setChatOpen(false)} />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-40 w-[380px] max-w-[90vw] bg-black/95 backdrop-blur-xl border-l border-border flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gold/60 ring-offset-2 ring-offset-black"><img src="https://i.pravatar.cc/72?img=11" alt="" className="w-full h-full object-cover" /></div>
                  <div><p className="text-sm font-bold">Sistemas FC</p><p className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> En línea</p></div>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-gray-light hover:text-red-400 transition-colors p-1"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {[{text:'¿Listos para el partido de mañana?',me:false},{text:'¡Sí! Todos confirmados 💪',me:true},{text:'Yo llego temprano a calentar',me:false},{text:'Perfecto, nos vemos a las 7PM',me:true}].map((msg,i)=>(
                  <div key={i} className={`flex ${msg.me?'justify-end':'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.me?'bg-purple-mid/20 border border-purple-mid/30 rounded-br-md':'bg-white/5 border border-white/10 rounded-bl-md'}`}><p>{msg.text}</p></div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 focus-within:border-gold/40 transition-all">
                  <button className="text-text-faint hover:text-gold p-1"><Paperclip size={16} /></button>
                  <input placeholder="Escribí un mensaje..." className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-text-faint text-sm py-1.5" />
                  <button className="w-8 h-8 rounded-lg bg-gold text-[#1A1206] flex items-center justify-center hover:bg-gold-dark transition-colors"><Send size={14} /></button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
