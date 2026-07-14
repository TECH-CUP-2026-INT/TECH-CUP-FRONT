import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Badge } from '@/components/common/badge'
import { partidos } from '@/services/partidos'
import { torneos, type Torneo } from '@/services/torneos'
import { CalendarDays, MapPin, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react'
import TournamentCalendar from '@/components/TournamentCalendar'
import CalendarFilters from '@/components/CalendarFilters'
import UpcomingMatches from '@/components/UpcomingMatches'

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

const equiposList = [
  { nom: 'Tigres FC', emoji: '🐯', color: '#EF4444' },
  { nom: 'Sistemas FC', emoji: '⚙️', color: '#22C55E' },
  { nom: 'Code United', emoji: '🔵', color: '#3B82F6' },
  { nom: 'IA Warriors', emoji: '🦁', color: '#8B5CF6' },
  { nom: 'Dragones FC', emoji: '🐉', color: '#F97316' },
  { nom: 'Los Bits', emoji: '⚡', color: '#F5A623' },
  { nom: 'Titanes', emoji: '🛡️', color: '#14B8A6' },
  { nom: 'Fénix', emoji: '🔥', color: '#EC4899' },
]

function CalendarioContent() {
  const [mes, setMes] = useState(4)
  const [año] = useState(2026)
  const [vista, setVista] = useState<'calendario' | 'lista'>('calendario')
  const [selectedMatch, setSelectedMatch] = useState<typeof partidos[0] | null>(null)
  const [torneoModal, setTorneoModal] = useState<Torneo | null>(null)
  const [modalTab, setModalTab] = useState('info')
  const [calendarDayMatches, setCalendarDayMatches] = useState<typeof partidos | null>(null)
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
          {/* Carrusel de fondo — logos */}
          <div className="absolute left-0 right-0 bottom-0 overflow-hidden pointer-events-none" style={{ opacity: 0.12, height: '55%' }}>
            <div className="flex gap-6 items-center animate-scroll" style={{ width: 'max-content', filter: 'blur(2px)' }}>
              {[...Array(8)].flatMap(() => [
                { src:'/images/logos-equipos/logo1.png' },
                { src:'/images/logos-equipos/logo2.png' },
                { src:'/images/logos-equipos/logo3.png' },
                { src:'/images/logos-equipos/logo4.png' },
              ]).map((logo, i) => (
                <img key={i} src={logo.src} alt="" className="object-contain" style={{ width: `${60 + (i % 4) * 12}px`, height: `${60 + (i % 4) * 12}px`, transform: `translateY(${(i % 4) * 4 - 6}px)` }} />
              ))}
            </div>
          </div>
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-scroll {
              animation: scroll 60s linear infinite;
            }
          `}</style>
          <div className="text-center max-w-[600px] mx-auto relative z-10">
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
              <button onClick={()=>setVista('calendario')}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${vista==='calendario'?'bg-purple-mid text-white':'bg-[#E8DFF5]/70 dark:bg-black/30 border border-[#D4C8E8]/40 dark:border-white/10 text-[#3D1A6B] dark:text-gray-light hover:border-purple-mid'}`}>Calendario</button>
              <button onClick={()=>setVista('lista')}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${vista==='lista'?'bg-purple-mid text-white':'bg-[#E8DFF5]/70 dark:bg-black/30 border border-[#D4C8E8]/40 dark:border-white/10 text-[#3D1A6B] dark:text-gray-light hover:border-purple-mid'}`}>Lista</button>
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

          {/* Calendar view — two columns */}
          {vista==='calendario' && (
            <div className="grid grid-cols-[1fr_260px] gap-4 items-start max-lg:grid-cols-1">
              <div className="rounded-2xl overflow-hidden border border-[#D4C8E8]/40 dark:border-white/5">
                <TournamentCalendar />
              </div>
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl overflow-hidden border border-[#D4C8E8]/40 dark:border-white/5">
                  <CalendarFilters />
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#D4C8E8]/40 dark:border-white/5">
                  <UpcomingMatches />
                </div>
              </div>
            </div>
          )}

          {vista === 'lista' && (
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
                        <div className="flex flex-col items-center min-w-[50px]">
                          <span className="font-[family-name:var(--font-display)] text-2xl leading-none text-[#3D1A6B] dark:text-white">{p.dia}</span>
                          <span className="text-[10px] text-[#7A6B99] dark:text-text-muted uppercase font-semibold tracking-wider">{p.mes}</span>
                          <div className="flex items-center gap-1 mt-1.5"><Clock size={11} className="text-gold" /><span className="text-[10px] font-bold text-gold">{p.hora}</span></div>
                        </div>
                        <div className="w-[2px] self-stretch bg-[#D4C8E8]/40 dark:bg-white/10 rounded-full max-md:hidden" />
                        <div className="flex-1 flex items-center justify-center gap-3 max-md:justify-center">
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

            {/* Right: Detalle */}
            <div className="sticky top-24">
              {selectedMatch ? (
                <AnimatePresence mode="wait">
                  <motion.div key={selectedMatch.dia + selectedMatch.eq1} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                    className="rounded-2xl overflow-hidden border border-[#D4C8E8]/40 dark:border-white/5 bg-[#E8DFF5]/70 dark:bg-black/30">
                    <div className="relative h-[280px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#2E0953] to-[#190D2B]">
                      <img src="/cancha-juego.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                      <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(at 50% 40%, rgb(200, 133, 26) 0%, transparent 60%)' }} />
                      <button onClick={() => setSelectedMatch(null)} className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold transition-colors"><X size={14} /></button>
                      <div className="relative w-full h-full flex flex-col justify-between p-5 z-10">
                        <div>
                          <span className="inline-block rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 mb-2 bg-white/15 text-white border border-white/20 backdrop-blur-sm">Próximo</span>
                          <span className="block text-[10px] tracking-[1.2px] text-gold font-bold uppercase mb-1">Torneo oficial</span>
                          <h3 className="font-[family-name:var(--font-display)] text-xl uppercase text-white leading-tight">{selectedMatch.eq1} vs {selectedMatch.eq2}</h3>
                          <p className="text-[12px] text-white/60 mt-1">{selectedMatch.dia} de {selectedMatch.mes} • {selectedMatch.hora}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-white/50 mb-3"><MapPin size={14} /> {selectedMatch.lugar}</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-white/60"><strong className="text-white/90">{equipoLogos[selectedMatch.eq1]?.emoji || '⚽'}</strong> {selectedMatch.eq1}</span>
                              <span className="text-[10px] text-gold font-bold">VS</span>
                              <span className="text-[11px] text-white/60"><strong className="text-white/90">{equipoLogos[selectedMatch.eq2]?.emoji || '⚽'}</strong> {selectedMatch.eq2}</span>
                            </div>
                            <span className="text-[11px] font-bold text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full transition-colors">Ver partido</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
          )}
        </div>

        {/* ═══════════════ MODAL DETALLE TORNEO (FUERA DEL BLOQUE vista) ═══════════════ */}
        {torneoModal && (() => {
          const t = torneoModal
          const isUpcoming = t.estado === 'upcoming'
          return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => { setTorneoModal(null); setCalendarDayMatches(null) }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <div className="relative max-w-2xl w-full bg-white dark:bg-[#1D0E33] rounded-2xl overflow-hidden border border-[#D4C8E8]/40 dark:border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => { setTorneoModal(null); setCalendarDayMatches(null) }} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold">✕</button>
              <div className="relative h-[200px] overflow-hidden">
                <img src="/cancha-juego.png" alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(at 50% 40%, rgb(200, 133, 26) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 mb-2 bg-white/15 text-white border border-white/20 backdrop-blur-sm">
                    {t.estado === 'live' ? 'En curso' : t.estado === 'upcoming' ? 'Próximo' : 'Finalizado'}
                  </span>
                  <span className="block text-[10px] tracking-[1.2px] text-gold font-bold uppercase mb-1">{t.tag}</span>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase text-white leading-tight">{t.nombre}</h2>
                  <p className="text-[12px] text-white/60 mt-1">{t.categoria} — {t.semestre}</p>
                </div>
              </div>
              <div className="flex border-b border-[#D4C8E8]/40 dark:border-white/10">
                <button onClick={() => setModalTab('info')}
                  className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'info' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Info</button>
                <button onClick={() => setModalTab('partidos')}
                  className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'partidos' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Partidos</button>
                <button onClick={() => setModalTab('equipos')}
                  className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'equipos' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Equipos</button>
                {!isUpcoming && <button onClick={() => setModalTab('tablero')}
                  className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'tablero' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Tablero</button>}
              </div>
              <div className="p-5 max-h-[50vh] overflow-y-auto">
                {modalTab === 'info' && (
                  <div className="space-y-4">
                    <h4 className="text-[13px] font-semibold text-[#3D1A6B] dark:text-white">Información del torneo</h4>
                    <div className="flex items-center gap-2 text-[13px] text-[#7A6B99] dark:text-white/50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      {t.fecha}
                    </div>
                    <div className="flex gap-6 pt-4 border-t border-[#D4C8E8]/40 dark:border-white/10">
                      <div><span className="text-[11px] text-[#7A6B99] dark:text-white/50">Equipos</span><p className="text-lg font-bold text-[#3D1A6B] dark:text-white">{t.equipos}</p></div>
                      <div><span className="text-[11px] text-[#7A6B99] dark:text-white/50">Jugadores</span><p className="text-lg font-bold text-[#3D1A6B] dark:text-white">{t.jugadores}</p></div>
                      <div><span className="text-[11px] text-[#7A6B99] dark:text-white/50">Canchas</span><p className="text-lg font-bold text-[#3D1A6B] dark:text-white">{t.canchas}</p></div>
                    </div>
                  </div>
                )}
                {modalTab === 'partidos' && (
                  <div className="space-y-3">
                    <h4 className="text-[13px] font-semibold text-[#3D1A6B] dark:text-white">Partidos del día {calendarDayMatches?.[0]?.dia} de {calendarDayMatches?.[0]?.mes}</h4>
                    {calendarDayMatches?.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#E8DFF5]/50 dark:bg-white/5 border border-[#D4C8E8]/40 dark:border-white/10">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: equipoLogos[m.eq1]?.color || '#6B7280' }} />
                        <span className="text-sm font-semibold text-[#3D1A6B] dark:text-white">{m.eq1}</span>
                        <span className="text-[10px] text-[#7A6B99] dark:text-text-faint font-bold">VS</span>
                        <span className="text-sm font-semibold text-[#3D1A6B] dark:text-white">{m.eq2}</span>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: equipoLogos[m.eq2]?.color || '#6B7280' }} />
                        <div className="ml-auto text-[10px] text-[#7A6B99] dark:text-white/50 text-right">
                          <div>⏰ {m.hora}</div>
                          <div>📍 {m.lugar.slice(0, 20)}...</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {modalTab === 'equipos' && (
                  <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3">
                    {equiposList.map(eq => (
                      <div key={eq.nom} className="flex items-center gap-3 p-3 rounded-xl bg-[#E8DFF5]/50 dark:bg-white/5 border border-[#D4C8E8]/40 dark:border-white/10 hover:border-gold/30 transition-all">
                        <span className="text-2xl">{eq.emoji}</span>
                        <span className="font-semibold text-[13px] text-[#3D1A6B] dark:text-white">{eq.nom}</span>
                        <span className="w-3 h-3 rounded-full ml-auto" style={{ backgroundColor: eq.color }} />
                      </div>
                    ))}
                  </div>
                )}
                {modalTab === 'tablero' && !isUpcoming && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1px] text-[#7A6B99] dark:text-text-faint pb-2 border-b border-[#D4C8E8]/40 dark:border-white/10">
                      <span className="w-6 text-center">#</span><span className="flex-1">Equipo</span><span className="w-8 text-center">PJ</span><span className="w-8 text-center">DG</span><span className="w-8 text-center">PTS</span>
                    </div>
                    {[
                      { pos: 1, nom: 'Tigres FC', emoji: '🐯', pj: 12, dg: 18, pts: 28 },
                      { pos: 2, nom: 'Code United', emoji: '🔵', pj: 12, dg: 12, pts: 25 },
                      { pos: 3, nom: 'IA Warriors', emoji: '🦁', pj: 12, dg: 8, pts: 24 },
                      { pos: 4, nom: 'Sistemas FC', emoji: '⚙️', pj: 12, dg: 4, pts: 20 },
                      { pos: 5, nom: 'Dragones FC', emoji: '🐉', pj: 12, dg: -2, pts: 16 },
                      { pos: 6, nom: 'Los Bits', emoji: '⚡', pj: 12, dg: -6, pts: 12 },
                      { pos: 7, nom: 'Titanes', emoji: '🛡️', pj: 12, dg: -12, pts: 8 },
                      { pos: 8, nom: 'Fénix', emoji: '🔥', pj: 12, dg: -22, pts: 4 },
                    ].map((eq, i) => (
                      <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl ${i < 4 ? 'bg-[#E8DFF5]/50 dark:bg-white/5' : ''} border border-[#D4C8E8]/40 dark:border-white/10`}>
                        <span className="w-6 text-center text-[11px] font-bold text-[#7A6B99] dark:text-text-faint">{eq.pos}</span>
                        <span className="text-base">{eq.emoji}</span>
                        <span className="flex-1 text-xs font-semibold text-[#3D1A6B] dark:text-white truncate">{eq.nom}</span>
                        <span className="w-8 text-center text-[11px] text-[#7A6B99] dark:text-white/60">{eq.pj}</span>
                        <span className={`w-8 text-center text-[11px] font-mono ${eq.dg >= 0 ? 'text-green-500' : 'text-red-400'}`}>{eq.dg > 0 ? '+' : ''}{eq.dg}</span>
                        <span className="w-8 text-center text-xs font-bold text-gold">{eq.pts}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          )
        })()}
      </section>
    </>
  )
}

export default function Calendario() {
  const location = useLocation()
  const isPrivate = location.pathname.startsWith('/app')

  if (isPrivate) {
    return (
      <DashboardLayout title="Calendario">
        <CalendarioContent />
      </DashboardLayout>
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
