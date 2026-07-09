import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Send, Mail, MapPin, Phone, MessageCircle, Clock } from 'lucide-react'

const contactInfo = [
  { icon: Mail, label: 'Correo electrónico', value: 'techcup@escuelaing.edu.co', desc: 'Respuesta en 24-48h' },
  { icon: MapPin, label: 'Ubicación', value: 'Campus Norte · Cancha 1', desc: 'Escuela Colombiana de Ingeniería' },
  { icon: Phone, label: 'Teléfono', value: '+57 601 123 4567', desc: 'Lun-Vie 8AM-5PM' },
  { icon: Clock, label: 'Horario', value: 'Temporada 2026-I', desc: 'Mar 5 - Jun 15, 2026' },
]

function ContactoContent() {
  const [sent, setSent] = useState(false)
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); setTimeout(()=>setSent(false),3000) }

  return (
    <>
      <AuroraBackground>
        <div className="relative w-full max-w-[1280px] mx-auto px-8 pt-[160px] pb-[100px] overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{backgroundImage:'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)',backgroundSize:'24px 24px',maskImage:'radial-gradient(600px 500px at 50% 30%, black 10%, transparent 70%)',WebkitMaskImage:'radial-gradient(600px 500px at 50% 30%, black 10%, transparent 70%)'}} />
          <div className="relative z-[2] text-center max-w-[600px] mx-auto">
            <motion.span initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[1.6px] uppercase text-gold bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-full mb-[22px]"><MessageCircle size={14} /> Estamos para ayudarte</motion.span>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="font-[family-name:var(--font-display)] font-bold text-[clamp(42px,6vw,72px)] leading-[.92] tracking-[.5px] uppercase mb-4"><span className="text-gold">Contacto</span></motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="text-base leading-relaxed text-text-muted">¿Tenés dudas, sugerencias o querés más información? Escribinos y te respondemos a la brevedad.</motion.p>
          </div>
        </div>
      </AuroraBackground>

      <section className="py-14 pb-[100px] relative">
        <div className="absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-purple-mid/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-5%] w-[350px] h-[350px] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-8 relative">
          <div className="grid grid-cols-[1.2fr_1fr] gap-10 items-start max-lg:grid-cols-1">
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.4}}>
              <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-8">
                <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-1">Envíanos un <span className="text-gold">mensaje</span></h2>
                <p className="text-sm text-text-muted mb-8">Completá el formulario y nos pondremos en contacto.</p>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                    <div><label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-2">Nombre</label><Input placeholder="Tu nombre" required className="bg-black border-border text-white placeholder:text-text-faint rounded-xl focus-visible:border-gold" /></div>
                    <div><label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-2">Correo</label><Input type="email" placeholder="correo@escuelaing.edu.co" required className="bg-black border-border text-white placeholder:text-text-faint rounded-xl focus-visible:border-gold" /></div>
                  </div>
                  <div><label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-2">Asunto</label><Input placeholder="¿Sobre qué querés hablar?" required className="bg-black border-border text-white placeholder:text-text-faint rounded-xl focus-visible:border-gold" /></div>
                  <div><label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-2">Mensaje</label><textarea rows={5} placeholder="Escribí tu mensaje acá..." required className="w-full bg-black border border-border text-white placeholder:text-text-faint rounded-xl p-3 text-sm outline-none focus-visible:border-gold resize-none" /></div>
                  <Button type="submit" className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold px-8 py-3 h-auto text-sm w-full">{sent ? <>✓ Mensaje enviado</> : <><Send size={16} /> Enviar mensaje</>}</Button>
                </form>
              </SpotlightCard>
            </motion.div>

            <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.5}} className="space-y-4">
              {contactInfo.map((item,i)=>{const Icon=item.icon; return (
                <SpotlightCard key={i} accent={i%2===0?'gold':'purple'} className="bg-surface border border-border rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-mid/20 border border-purple-mid/30"><Icon size={18} className="text-gold" /></span>
                    <div><p className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">{item.label}</p><p className="text-sm font-semibold mt-0.5">{item.value}</p><p className="text-xs text-text-muted mt-0.5">{item.desc}</p></div>
                  </div>
                </SpotlightCard>
              )})}
              <SpotlightCard accent="purple" className="bg-gradient-to-br from-purple-deep/20 to-purple-black/30 border border-purple-mid/20 rounded-2xl p-6 text-center">
                <p className="font-[family-name:var(--font-display)] text-lg uppercase">🐾 "La pasión nos une,<br />la <span className="text-gold">ingeniería</span> nos impulsa."</p>
                <p className="text-xs text-text-muted mt-2">— Manchas, mascota oficial TechCup</p>
              </SpotlightCard>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default function Contacto() {
  const location = useLocation()
  const isPrivate = location.pathname.startsWith('/app')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isPrivate) {
    return (
      <div className="min-h-screen bg-black flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <AppTopbar title="Contacto" onMenuClick={() => setSidebarOpen(true)} />
          <ContactoContent />
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <ContactoContent />
      <Footer />
    </div>
  )
}
