import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Badge } from '@/components/ui/badge'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { partidos } from '@/data/partidos'
import { CalendarDays, MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

const DIAS_SEMANA = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']

function generarDiasMes(mes: number, año: number) {
  const dias = []
  const primerDia = new Date(año, mes, 1)
  for (let i = 0; i < (primerDia.getDay() || 7) - 1; i++) dias.push(null)
  for (let d = 1; d <= new Date(año, mes + 1, 0).getDate(); d++) {
    const fecha = new Date(año, mes, d)
    dias.push({ dia: d, tienePartido: partidos.some(p => p.dia === d && p.mes === 'MAY'), hoy: d === 9 && mes === 6 })
  }
  return dias
}

function CalendarioContent() {
  const [mes, setMes] = useState(6)
  const [año] = useState(2026)
  const [vista, setVista] = useState<'calendario' | 'lista'>('lista')
  const dias = generarDiasMes(mes, año)
  const nombreMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][mes]

  return (
    <>
      <AuroraBackground>
        <div className="relative w-full max-w-[1280px] mx-auto px-8 pt-[160px] pb-[100px] overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{backgroundImage:'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)',backgroundSize:'24px 24px',maskImage:'radial-gradient(600px 500px at 50% 30%, black 10%, transparent 70%)',WebkitMaskImage:'radial-gradient(600px 500px at 50% 30%, black 10%, transparent 70%)'}} />
          <div className="relative z-[2] text-center max-w-[600px] mx-auto">
            <motion.span initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[1.6px] uppercase text-gold bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-full mb-[22px]"><CalendarDays size={14} /> Calendario {año}</motion.span>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="font-[family-name:var(--font-display)] font-bold text-[clamp(42px,6vw,72px)] leading-[.92] tracking-[.5px] uppercase mb-4">Calendario de <span className="text-gold">Partidos</span></motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="text-base leading-relaxed text-text-muted">Consultá la programación de partidos, filtrá por torneo y seguí la acción en vivo.</motion.p>
          </div>
        </div>
      </AuroraBackground>

      <section className="py-14 pb-[100px] relative">
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-mid/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-8 relative">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button onClick={()=>setVista('lista')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${vista==='lista'?'bg-purple-mid text-white':'bg-surface text-text-muted border border-border hover:border-purple-mid'}`}>Lista</button>
              <button onClick={()=>setVista('calendario')} className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${vista==='calendario'?'bg-purple-mid text-white':'bg-surface text-text-muted border border-border hover:border-purple-mid'}`}>Calendario</button>
            </div>
            {vista==='calendario' && (
              <div className="flex items-center gap-3">
                <button onClick={()=>setMes(m=>m-1)} disabled={mes===0} className="w-9 h-9 rounded-lg border border-border bg-surface text-gray-light flex items-center justify-center hover:border-purple-mid disabled:opacity-30 transition-all"><ChevronLeft size={18} /></button>
                <span className="font-[family-name:var(--font-display)] text-lg uppercase min-w-[140px] text-center">{nombreMes} {año}</span>
                <button onClick={()=>setMes(m=>m+1)} disabled={mes===11} className="w-9 h-9 rounded-lg border border-border bg-surface text-gray-light flex items-center justify-center hover:border-purple-mid disabled:opacity-30 transition-all"><ChevronRight size={18} /></button>
              </div>
            )}
          </div>

          {vista==='calendario' && (
            <SpotlightCard accent="purple" className="bg-surface border border-border rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-7 gap-2">
                {DIAS_SEMANA.map(d=><div key={d} className="text-center text-[11px] text-text-faint font-semibold uppercase tracking-[.5px] py-2">{d}</div>)}
                {dias.map((d,i)=>(
                  <div key={i} className="aspect-square flex items-center justify-center">
                    {d ? (
                      <div className={`w-full h-full rounded-xl flex flex-col items-center justify-center text-sm transition-all ${d.tienePartido?'bg-purple-mid/20 border border-purple-mid/40 text-white font-bold cursor-pointer hover:bg-purple-mid/30':d.hoy?'bg-gold/15 border border-gold/30 text-gold font-bold':'text-text-muted hover:bg-white/5'}`}>
                        <span>{d.dia}</span>
                        {d.tienePartido && <span className="w-1 h-1 rounded-full bg-gold mt-1" />}
                      </div>
                    ) : <span />}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gold" /> Partido programado</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-mid" /> Hoy</span>
              </div>
            </SpotlightCard>
          )}

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}}>
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-6">Próximos <span className="text-gold">partidos</span></h2>
            <div className="grid gap-4">
              {partidos.length === 0 && <div className="text-center py-16"><CalendarDays size={48} className="mx-auto text-text-faint mb-4" /><p className="text-text-muted text-lg">No hay partidos programados aún.</p></div>}
              {partidos.map((p,i)=>(
                <SpotlightCard key={i} accent={i===0?'gold':'purple'} className="bg-surface border border-border rounded-2xl">
                  <div className="flex items-center gap-5 p-5 max-md:flex-col max-md:text-center">
                    <div className="flex flex-col items-center min-w-[60px]"><span className="font-[family-name:var(--font-display)] text-3xl leading-none">{p.dia}</span><span className="text-xs text-text-muted uppercase font-semibold tracking-wider">{p.mes}</span></div>
                    <div className="w-px h-12 bg-border max-md:hidden" />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 max-md:justify-center"><span className="font-semibold text-base">{p.eq1}</span><span className="text-text-faint text-sm font-bold">VS</span><span className="font-semibold text-base">{p.eq2}</span></div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-text-muted flex-wrap max-md:justify-center"><span className="flex items-center gap-1"><MapPin size={12} /> {p.lugar}</span></div>
                    </div>
                    <div className="w-px h-12 bg-border max-md:hidden" />
                    <div className="flex flex-col items-center min-w-[80px]"><Clock size={16} className="text-gold mb-1" /><span className="text-sm font-bold text-gold">{p.hora}</span><Badge className="mt-1 rounded-full text-[10px] px-2 py-0.5 h-auto bg-purple-mid/20 text-purple-mid border border-purple-mid/30 uppercase font-bold">Próximo</Badge></div>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default function Calendario() {
  const location = useLocation()
  const isPrivate = location.pathname.startsWith('/app')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isPrivate) {
    return (
      <div className="min-h-screen bg-black flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <AppTopbar title="Calendario" onMenuClick={() => setSidebarOpen(true)} />
          <CalendarioContent />
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <CalendarioContent />
      <Footer />
    </div>
  )
}
