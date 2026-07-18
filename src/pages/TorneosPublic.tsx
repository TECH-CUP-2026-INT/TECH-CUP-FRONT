import { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import DashboardLayout from '@/components/common/DashboardLayout'
import { Button } from '@/components/common/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/common/select'
import { Search, RefreshCw, LayoutGrid, List, CalendarDays, MapPin, Clock, Download } from 'lucide-react'
import { ThreeDCarousel } from '@/components/common/three-d-carousel'
import { torneos, type Torneo, fetchTorneos } from '@/services/torneos'

const PAGE_SIZE = 6

function TorneosContent() {
  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterSemestre, setFilterSemestre] = useState('todos')
  const [filterCategoria, setFilterCategoria] = useState('todos')
  const [filterSearch, setFilterSearch] = useState('')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [modalTournament, setModalTournament] = useState<Torneo | null>(null)
  const [modalTab, setModalTab] = useState('info')

  useEffect(() => { fetchTorneos() }, [])

  const filtered = useMemo(() => {
    return torneos.filter(t => {
      if (filterEstado !== 'todos' && t.estado !== filterEstado) return false
      if (filterSemestre !== 'todos' && t.semestre !== filterSemestre) return false
      if (filterCategoria !== 'todos' && t.categoria !== filterCategoria) return false
      if (filterSearch && !t.nombre.toLowerCase().includes(filterSearch.toLowerCase())) return false
      return true
    })
  }, [filterEstado, filterSemestre, filterCategoria, filterSearch])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const semestres = [...new Set(torneos.map(t => t.semestre))].sort()

  function clearFilters() {
    setFilterEstado('todos'); setFilterSemestre('todos'); setFilterCategoria('todos'); setFilterSearch(''); setPage(1)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#E5ECE9] dark:bg-[#190D2B]">
        <div className="absolute inset-0 pointer-events-none">
          <img src="/banner-soccer.jpg" alt="" className="w-full h-full object-cover opacity-20 dark:opacity-15" style={{ filter: 'blur(50px) saturate(1.4)' }} />
          <div className="absolute inset-0 bg-white/40 dark:bg-[#190D2B]/50" />
        </div>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[35%] origin-top-right opacity-[0.06] dark:opacity-[0.07]" style={{ background: 'linear-gradient(135deg, transparent 30%, #C8851A 50%, transparent 70%)', transform: 'skewX(-18deg)' }} />
          <div className="absolute top-[40%] -left-[5%] w-[55%] h-[20%] opacity-[0.05] dark:opacity-[0.06]" style={{ background: 'linear-gradient(115deg, transparent 20%, #C8851A 40%, #8B5CF6 55%, transparent 75%)', transform: 'skewX(-15deg)' }} />
        </div>

        {/* 3D Carousel de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <ThreeDCarousel images={[
            { src: '/images/fondo-1.png', alt: '' },
            { src: '/images/fondo-2.png', alt: '' },
            { src: '/images/fondo-3.png', alt: '' },
          ]} />
        </div>

        <div className="relative w-full max-w-[1280px] mx-auto px-8 pt-[130px] pb-[80px]">
          {/* Carrusel de fondo — fotos */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.12 }}>
            <div className="flex gap-6 items-center animate-scroll" style={{ width: 'max-content', filter: 'blur(2px)' }}>
              {[...Array(8)].flatMap(() => [
                { src:'/images/fondo-1.png' },
                { src:'/images/fondo-2.png' },
                { src:'/images/fondo-3.png' },
              ]).map((img, i) => (
                <img key={i} src={img.src} alt="" className="object-cover" style={{ width: `${320 - (i % 3) * 130}px`, height: `${360 - (i % 3) * 140}px`, transform: `translateY(${25 - (i % 3) * 25}px)` }} />
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
          <div className="text-center max-w-[700px] mx-auto relative z-10">
            <motion.span initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[1.6px] uppercase text-gold bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-full mb-[22px]">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> Torneos
            </motion.span>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="font-[family-name:var(--font-display-alt)] font-bold text-[clamp(42px,6vw,72px)] leading-[.92] tracking-[.5px] uppercase italic mb-4">
              <span className="text-[#3D1A6B] dark:text-[#F7EDE2]">Torneos</span> <span className="text-gold">y Equipos</span>
            </motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="text-base leading-relaxed text-[#7A6B99] dark:text-text-muted max-w-[560px] mx-auto">
              Descubre los torneos disponibles, explora los equipos inscritos y sé parte de la competencia más emocionante de Ingeniería de Sistemas.
            </motion.p>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.7}} className="flex items-center justify-center gap-6 mt-5 text-[13px] text-[#7A6B99] dark:text-text-muted">
              <span><strong className="text-gold">{torneos.length}</strong> torneos</span>
              <span className="w-px h-4 bg-black/10 dark:bg-white/10" />
              <span><strong className="text-gold">{torneos.reduce((a,t)=>a+t.equipos,0)}</strong> equipos</span>
              <span className="w-px h-4 bg-black/10 dark:bg-white/10" />
              <span><strong className="text-gold">{torneos.reduce((a,t)=>a+t.jugadores,0)}+</strong> jugadores</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 pb-[100px] relative overflow-hidden bg-[#E5ECE9] dark:bg-[#190D2B]">
        <div className="absolute inset-0 pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-8 relative">
          {/* Filters */}
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.6}}
            className="grid grid-cols-[repeat(3,160px)_1fr_auto] gap-3 items-end mb-8 max-lg:grid-cols-2 max-sm:grid-cols-1
              bg-[#E8DFF5]/70 dark:bg-black/30 border border-[#D4C8E8]/40 dark:border-white/5 rounded-2xl p-5">
            <div>
              <label className="block text-[11px] text-[#7A6B99] dark:text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Estado</label>
              <Select value={filterEstado} onValueChange={v=>{setFilterEstado(v);setPage(1)}}>
                <SelectTrigger className="bg-[#E8DFF5]/70 dark:bg-black/20 border border-[#D4C8E8]/40 dark:border-white/10 text-[#3D1A6B] dark:text-gray-light rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1F1F28] border border-[#D4C8E8]/40 dark:border-white/10">
                  {[{value:'todos',label:'Todos'},{value:'live',label:'En curso'},{value:'upcoming',label:'Próximo'},{value:'closed',label:'Finalizado'}].map(e=>
                    <SelectItem key={e.value} value={e.value} className="text-[#3D1A6B] dark:text-gray-light">{e.label}</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[11px] text-[#7A6B99] dark:text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Semestre</label>
              <Select value={filterSemestre} onValueChange={v=>{setFilterSemestre(v);setPage(1)}}>
                <SelectTrigger className="bg-[#E8DFF5]/70 dark:bg-black/20 border border-[#D4C8E8]/40 dark:border-white/10 text-[#3D1A6B] dark:text-gray-light rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1F1F28] border border-[#D4C8E8]/40 dark:border-white/10">
                  <SelectItem value="todos" className="text-[#3D1A6B] dark:text-gray-light">Todos</SelectItem>
                  {semestres.map(s=><SelectItem key={s} value={s} className="text-[#3D1A6B] dark:text-gray-light">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[11px] text-[#7A6B99] dark:text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Categoría</label>
              <Select value={filterCategoria} onValueChange={v=>{setFilterCategoria(v);setPage(1)}}>
                <SelectTrigger className="bg-[#E8DFF5]/70 dark:bg-black/20 border border-[#D4C8E8]/40 dark:border-white/10 text-[#3D1A6B] dark:text-gray-light rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#1F1F28] border border-[#D4C8E8]/40 dark:border-white/10">
                  <SelectItem value="todos" className="text-[#3D1A6B] dark:text-gray-light">Todas</SelectItem>
                  <SelectItem value="Fútbol 11" className="text-[#3D1A6B] dark:text-gray-light">Fútbol 11</SelectItem>
                  <SelectItem value="Futsal" className="text-[#3D1A6B] dark:text-gray-light">Futsal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[11px] text-[#7A6B99] dark:text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Buscar</label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6B99] dark:text-text-faint" />
                <input type="text" placeholder="Ej. TechCup 2024" value={filterSearch} onChange={e=>{setFilterSearch(e.target.value);setPage(1)}}
                  className="w-full bg-[#E8DFF5]/70 dark:bg-black/20 border border-[#D4C8E8]/40 dark:border-white/10 text-[#3D1A6B] dark:text-gray-light rounded-lg py-2.5 pl-9 pr-3 text-[13.5px] outline-none focus:border-purple-mid placeholder:text-[#9B8AB5] dark:placeholder:text-text-faint" />
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}
              className="border-gold text-gold rounded-full hover:bg-gold/10 self-end mb-0.5">
              <RefreshCw size={14} /> Limpiar
            </Button>
          </motion.div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D4C8E8]/40 dark:border-white/5 flex-wrap gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-lg uppercase text-[#3D1A6B] dark:text-white">Todos los torneos</h2>
            <div className="flex items-center gap-3.5 text-[13px] text-[#7A6B99] dark:text-text-muted">
              <span className="bg-[#E8DFF5]/70 dark:bg-black/30 border border-[#D4C8E8]/40 dark:border-white/5 rounded-full px-4 py-1.5">{filtered.length} torneos encontrados</span>
              <div className="flex gap-1">
                <button onClick={()=>setViewMode('grid')}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${viewMode==='grid'?'bg-purple-mid text-white border-purple-mid':'border-[#D4C8E8]/40 dark:border-white/10 text-[#7A6B99] dark:text-text-muted hover:border-purple-mid'}`}>
                  <LayoutGrid size={15} />
                </button>
                <button onClick={()=>setViewMode('list')}
                  className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${viewMode==='list'?'bg-purple-mid text-white border-purple-mid':'border-[#D4C8E8]/40 dark:border-white/10 text-[#7A6B99] dark:text-text-muted hover:border-purple-mid'}`}>
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Torneo cards grid */}
          <div className="grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-5 mb-10">
            {paged.map((t,i)=>(
              <motion.div key={t.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05,duration:0.3}}>
                <TorneoCard torneo={t} onClick={() => setModalTournament(t)} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                className="w-[38px] h-[38px] rounded-lg border border-[#D4C8E8]/40 dark:border-white/10 bg-[#E8DFF5]/70 dark:bg-black/30 text-[#3D1A6B] dark:text-gray-light text-sm font-semibold disabled:opacity-40 disabled:cursor-default hover:border-purple-mid hover:text-purple-mid transition-all" aria-label="Anterior">«</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>setPage(p)}
                  className={`w-[38px] h-[38px] rounded-lg border text-sm font-semibold transition-all ${p===page?'bg-purple-mid text-white border-purple-mid shadow-lg shadow-purple-mid/30':'border-[#D4C8E8]/40 dark:border-white/10 bg-[#E8DFF5]/70 dark:bg-black/30 text-[#3D1A6B] dark:text-gray-light hover:border-purple-mid hover:text-purple-mid'}`}>{p}</button>
              ))}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="w-[38px] h-[38px] rounded-lg border border-[#D4C8E8]/40 dark:border-white/10 bg-[#E8DFF5]/70 dark:bg-black/30 text-[#3D1A6B] dark:text-gray-light text-sm font-semibold disabled:opacity-40 disabled:cursor-default hover:border-purple-mid hover:text-purple-mid transition-all" aria-label="Siguiente">»</button>
            </div>
          )}

          {/* Modal flotante con tabs */}
          {modalTournament && (() => {
            const t = modalTournament
  const imgSrc = t.imagen || `/images/fondo-${((Number(t.id) - 1) % 6) + 1}.png`
            const isClosed = t.estado === 'closed'
            const isUpcoming = t.estado === 'upcoming'
            const isLive = t.estado === 'live'
            // Reset tab when opening different tournament
            if (!['info','equipos','calendario','tabla','llaves'].includes(modalTab)) setModalTab('info')

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

            return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModalTournament(null)}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <div className="relative max-w-2xl w-full bg-white dark:bg-[#1D0E33] rounded-2xl overflow-hidden border border-[#D4C8E8]/40 dark:border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={() => setModalTournament(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold transition-colors">✕</button>
                {/* Header con cancha */}
                <div className="relative h-[200px] overflow-hidden">
                  <img src="/cancha-juego.png" alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                  <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(at 50% 40%, rgb(200, 133, 26) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
                    <span className="inline-block rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 mb-2 bg-white/15 text-white border border-white/20 backdrop-blur-sm">
                      {t.estado === 'live' ? 'En curso' : t.estado === 'upcoming' ? 'Próximo' : 'Finalizado'}
                    </span>
                    <span className="block text-[10px] tracking-[1.2px] text-gold font-bold uppercase mb-1">{t.tag}</span>
                    <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase text-white leading-tight">{t.nombre}</h2>
                    <p className="text-[12px] text-white/60 mt-1">{t.categoria} — {t.semestre}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 text-[10px] font-bold transition-all flex-shrink-0">
                    <Download size={12} /> Reglamento
                  </button>
                </div>
                </div>

                {/* Tabs como DetalleTorneo */}
                <div className="flex border-b border-[#D4C8E8]/40 dark:border-white/10">
                  <button onClick={() => setModalTab('info')}
                    className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'info' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Información</button>
                  <button onClick={() => setModalTab('equipos')}
                    className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'equipos' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Equipos</button>
                  <button onClick={() => setModalTab('calendario')}
                    className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'calendario' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Calendario</button>
                  <button onClick={() => setModalTab('tabla')}
                    className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'tabla' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Tabla</button>
                  {!isUpcoming && <button onClick={() => setModalTab('llaves')}
                    className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${modalTab === 'llaves' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Llaves</button>}
                </div>

                {/* Content estandarizado como DetalleTorneo */}
                <div className="p-5 max-h-[50vh] overflow-y-auto">
                  {modalTab === 'info' && (
                    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                      {[
                        { label: 'Formato', value: 'Todos contra todos + Eliminatorias' },
                        { label: 'Categoría', value: t.categoria },
                        { label: 'Duración', value: t.fecha },
                        { label: 'Equipos', value: `${t.equipos} equipos — ${t.jugadores} jugadores` },
                        { label: 'Canchas', value: `${t.canchas} canchas` },
                        { label: 'Estado', value: t.estado === 'live' ? '🔴 En curso' : t.estado === 'upcoming' ? '📅 Próximo' : '✅ Finalizado' },
                      ].map((info, i) => (
                        <div key={i} className="bg-[#E8DFF5]/50 dark:bg-white/5 border border-[#D4C8E8]/40 dark:border-white/10 rounded-xl p-4">
                          <p className="text-[10px] text-[#7A6B99] dark:text-text-faint uppercase tracking-[.4px] font-semibold mb-1">{info.label}</p>
                          <p className="text-sm font-semibold text-[#3D1A6B] dark:text-white">{info.value}</p>
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

                  {modalTab === 'calendario' && (
                    <div className="space-y-3">
                      <p className="text-xs text-[#7A6B99] dark:text-text-muted mb-4">Calendario de partidos del torneo</p>
                      {[
                        { dia:'24', mes:'MAY', eq1:'Tigres FC', emoji1:'🐯', eq2:'IA Warriors', emoji2:'🦁', hora:'8:00 PM', lugar:'Cancha Principal Sede Norte', resultado:'3 - 1' },
                        { dia:'24', mes:'MAY', eq1:'Code United', emoji1:'💻', eq2:'Sistemas FC', emoji2:'⚙️', hora:'9:30 PM', lugar:'Cancha Principal Sede Norte', resultado:'2 - 2' },
                        { dia:'25', mes:'MAY', eq1:'Dragones FC', emoji1:'🐉', eq2:'Los Bits', emoji2:'⚡', hora:'5:00 PM', lugar:'Auditorio Principal Sede Norte' },
                        { dia:'28', mes:'MAY', eq1:'Titanes', emoji1:'🛡️', eq2:'Fénix', emoji2:'🔥', hora:'7:00 PM', lugar:'Cancha Principal Sede Norte 2' },
                        { dia:'30', mes:'MAY', eq1:'Tigres FC', emoji1:'🐯', eq2:'Code United', emoji2:'💻', hora:'8:00 PM', lugar:'Cancha Principal Sede Norte' },
                      ].map((m, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#E8DFF5]/50 dark:bg-white/5 border border-[#D4C8E8]/40 dark:border-white/10 hover:border-gold/30 transition-all">
                          <div className="w-[44px] text-center flex-shrink-0">
                            <b className="block font-[family-name:var(--font-display)] text-base text-[#3D1A6B] dark:text-white">{m.dia}</b>
                            <span className="text-[8px] text-[#7A6B99] dark:text-text-faint uppercase">{m.mes}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-[12.5px]">
                              <span>{m.emoji1}</span>
                              <span className="font-semibold text-[#3D1A6B] dark:text-white truncate">{m.eq1}</span>
                              <span className="text-[9px] text-[#7A6B99] dark:text-text-faint font-bold">VS</span>
                              <span className="font-semibold text-[#3D1A6B] dark:text-white truncate">{m.eq2}</span>
                              <span>{m.emoji2}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-[#7A6B99] dark:text-white/50 mt-0.5">
                              <Clock size={10} /> {m.hora}
                              <MapPin size={10} /> {m.lugar.slice(0, 18)}...
                            </div>
                          </div>
                          {m.resultado && <span className="text-sm font-bold text-gold">{m.resultado}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {modalTab === 'tabla' && !isUpcoming && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="text-[10px] text-[#7A6B99] dark:text-text-faint uppercase tracking-[.5px] border-b border-[#D4C8E8]/40 dark:border-white/10">
                          <th className="text-left py-3 px-4">#</th><th className="text-left py-3 px-4">Equipo</th><th className="text-center py-3 px-3">PJ</th><th className="text-center py-3 px-3">G</th><th className="text-center py-3 px-3">E</th><th className="text-center py-3 px-3">P</th><th className="text-center py-3 px-3">DG</th><th className="text-right py-3 px-4">Pts</th>
                        </tr></thead>
                        <tbody>
                          {[
                            { eq: 'Tigres FC', emoji: '🐯', pj: 12, g: 9, e: 2, p: 1, dg: 18, pts: 29 },
                            { eq: 'Code United', emoji: '🔵', pj: 12, g: 8, e: 2, p: 2, dg: 12, pts: 26 },
                            { eq: 'IA Warriors', emoji: '🦁', pj: 12, g: 7, e: 3, p: 2, dg: 8, pts: 24 },
                            { eq: 'Sistemas FC', emoji: '⚙️', pj: 12, g: 6, e: 2, p: 4, dg: 4, pts: 20 },
                          ].map((r, i) => (
                            <tr key={i} className="border-t border-[#D4C8E8]/40 dark:border-white/10 hover:bg-white/5">
                              <td className="py-3 px-4 text-[#7A6B99] dark:text-text-muted w-8">{i + 1}</td>
                              <td className="py-3 px-4 font-semibold text-[#3D1A6B] dark:text-white">{i === 0 ? '🏆 ' : ''}{r.emoji} {r.eq}</td>
                              <td className="py-3 px-3 text-center text-[#7A6B99] dark:text-white/60">{r.pj}</td>
                              <td className="py-3 px-3 text-center text-green-500">{r.g}</td>
                              <td className="py-3 px-3 text-center text-yellow-400">{r.e}</td>
                              <td className="py-3 px-3 text-center text-red-400">{r.p}</td>
                              <td className="py-3 px-3 text-center text-green-400">+{r.dg}</td>
                              <td className="py-3 px-4 text-right font-bold text-gold">{r.pts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {modalTab === 'llaves' && !isUpcoming && (
                    <div>
                      <p className="text-sm text-[#7A6B99] dark:text-text-muted mb-4">Fase eliminatoria del torneo</p>
                      <div className="bg-[#E8DFF5]/50 dark:bg-white/5 border border-[#D4C8E8]/40 dark:border-white/10 rounded-2xl p-6 overflow-x-auto">
                        <div className="flex items-center justify-center gap-8 min-w-[500px]">
                          <div className="space-y-4">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-sm font-semibold text-[#3D1A6B] dark:text-white">🐯 Tigres FC <span className="text-gold">2</span></span></div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-sm font-semibold text-[#3D1A6B] dark:text-white">⚙️ Sistemas FC <span className="text-gold">1</span></span></div>
                            <div className="text-center text-[10px] text-[#7A6B99] dark:text-text-faint uppercase tracking-wider mt-1">Cuartos</div>
                          </div>
                          <div className="text-gold text-2xl">⟶</div>
                          <div className="space-y-4">
                            <div className="p-3 rounded-xl border border-gold/30 bg-gold/10"><span className="text-sm font-semibold text-[#3D1A6B] dark:text-white">🐯 Tigres FC <span className="text-gold">1</span></span></div>
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-sm font-semibold text-[#3D1A6B] dark:text-white">🔵 Code United <span className="text-gold">0</span></span></div>
                            <div className="text-center text-[10px] text-[#7A6B99] dark:text-text-faint uppercase tracking-wider mt-1">Semifinal</div>
                          </div>
                          <div className="text-gold text-2xl">⟶</div>
                          <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-gradient-to-b from-gold/20 to-gold/5 border border-gold/40"><span className="text-sm font-semibold text-[#3D1A6B] dark:text-white">🏆🐯 Tigres FC <span className="text-gold">3</span></span></div>
                            <div className="text-center text-[10px] text-[#7A6B99] dark:text-text-faint uppercase tracking-wider mt-1">Final</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )
          })()}
        </div>
      </section>
    </>
  )
}

export default function TorneosPublic() {
  const location = useLocation()
  const isPrivate = location.pathname.startsWith('/app')

  if (isPrivate) {
    return (
      <DashboardLayout title="Torneos y Equipos">
        <TorneosContent />
      </DashboardLayout>
    )
  }

  return (
    <div className="min-h-screen bg-[#E5ECE9] dark:bg-[#190D2B]">
      <Navbar />
      <TorneosContent />
      <Footer />
    </div>
  )
}

function TorneoCard({ torneo: t, onClick }: { torneo: Torneo; onClick: () => void }) {
  const badgeText = t.estado === 'live' ? 'En curso' : t.estado === 'upcoming' ? 'Próximo' : 'Finalizado'
  const badgeStyle = t.estado === 'live' ? 'bg-purple-mid text-white'
    : t.estado === 'upcoming' ? 'bg-gold/20 text-gold border border-gold/40'
    : 'bg-white/15 text-white border border-white/20 backdrop-blur-sm'
            const imgSrc = t.imagen || `/images/fondo-${((Number(t.id) - 1) % 6) + 1}.png`

  return (
    <button onClick={onClick} className="block group w-full text-left">
      <div className="relative overflow-hidden rounded-2xl border border-[#D4C8E8]/40 dark:border-white/5 bg-[#E8DFF5]/70 dark:bg-black/30 transition-all duration-300 hover:border-[#D4AF37]/60 hover:shadow-[0_0_25px_rgba(212,175,55,0.12)]">
        <div className="absolute inset-0">
          <img src={imgSrc} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/50 to-transparent" />
        </div>
        {/* Overlay hover dorado sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative h-full min-h-[280px] flex flex-col justify-between p-5 z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-block rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 ${badgeStyle}`}>{badgeText}</span>
              {t.estado === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />}
            </div>
            <span className="block text-[10px] tracking-[1.2px] text-gold font-bold uppercase mb-1">{t.tag}</span>
            <h3 className="font-[family-name:var(--font-display)] text-xl uppercase text-white leading-tight">{t.nombre}</h3>
            <p className="text-[12px] text-white/60 mt-1">Ingeniería de Sistemas</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] text-white/50 mb-3">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {t.fecha}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-white/60"><strong className="text-white/90">{t.equipos}</strong> Equipos</span>
                <span className="text-[11px] text-white/60"><strong className="text-white/90">{t.jugadores}</strong> Jugadores</span>
                <span className="text-[11px] text-white/60"><strong className="text-white/90">{t.canchas}</strong> Canchas</span>
              </div>
              <span className="text-[11px] font-bold text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full group-hover:bg-gold/20 group-hover:border-gold/60 transition-all duration-300">
                {t.estado === 'closed' ? 'Ver resumen' : 'Ver detalles'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}



