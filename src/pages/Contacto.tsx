import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/common/Navbar'
import Sidebar from '@/components/common/Sidebar'
import AppTopbar from '@/components/common/AppTopbar'
import Footer from '@/components/common/Footer'
import { AuroraBackground } from '@/components/common/aurora-background'
import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Send, Mail, MapPin, Phone, MessageCircle, Clock, Plus, X, Save } from 'lucide-react'
// @ts-expect-error - JSX file without types
import TechCupHero from '@/components/TechCupHero-contactos'

interface ContactItem {
  id: number
  icon: string
  label: string
  value: string
  desc: string
}

function ContactoContent() {
  const [sent, setSent] = useState(false)
  const [showMercadoPago, setShowMercadoPago] = useState(false)
  const [items, setItems] = useState<ContactItem[]>([
    { id: 1, icon: 'mail', label: 'Correo electrónico', value: 'techcup@escuelaing.edu.co', desc: 'Respuesta en 24-48h' },
    { id: 2, icon: 'map', label: 'Ubicación', value: 'Campus Norte · Cancha 1', desc: 'Escuela Colombiana de Ingeniería' },
    { id: 3, icon: 'phone', label: 'Teléfono', value: '+57 601 123 4567', desc: 'Lun-Vie 8AM-5PM' },
    { id: 4, icon: 'clock', label: 'Horario', value: 'Temporada 2026-I', desc: 'Mar 5 - Jun 15, 2026' },
  ])
  const [editing, setEditing] = useState(false)
  const [newItem, setNewItem] = useState({ label: '', value: '', desc: '' })

  const iconMap: Record<string, React.ReactNode> = {
    mail: <Mail size={18} />, map: <MapPin size={18} />, phone: <Phone size={18} />, clock: <Clock size={18} />, message: <MessageCircle size={18} />
  }

  const addItem = () => {
    if (!newItem.label || !newItem.value) return
    const icons = ['mail', 'map', 'phone', 'clock', 'message']
    setItems([...items, { ...newItem, id: Date.now(), icon: icons[items.length % icons.length] }])
    setNewItem({ label: '', value: '', desc: '' })
  }

  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id))

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 3000) }

  return (
    <>
      <AuroraBackground>
        <div className="relative w-full max-w-[1280px] mx-auto px-8 pt-[160px] pb-[100px] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[35%] opacity-[0.06] dark:opacity-[0.07]" style={{ background: 'linear-gradient(135deg, transparent 30%, #C8851A 50%, transparent 70%)', transform: 'skewX(-18deg)' }} />
            <div className="absolute top-[40%] -left-[5%] w-[55%] h-[20%] opacity-[0.05] dark:opacity-[0.06]" style={{ background: 'linear-gradient(115deg, transparent 20%, #C8851A 40%, #8B5CF6 55%, transparent 75%)', transform: 'skewX(-15deg)' }} />
          </div>
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{backgroundImage:'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)',backgroundSize:'24px 24px',maskImage:'radial-gradient(600px 500px at 50% 30%, black 10%, transparent 70%)',WebkitMaskImage:'radial-gradient(600px 500px at 50% 30%, black 10%, transparent 70%)'}} />
          <div className="relative z-[2] text-center max-w-[600px] mx-auto">
            <motion.span initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[1.6px] uppercase text-gold bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-full mb-[22px]"><MessageCircle size={14} /> Estamos para ayudarte</motion.span>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="font-[family-name:var(--font-display)] font-bold text-[clamp(42px,6vw,72px)] leading-[.92] tracking-[.5px] uppercase mb-4"><span className="text-gold">Contacto</span></motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="text-base leading-relaxed text-text-muted">¿Tenés dudas, sugerencias o querés más información? Escribinos y te respondemos a la brevedad.</motion.p>
          </div>
        </div>
      </AuroraBackground>

      <TechCupHero />
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
