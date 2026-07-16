import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '@/components/common/Sidebar'
import AppTopbar from '@/components/common/AppTopbar'
import Footer from '@/components/common/Footer'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Button } from '@/components/common/button'
import { Send, Bot, ArrowUpRight } from 'lucide-react'

const faqs = ['¿Cómo me inscribo?', 'Fechas importantes', 'Proceso de pago', 'Reglamento']

const mensajes = [
  { tipo: 'bot', texto: '¡Hola! Soy ManchasBot 🤖 ¿En qué puedo ayudarte hoy?', hora: '10:30' },
  { tipo: 'bot', texto: 'Podés consultar las preguntas frecuentes o escribirme directamente.', hora: '10:30' },
]

export default function Soporte() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState(mensajes)

  const handleSend = () => {
    if (!input.trim()) return
    setMsgs([...msgs, { tipo: 'user', texto: input, hora: new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0') }])
    setInput('')
    setTimeout(() => {
      setMsgs(prev => [...prev, { tipo: 'bot', texto: 'Gracias por tu consulta. Un organizador te responderá a la brevedad.', hora: new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0') }])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />
      <div className="min-w-0 relative z-10">
        <AppTopbar title="Soporte" onMenuClick={() => setSidebarOpen(true)} />

        <main className="max-w-[700px] mx-auto px-8 py-8 pb-[60px]">
          <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl overflow-hidden">
            {/* Header con imagen de Manchas */}
            <div className="bg-gradient-to-r from-purple-deep to-purple-black p-5 border-b border-border flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gold/60 ring-offset-2 ring-offset-purple-black flex-shrink-0">
                <img src="/manchas-callcenter.png" alt="Manchas" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-lg uppercase">Manchas<span className="text-gold">Bot</span></h2>
                <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> En línea</p>
              </div>
            </div>

            {/* Mensajes */}
            <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.tipo === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start gap-2 max-w-[80%] ${m.tipo === 'user' ? 'flex-row-reverse' : ''}`}>
                    {m.tipo === 'bot' && (
                      <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={14} className="text-gold" />
                      </div>
                    )}
                    <div>
                      <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        m.tipo === 'user' ? 'bg-purple-mid/20 border border-purple-mid/30 rounded-br-md' : 'bg-white/5 border border-white/10 rounded-bl-md'
                      }`}>
                        <p>{m.texto}</p>
                      </div>
                      <p className={`text-[10px] text-text-faint/60 mt-0.5 ${m.tipo === 'user' ? 'text-right' : 'text-left'}`}>{m.hora}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div className="px-5 pb-3">
              <p className="text-xs text-text-faint uppercase tracking-[.4px] font-semibold mb-2">Preguntas frecuentes</p>
              <div className="flex flex-wrap gap-2">
                {faqs.map((faq, i) => (
                  <button key={i} onClick={() => setMsgs([...msgs, { tipo: 'user', texto: faq, hora: new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0') }])}
                    className="text-xs px-3 py-1.5 rounded-full bg-purple-mid/10 border border-purple-mid/30 text-purple-mid hover:bg-purple-mid/20 transition-colors">
                    {faq}
                  </button>
                ))}
              </div>
            </div>

            {/* Escalar */}
            <div className="px-5 pb-4">
              <Button size="sm" variant="outline" className="rounded-full border-gold/50 text-gold hover:bg-gold/10 text-xs h-auto py-1.5 px-4">
                <ArrowUpRight size={14} /> ¿No resuelve tu duda? Escalar a organizador
              </Button>
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2 bg-black/50 border border-border rounded-2xl px-4 py-2 focus-within:border-gold/40 transition-all">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Escribí tu pregunta..." className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-text-faint text-sm" />
                <button onClick={handleSend} className="w-8 h-8 rounded-lg bg-gold text-[#1A1206] flex items-center justify-center hover:bg-gold-dark transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </SpotlightCard>
        </main>
        <Footer />
      </div>
    </div>
  )
}
