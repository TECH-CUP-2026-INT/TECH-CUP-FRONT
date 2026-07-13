import { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Search, RefreshCw, LayoutGrid, List } from 'lucide-react'
import { ThreeDCarousel } from '@/components/ui/three-d-carousel'
import { torneos, type Torneo } from '@/data/torneos'

const PAGE_SIZE = 6

function TorneosContent() {
  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterSemestre, setFilterSemestre] = useState('todos')
  const [filterCategoria, setFilterCategoria] = useState('todos')
  const [filterSearch, setFilterSearch] = useState('')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [modalTournament, setModalTournament] = useState<Torneo | null>(null)

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
          <div className="text-center max-w-[700px] mx-auto">
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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-purple-mid/15 dark:bg-purple-mid/20 blur-[180px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gold/15 dark:bg-gold/20 blur-[150px]" />
        </div>

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
            const [tab, setTab] = useState('info')
            const t = modalTournament
            const imgSrc = `/images/fondo-${((t.id - 1) % 6) + 1}.png`
            const isClosed = t.estado === 'closed'
            const isUpcoming = t.estado === 'upcoming'
            const isLive = t.estado === 'live'

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
              <div className="relative max-w-2xl w-full bg-white dark:bg-[#1a1a24] rounded-2xl overflow-hidden border border-[#D4C8E8]/40 dark:border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={() => setModalTournament(null)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-gold transition-colors">✕</button>
                {/* Header image */}
                <div className="relative h-[200px] overflow-hidden">
                  <img src={imgSrc} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-[10px] tracking-[1.2px] text-gold font-bold uppercase">{t.tag}</span>
                    <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase text-white leading-tight mt-1">{t.nombre}</h2>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#D4C8E8]/40 dark:border-white/10">
                  <button onClick={() => setTab('info')} className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${tab === 'info' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Info</button>
                  {isClosed && <button onClick={() => setTab('llaves')} className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${tab === 'llaves' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Llaves</button>}
                  {!isUpcoming && <button onClick={() => setTab('tablero')} className={`flex-1 py-3 text-[12px] font-bold uppercase tracking-[1px] transition-all ${tab === 'tablero' ? 'text-gold border-b-2 border-gold' : 'text-[#7A6B99] dark:text-white/50 hover:text-gold'}`}>Tablero</button>}
                </div>

                {/* Content */}
                <div className="p-5 max-h-[50vh] overflow-y-auto">
                  {tab === 'info' && (
                    <div className="space-y-4">
                      <p className="text-[13px] text-[#7A6B99] dark:text-white/60">Ingeniería de Sistemas</p>
                      <div className="flex items-center gap-2 text-[13px] text-[#7A6B99] dark:text-white/50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        {t.fecha}
                      </div>
                      <div className="flex gap-6 pt-4 border-t border-[#D4C8E8]/40 dark:border-white/10">
                        <div><span className="text-[11px] text-[#7A6B99] dark:text-white/50">Equipos</span><p className="text-lg font-bold text-[#3D1A6B] dark:text-white">{t.equipos}</p></div>
                        <div><span className="text-[11px] text-[#7A6B99] dark:text-white/50">Jugadores</span><p className="text-lg font-bold text-[#3D1A6B] dark:text-white">{t.jugadores}</p></div>
                        <div><span className="text-[11px] text-[#7A6B99] dark:text-white/50">Canchas</span><p className="text-lg font-bold text-[#3D1A6B] dark:text-white">{t.canchas}</p></div>
                      </div>
                      {isUpcoming && <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-center"><p className="text-sm text-gold font-bold">📅 Próximamente — Inscripciones abiertas</p></div>}
                      {isLive && <div className="p-4 rounded-xl bg-purple-mid/20 border border-purple-mid/40 text-center"><p className="text-sm text-purple-mid font-bold animate-pulse">🔴 En curso — ¡Seguí la acción!</p></div>}
                    </div>
                  )}

                  {tab === 'llaves' && isClosed && (
                    <div className="space-y-5">
                      {/* Cuartos */}
                      <div><h4 className="text-[11px] font-bold uppercase tracking-[1.2px] text-gold mb-3">Cuartos de final</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            [equiposList[0], equiposList[1], '2 - 1', equiposList[0]],
                            [equiposList[2], equiposList[3], '3 - 0', equiposList[2]],
                            [equiposList[4], equiposList[5], '2 - 2', equiposList[4]],
                            [equiposList[6], equiposList[7], '1 - 0', equiposList[6]],
                          ].map(([eq1, eq2, res, winner], i) => (
                            <div key={i} className="p-3 rounded-xl bg-[#E8DFF5]/50 dark:bg-white/5 border border-[#D4C8E8]/40 dark:border-white/10">
                              <div className={`flex items-center gap-2 ${winner === eq1 ? 'opacity-100' : 'opacity-60'}`}>
                                <span className="text-lg">{eq1.emoji}</span>
                                <span className="text-xs font-semibold flex-1 text-[#3D1A6B] dark:text-white">{eq1.nom}</span>
                                <span className="text-xs font-bold text-gold">{res.split(' - ')[0]}</span>
                              </div>
                              <div className="flex items-center justify-center text-[8px] text-[#7A6B99] dark:text-text-faint uppercase py-1">VS</div>
                              <div className={`flex items-center gap-2 ${winner === eq2 ? 'opacity-100' : 'opacity-60'}`}>
                                <span className="text-lg">{eq2.emoji}</span>
                                <span className="text-xs font-semibold flex-1 text-[#3D1A6B] dark:text-white">{eq2.nom}</span>
                                <span className="text-xs font-bold text-gold">{res.split(' - ')[1]}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Semifinal */}
                      <div><h4 className="text-[11px] font-bold uppercase tracking-[1.2px] text-gold mb-3">Semifinales</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            [equiposList[0], equiposList[2], '2 - 1', equiposList[0]],
                            [equiposList[4], equiposList[6], '3 - 2', equiposList[6]],
                          ].map(([eq1, eq2, res, winner], i) => (
                            <div key={i} className="p-3 rounded-xl bg-[#E8DFF5]/50 dark:bg-white/5 border border-[#D4C8E8]/40 dark:border-white/10">
                              <div className={`flex items-center gap-2 ${winner === eq1 ? 'opacity-100' : 'opacity-60'}`}>
                                <span className="text-lg">{eq1.emoji}</span>
                                <span className="text-xs font-semibold flex-1 text-[#3D1A6B] dark:text-white">{eq1.nom}</span>
                                <span className="text-xs font-bold text-gold">{res.split(' - ')[0]}</span>
                              </div>
                              <div className="flex items-center justify-center text-[8px] text-text-faint uppercase py-1">VS</div>
                              <div className={`flex items-center gap-2 ${winner === eq2 ? 'opacity-100' : 'opacity-60'}`}>
                                <span className="text-lg">{eq2.emoji}</span>
                                <span className="text-xs font-semibold flex-1 text-[#3D1A6B] dark:text-white">{eq2.nom}</span>
                                <span className="text-xs font-bold text-gold">{res.split(' - ')[1]}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Final */}
                      <div><h4 className="text-[11px] font-bold uppercase tracking-[1.2px] text-gold mb-3">Final</h4>
                        <div className="p-4 rounded-xl bg-gold/10 border border-gold/30">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{equiposList[0].emoji}</span>
                            <span className="text-sm font-bold flex-1 text-[#3D1A6B] dark:text-white">Tigres FC</span>
                            <span className="text-lg font-bold text-gold">🏆 3</span>
                          </div>
                          <div className="flex items-center justify-center text-[10px] text-gold uppercase font-bold py-1">VS</div>
                          <div className="flex items-center gap-3 opacity-60">
                            <span className="text-2xl">{equiposList[6].emoji}</span>
                            <span className="text-sm font-bold flex-1 text-[#3D1A6B] dark:text-white">Titanes</span>
                            <span className="text-lg font-bold text-text-muted">1</span>
                          </div>
                          <div className="mt-3 text-center"><span className="text-[10px] text-gold font-bold uppercase bg-gold/20 px-3 py-1 rounded-full">🏆 Campeón: Tigres FC</span></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {tab === 'tablero' && !isUpcoming && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1px] text-[#7A6B99] dark:text-text-faint pb-2 border-b border-[#D4C8E8]/40 dark:border-white/10">
                        <span className="w-6 text-center">#</span>
                        <span className="flex-1">Equipo</span>
                        <span className="w-8 text-center">PJ</span>
                        <span className="w-8 text-center">DG</span>
                        <span className="w-8 text-center">PTS</span>
                      </div>
                      {[
                        { pos: 1, nom: 'Tigres FC', emoji: '🐯', color: '#EF4444', pj: 12, dg: 18, pts: 28 },
                        { pos: 2, nom: 'Code United', emoji: '🔵', color: '#3B82F6', pj: 12, dg: 12, pts: 25 },
                        { pos: 3, nom: 'IA Warriors', emoji: '🦁', color: '#8B5CF6', pj: 12, dg: 8, pts: 24 },
                        { pos: 4, nom: 'Sistemas FC', emoji: '⚙️', color: '#22C55E', pj: 12, dg: 4, pts: 20 },
                        { pos: 5, nom: 'Dragones FC', emoji: '🐉', color: '#F97316', pj: 12, dg: -2, pts: 16 },
                        { pos: 6, nom: 'Los Bits', emoji: '⚡', color: '#F5A623', pj: 12, dg: -6, pts: 12 },
                        { pos: 7, nom: 'Titanes', emoji: '🛡️', color: '#14B8A6', pj: 12, dg: -12, pts: 8 },
                        { pos: 8, nom: 'Fénix', emoji: '🔥', color: '#EC4899', pj: 12, dg: -22, pts: 4 },
                      ].map((eq, i) => (
                        <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl ${i < 4 ? 'bg-[#E8DFF5]/50 dark:bg-white/5' : ''} border border-[#D4C8E8]/40 dark:border-white/10`}>
                          <span className="w-6 text-center text-[11px] font-bold text-[#7A6B99] dark:text-text-faint">{eq.pos}</span>
                          <span className="text-base">{eq.emoji}</span>
                          <span className="flex-1 text-xs font-semibold text-[#3D1A6B] dark:text-white truncate">{eq.nom}</span>
                          <span className="w-8 text-center text-[11px] text-[#7A6B99] dark:text-white/60">{eq.pj}</span>
                          <span className="w-8 text-center text-[11px] font-mono" style={{ color: eq.dg >= 0 ? '#22C55E' : '#EF4444' }}>{eq.dg > 0 ? '+' : ''}{eq.dg}</span>
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
        </div>
      </section>
    </>
  )
}

export default function TorneosPublic() {
  const location = useLocation()
  const isPrivate = location.pathname.startsWith('/app')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isPrivate) {
    return (
      <div className="min-h-screen bg-black flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <AppTopbar title="Torneos y Equipos" onMenuClick={() => setSidebarOpen(true)} />
          <TorneosContent />
          <Footer />
        </div>
      </div>
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
  const imgSrc = `/images/fondo-${((t.id - 1) % 6) + 1}.png`

  return (
    <button onClick={onClick} className="block group w-full text-left">
      <div className="relative overflow-hidden rounded-2xl border border-[#D4C8E8]/40 dark:border-white/5 bg-[#E8DFF5]/70 dark:bg-black/30">
        <div className="absolute inset-0">
          <img src={imgSrc} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/50 to-transparent" />
        </div>
        <div className="relative h-full min-h-[280px] flex flex-col justify-between p-5 z-10">
          <div>
            <span className={`inline-block rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 mb-2 ${badgeStyle}`}>{badgeText}</span>
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
              <span className="text-[11px] font-bold text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full group-hover:bg-gold/20 transition-colors">
                {t.estado === 'closed' ? 'Ver resumen' : 'Ver detalles'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}



