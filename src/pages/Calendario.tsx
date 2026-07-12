import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { Badge } from '@/components/ui/badge'
import { partidos } from '@/data/partidos'
import { CalendarDays, MapPin, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react'

const DIAS_SEMANA = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']

const equipoLogos: Record<string, { emoji: string; color: string }> = {
  'Tigres FC': { emoji: '🐯', color: '#EF4444' },
  'IA Warriors': { emoji: '🦁', color: '#8B5CF6' },
  'Code United': { emoji: '💻', color: '#3B82F6' },
  'Sistemas FC': { emoji: '⚙️', color: '#22C55E' },
  'Dragones FC': { emoji: '🐉', color: '#F97316' },
  'Los Bits': { emoji: '🔢', color: '#EC4899' },
  'Titanes': { emoji: '🏛️', color: '#A855F7' },
  'Fénix': { emoji: '🔥', color: '#EAB308' },
}

const canchaFotos: Record<string, { img: string; desc: string }> = {
  'Cancha Principal Sede Norte': { img: '/hero-stadium.jpg', desc: 'Cancha principal con capacidad para 500 espectadores. Césped sintético de última generación.' },
  'Cancha Principal Sede Norte 2': { img: '/hero-stadium.jpg', desc: 'Cancha alterna con graderías y marcador electrónico.' },
  'Auditorio Principal Sede Norte': { img: '/bg-logo.png', desc: 'Auditorio acondicionado para futsal con piso flotante.' },
}

function generarDiasMes(mes: number, año: number) {
  const dias: ({ dia: number; tienePartido: boolean; hoy: boolean } | null)[] = []
  const primerDia = new Date(año, mes, 1)
  for (let i = 0; i < (primerDia.getDay() || 7) - 1; i++) dias.push(null)
  for (let d = 1; d <= new Date(año, mes + 1, 0).getDate(); d++) {
    dias.push({ dia: d, tienePartido: partidos.some(p => p.dia === d && p.mes === 'MAY'), hoy: d === 9 && mes === 6 })
  }
  return dias
}

function CalendarioContent() {
  const [mes, setMes] = useState(4) // MAY
  const [año] = useState(2026)
  const [vista, setVista] = useState<'calendario' | 'lista'>('lista')
  const [selectedMatch, setSelectedMatch] = useState<typeof partidos[0] | null>(null)
  const dias = generarDiasMes(mes, año)
  const nombreMes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][mes]

  const selectedCancha = selectedMatch ? canchaFotos[selectedMatch.lugar] : null

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#E5ECE9] dark:bg-[#190D2B]">
        <div className="absolute inset-0 pointer-events-none">
          <img src="/hero-stadium.jpg" alt="" className="w-full h-full object-cover opacity-20 dark:opacity-15" style={{ filter: 'blur(50px) saturate(1.4)' }} />
          <div className="absolute inset-0 bg-white/40 dark:bg-[#190D2B]/50" />
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[35%] opacity-[0.06] dark:opacity-[0.07]" style={{ background: 'linear-gradient(135deg, transparent 30%, #C8851A 50%, transparent 70%)', transform: 'skewX(-18deg)' }} />
          <div className="absolute top-[40%] -left-[5%] w-[55%] h-[20%] opacity-[0.05] dark:opacity-[0.06]" style={{ background: 'linear-gradient(115deg, transparent 20%, #C8851A 40%, #8B5CF6 55%, transparent 75%)', transform: 'skewX(-15deg)' }} />
        </div>
        <div className="relative w-full max-w-[1280px] mx-auto px-8 pt-[130px] pb-[80px]">
          <div className="text-center max-w-[600px] mx-auto">
            <motion.span initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[1.6px] uppercase text-gold bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-full mb-[22px]">
              <CalendarDays size={14} /> Calendario {año}
            </motion.span>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="font-[family-name:var(--font-display-alt)] font-bold text-[clamp(28px,4vw,48px)] leading-[.92] tracking-[.5px] uppercase italic mb-4">
              <span className="text-[#3D1A6B] dark:text-[#F7EDE2]">Calendario</span> <span className="text-gold">de Partidos</span>
            </motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="text-base leading-relaxed text-[#7A6B99] dark:text-text-muted">Consultá la programación de partidos, filtrá por torneo y seguí la acción en vivo.</motion.p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 pb-[100px] relative overflow-hidden bg-[#E5ECE9] dark:bg-[#190D2B]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-mid/15 dark:bg-purple-mid/20 blur-[180px]" />
          <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold/15 dark:bg-gold/20 blur-[150px]" />
        </div>
        <div className="max-w-[1280px] mx-auto px-8 relative">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button onClick={()=>setVista('lista')}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${vista==='lista'?'bg-purple-mid text-white':'bg-[#E8DFF5]/70 dark:bg-black/30 border border-[#D4C8E8]/40 dark:border-white/10 text-[#3D1A6B] dark:text-gray-light hover:border-purple-mid'}`}>Lista</button>
              <button onClick={()=>setVista('calendario')}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${vista==='calendario'?'bg-purple-mid text-white':'bg-[#E8DFF5]/70 dark:bg-black/30 border border-[#D4C8E8]/40 dark:border-white/10 text-[#3D1A6B] dark:text-gray-light hover:border-purple-mid'}`}>Calendario</button>
            </div>
            {vista==='calendario' && (
              <div className="flex items-center gap-3">
                <button onClick={()=>setMes(m=>m-1)} disabled={mes===0}
                  className="w-9 h-9 rounded-lg border border-[#D4C8E8]/40 dark:border-white/10 bg-[#E8DFF5]/70 dark:bg-black/30 text-[#3D1A6B] dark:text-gray-light flex items-center justify-center hover:border-purple-mid disabled:opacity-30 transition-all"><ChevronLeft size={18} /></button>
                <span className="font-[family-name:var(--font-display)] text-lg uppercase min-w-[140px] text-center text-[#3D1A6B] dark:text-white">{nombreMes} {año}</span>
                <button onClick={()=>setMes(m=>m+1)} disabled={mes===11}
                  className="w-9 h-9 rounded-lg border border-[#D4C8E8]/40 dark:border-white/10 bg-[#E8DFF5]/70 dark:bg-black/30 text-[#3D1A6B] dark:text-gray-light flex items-center justify-center hover:border-purple-mid disabled:opacity-30 transition-all"><ChevronRight size={18} /></button>
              </div>
            )}
          </div>

          {/* Calendar view */}
          {vista==='calendario' && (
            <div className="bg-[#E8DFF5]/70 dark:bg-black/30 border border-[#D4C8E8]/40 dark:border-white/5 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-7 gap-2">
                {DIAS_SEMANA.map(d=>(
                  <div key={d} className="text-center text-[11px] text-[#7A6B99] dark:text-text-faint font-semibold uppercase tracking-[.5px] py-2">{d}</div>
                ))}
                {dias.map((d,i)=>(
                  <div key={i} className="aspect-square flex items-center justify-center">
                    {d ? (
                      <div className={`w-full h-full rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                        d.tienePartido ? 'bg-gold/15 border border-gold/30 text-gold font-bold cursor-pointer hover:bg-gold/25 shadow-sm'
                        : d.hoy ? 'bg-purple-mid/20 border border-purple-mid/40 text-[#3D1A6B] dark:text-white font-bold'
                        : 'text-[#7A6B99] dark:text-text-muted hover:bg-black/10 dark:hover:bg-white/5'
                      }`}>
                        <span>{d.dia}</span>
                      </div>
                    ) : <span />}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-[#7A6B99] dark:text-text-muted">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gold" /> Partido programado</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-mid" /> Hoy</span>
              </div>
            </div>
          )}

          {/* Lista + Detalle — dos columnas */}
          <div className="grid grid-cols-[1fr_1.2fr] gap-6 items-start max-lg:grid-cols-1">
            {/* Left: Lista de partidos */}
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-[.5px] mb-5 text-[#3D1A6B] dark:text-white">
                Próximos <span className="text-gold">partidos</span>
              </h2>
              <div className="flex flex-col gap-3">
                {partidos.length === 0 && (
                  <div className="text-center py-16"><CalendarDays size={48} className="mx-auto text-[#7A6B99] dark:text-text-faint mb-4" /><p className="text-[#7A6B99] dark:text-text-muted text-lg">No hay partidos programados aún.</p></div>
                )}
                {partidos.map((p,i)=>{
                  const logo1 = equipoLogos[p.eq1] || { emoji: '⚽', color: '#6B7280' }
                  const logo2 = equipoLogos[p.eq2] || { emoji: '⚽', color: '#6B7280' }
                  const isSelected = selectedMatch?.dia === p.dia && selectedMatch?.eq1 === p.eq1
                  return (
                    <button key={i} onClick={() => setSelectedMatch(p)}
                      className={`text-left w-full rounded-2xl border transition-all duration-200 overflow-hidden
                        ${isSelected ? 'border-gold/50 ring-1 ring-gold/20 bg-black/10 dark:bg-black/40' : 'border-[#D4C8E8]/40 dark:border-white/5 bg-[#E8DFF5]/70 dark:bg-black/30 hover:border-purple-mid/50'}`}>
                      <div className="flex items-center gap-3 p-4 max-md:flex-col max-md:text-center">
                        {/* Date + Time */}
                        <div className="flex flex-col items-center min-w-[50px]">
                          <span className="font-[family-name:var(--font-display)] text-2xl leading-none text-[#3D1A6B] dark:text-white">{p.dia}</span>
                          <span className="text-[10px] text-[#7A6B99] dark:text-text-muted uppercase font-semibold tracking-wider">{p.mes}</span>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Clock size={11} className="text-gold" />
                            <span className="text-[10px] font-bold text-gold">{p.hora}</span>
                          </div>
                        </div>
                        <div className="w-px h-12 bg-black/10 dark:bg-white/10 max-md:hidden" />
                        {/* Teams with colored dots */}
                        <div className="flex-1 flex items-center gap-3 max-md:justify-center">
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: logo1.color }} />
                            <span className="font-semibold text-sm text-[#3D1A6B] dark:text-white">{p.eq1}</span>
                          </div>
                          <span className="text-[10px] text-[#7A6B99] dark:text-text-faint font-bold">VS</span>
                          <div className="flex flex-col items-center gap-0.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: logo2.color }} />
                            <span className="font-semibold text-sm text-[#3D1A6B] dark:text-white">{p.eq2}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right: Detalle del partido */}
            <div className="sticky top-24">
              {selectedMatch ? (
                <AnimatePresence mode="wait">
                  <motion.div key={selectedMatch.dia + selectedMatch.eq1} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                    className="rounded-2xl overflow-hidden border border-[#D4C8E8]/40 dark:border-white/5 bg-[#E8DFF5]/70 dark:bg-black/30">
                    {/* Medalla / Moneda dorada con el día */}
                    <div className="relative h-[220px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#2E0953] to-[#190D2B]">
                      <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 40%, #C8851A 0%, transparent 60%)' }} />
                      <button onClick={() => setSelectedMatch(null)} className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold transition-colors">
                        <X size={14} />
                      </button>
                      {/* Gold coin/medal */}
                      <div className="relative flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-gold/60 shadow-[0_0_40px_rgba(200,133,26,0.3)] bg-gold/10"
                          style={{
                            background: 'radial-gradient(circle at 35% 30%, rgba(200,133,26,0.3), rgba(200,133,26,0.05))',
                          }}>
                          <span className="font-[family-name:var(--font-display)] text-5xl text-gold">{selectedMatch.dia}</span>
                        </div>
                        <span className="text-xs text-gold/70 uppercase font-semibold tracking-wider mt-2">{selectedMatch.mes}</span>
                      </div>
                      {/* Teams on sides */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{equipoLogos[selectedMatch.eq1]?.emoji || '⚽'}</span>
                          <span className="text-sm font-semibold text-white">{selectedMatch.eq1}</span>
                        </div>
                        <span className="text-[10px] text-gold font-bold px-2">VS</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{selectedMatch.eq2}</span>
                          <span className="text-xl">{equipoLogos[selectedMatch.eq2]?.emoji || '⚽'}</span>
                        </div>
                      </div>
                    </div>
                    {/* Description */}
                    <div className="p-5 space-y-4">
                      <div className="flex items-start gap-2 text-[13px] text-[#7A6B99] dark:text-white/60">
                        <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-[#3D1A6B] dark:text-white">{selectedMatch.lugar}</p>
                          <p className="mt-1">{selectedCancha?.desc || 'Cancha universitaria equipada para la competencia.'}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-3 border-t border-[#D4C8E8]/40 dark:border-white/10">
                        <Badge className="rounded-full text-[10px] px-3 py-1 h-auto bg-purple-mid/20 text-purple-mid border border-purple-mid/30">Próximo</Badge>
                        <span className="text-xs text-[#7A6B99] dark:text-text-muted self-center">Torneo: TechCup 2026</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#D4C8E8]/40 dark:border-white/10 p-10 text-center">
                  <CalendarDays size={40} className="mx-auto text-[#7A6B99] dark:text-text-faint mb-3" />
                  <p className="text-sm text-[#7A6B99] dark:text-text-muted">Seleccioná un partido para ver los detalles</p>
                </div>
              )}
            </div>
          </div>
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
    <div className="min-h-screen bg-[#E5ECE9] dark:bg-[#190D2B]">
      <Navbar />
      <CalendarioContent />
      <Footer />
    </div>
  )
}



