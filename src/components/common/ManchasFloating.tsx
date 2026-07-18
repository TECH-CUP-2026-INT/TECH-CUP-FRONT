import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'
import { getBotResponse } from '@/utils/manchasbot'

export default function ManchasFloating() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; me: boolean }[]>([
    { text: '¡Hola! Soy ManchasBot 🤖 ¿En qué puedo ayudarte?', me: false }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { text: userMsg, me: true }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { text: getBotResponse(userMsg), me: false }])
    }, 500)
  }

  return (
    <>
      {/* Botón flotante 3D */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 border-2 border-gold/40 shadow-2xl shadow-purple-900/50 hover:shadow-gold/30 hover:scale-110 active:scale-95 transition-all duration-200 overflow-hidden"
        style={{
          boxShadow: '0 8px 32px rgba(88,28,135,0.5), inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.1)',
        }}
      >
        {open ? (
          <X size={24} className="text-white mx-auto mt-4" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-700 to-purple-900">
            <img src="/manchas-callcenter.png" alt="ManchasBot" className="w-14 h-14 object-contain scale-125 drop-shadow-lg" />
          </div>
        )}
      </button>

      {/* Panel de chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[90vw] bg-black/95 backdrop-blur-xl border border-gold/20 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gold/20 bg-gradient-to-r from-purple-deep2 to-purple-black">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gold/40 flex-shrink-0">
                <img src="/manchas-callcenter.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">ManchasBot</p>
                <p className="text-[10px] text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block mr-1" />En línea</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[300px] overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.me ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.me
                      ? 'bg-purple-mid/20 border border-purple-mid/30 rounded-br-md'
                      : 'bg-white/5 border border-white/10 rounded-bl-md'
                  }`}>
                    {!msg.me && (
                      <img src="/manchas-callcenter.png" alt="" className="w-5 h-5 rounded-full inline-block mr-1.5 -mt-0.5 align-middle" />
                    )}
                    <p className="inline align-middle">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-gold/20 p-3">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-3 py-1.5 focus-within:border-gold/40 transition-all">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Escribí tu consulta..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-text-faint text-sm py-1.5"
                />
                <button onClick={handleSend} className="w-8 h-8 rounded-lg bg-gold text-[#1A1206] flex items-center justify-center hover:bg-gold-dark transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
