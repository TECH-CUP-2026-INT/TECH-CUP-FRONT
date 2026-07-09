import { useState, useMemo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Search, RefreshCw, LayoutGrid, List } from 'lucide-react'
import { torneos, type Torneo } from '@/data/torneos'

const PAGE_SIZE = 6

function TorneosContent() {
  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterSemestre, setFilterSemestre] = useState('todos')
  const [filterCategoria, setFilterCategoria] = useState('todos')
  const [filterSearch, setFilterSearch] = useState('')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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
      <AuroraBackground>
        <div className="relative w-full max-w-[1280px] mx-auto px-8 pt-[160px] pb-[100px] overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{backgroundImage:'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)',backgroundSize:'24px 24px',maskImage:'radial-gradient(600px 500px at 50% 30%, black 10%, transparent 70%)',WebkitMaskImage:'radial-gradient(600px 500px at 50% 30%, black 10%, transparent 70%)'}} />
          <div className="relative z-[2] text-center max-w-[700px] mx-auto">
            <motion.span initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[1.6px] uppercase text-gold bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-full mb-[22px]"><span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> Explora la competencia</motion.span>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="font-[family-name:var(--font-display)] font-bold text-[clamp(42px,6vw,72px)] leading-[.92] tracking-[.5px] uppercase mb-4">Torneos <span className="text-gold">y Equipos</span></motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="text-base leading-relaxed text-text-muted max-w-[560px] mx-auto">Descubre los torneos disponibles, explora los equipos inscritos y sé parte de la competencia más emocionante de Ingeniería de Sistemas.</motion.p>
          </div>
        </div>
      </AuroraBackground>

      <section className="py-14 pb-[100px] relative">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-mid/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[-5%] w-[350px] h-[350px] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-8 relative">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.6}} className="grid grid-cols-[repeat(3,160px)_1fr_auto] gap-3 items-end mb-[30px] max-lg:grid-cols-2 max-sm:grid-cols-1 bg-surface/50 backdrop-blur-sm border border-border/60 rounded-2xl p-5">
            <div><label className="block text-[11px] text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Estado</label>
              <Select value={filterEstado} onValueChange={v=>{setFilterEstado(v);setPage(1)}}><SelectTrigger className="bg-surface border-border text-white rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-surface border-border text-white">
                  {[{value:'todos',label:'Todos'},{value:'live',label:'En curso'},{value:'upcoming',label:'Próximo'},{value:'closed',label:'Finalizado'}].map(e=><SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                </SelectContent></Select></div>
            <div><label className="block text-[11px] text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Semestre</label>
              <Select value={filterSemestre} onValueChange={v=>{setFilterSemestre(v);setPage(1)}}><SelectTrigger className="bg-surface border-border text-white rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-surface border-border text-white">
                  <SelectItem value="todos">Todos</SelectItem>
                  {semestres.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent></Select></div>
            <div><label className="block text-[11px] text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Categoría</label>
              <Select value={filterCategoria} onValueChange={v=>{setFilterCategoria(v);setPage(1)}}><SelectTrigger className="bg-surface border-border text-white rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-surface border-border text-white">
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="Fútbol 11">Fútbol 11</SelectItem>
                  <SelectItem value="Futsal">Futsal</SelectItem>
                </SelectContent></Select></div>
            <div><label className="block text-[11px] text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Buscar</label>
              <div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
                <input type="text" placeholder="Ej. TechCup 2024" value={filterSearch} onChange={e=>{setFilterSearch(e.target.value);setPage(1)}} className="w-full bg-surface border border-border text-white rounded-lg py-2.5 pl-9 pr-3 text-[13.5px] outline-none focus:border-purple-mid placeholder:text-text-faint" /></div></div>
            <Button variant="outline" size="sm" onClick={clearFilters} className="border-gold text-gold rounded-full hover:bg-gold/10 self-end mb-0.5"><RefreshCw size={14} /> Limpiar</Button>
          </motion.div>

          <div className="flex items-center justify-between mb-[22px] flex-wrap gap-3">
            <h2 className="text-[17px] font-semibold">Todos los torneos</h2>
            <div className="flex items-center gap-3.5 text-[13px] text-text-muted">
              <span className="bg-surface/50 border border-border/60 rounded-full px-4 py-1.5">{filtered.length} torneos encontrados</span>
              <div className="flex gap-1">
                <button onClick={()=>setViewMode('grid')} className={`w-8 h-8 rounded-lg border border-border flex items-center justify-center transition-colors ${viewMode==='grid'?'bg-purple-mid text-white border-purple-mid':'bg-surface text-text-muted hover:border-purple-mid'}`}><LayoutGrid size={15} /></button>
                <button onClick={()=>setViewMode('list')} className={`w-8 h-8 rounded-lg border border-border flex items-center justify-center transition-colors ${viewMode==='list'?'bg-purple-mid text-white border-purple-mid':'bg-surface text-text-muted hover:border-purple-mid'}`}><List size={15} /></button>
              </div>
            </div>
          </div>

          <div className={viewMode==='grid'?'grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-5 mb-10':'flex flex-col gap-3 mb-10'}>
            {paged.map((t,i)=>(
              <motion.div key={t.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.05,duration:0.3}}>
                <TorneoCard torneo={t} listMode={viewMode==='list'} />
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="w-[38px] h-[38px] rounded-lg border border-border bg-surface text-gray-light text-sm font-semibold disabled:opacity-40 disabled:cursor-default hover:border-purple-mid hover:text-purple-mid transition-all" aria-label="Anterior">«</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
                <button key={p} onClick={()=>setPage(p)} className={`w-[38px] h-[38px] rounded-lg border text-sm font-semibold transition-all ${p===page?'bg-purple-mid text-white border-purple-mid shadow-lg shadow-purple-mid/30':'border-border bg-surface text-gray-light hover:border-purple-mid hover:text-purple-mid'}`}>{p}</button>
              ))}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="w-[38px] h-[38px] rounded-lg border border-border bg-surface text-gray-light text-sm font-semibold disabled:opacity-40 disabled:cursor-default hover:border-purple-mid hover:text-purple-mid transition-all" aria-label="Siguiente">»</button>
            </div>
          )}
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
    <div className="min-h-screen bg-black">
      <Navbar />
      <TorneosContent />
      <Footer />
    </div>
  )
}

function TorneoCard({ torneo: t, listMode }: { torneo: Torneo; listMode: boolean }) {
  const badgeClass = t.estado === 'live' ? 'bg-purple-mid text-white' 
    : t.estado === 'upcoming' ? 'bg-gold/15 text-gold border border-gold/50' 
    : 'bg-white/10 text-text-muted border border-white/15'
  const badgeText = t.estado === 'live' ? 'En curso' : t.estado === 'upcoming' ? 'Próximo' : 'Finalizado'
  const mediaBg = t.estado === 'closed' ? 'bg-gradient-to-br from-[#2a2a33] to-[#16161c]' : 'bg-gradient-to-br from-purple-deep to-[#180d29]'

  return (
    <SpotlightCard accent={t.estado === 'live' ? 'gold' : t.estado === 'upcoming' ? 'purple' : 'gold'} className={`bg-surface border border-border rounded-2xl ${listMode ? 'flex' : ''}`}>
      {listMode ? (
        <><div className={`w-[200px] min-h-[150px] flex-shrink-0 flex items-center justify-center relative ${mediaBg} rounded-l-2xl`}>
            <Badge className={`absolute top-3.5 left-3.5 rounded-full text-[11px] font-bold uppercase tracking-[.4px] px-3 py-1 h-auto z-10 ${badgeClass}`}>{badgeText}</Badge>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.4" className="opacity-90"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4z"/></svg>
          </div>
          <div className="p-5 flex-1">
            <span className="text-[10.5px] tracking-[1px] text-text-faint font-bold uppercase">{t.tag}</span>
            <h3 className="font-[family-name:var(--font-display)] text-xl uppercase mt-1 mb-1">{t.nombre}</h3>
            <p className="text-xs text-text-muted mb-2">Ingeniería de Sistemas</p>
            <div className="text-xs text-text-muted flex items-center gap-1.5 mb-3">📅 {t.fecha}</div>
            <div className="flex gap-4 mb-4 flex-wrap">
              <span className="text-xs text-text-muted">👤 <b className="text-white">{t.equipos}</b> equipos</span>
              <span className="text-xs text-text-muted">👥 <b className="text-white">{t.jugadores}</b> jugadores</span>
              <span className="text-xs text-text-muted">🛡 <b className="text-white">{t.canchas}</b> canchas</span>
            </div>
            <Button className={`rounded-full text-xs py-2 h-auto ${t.estado === 'closed' ? 'bg-transparent text-gold border border-gold hover:bg-gold/10' : 'bg-gold text-[#1A1206] hover:bg-gold-dark'}`}>{t.estado === 'closed' ? 'Ver resumen' : 'Ver detalles'}</Button>
          </div></>
      ) : (
        <div><div className={`h-[150px] flex items-center justify-center relative ${mediaBg} rounded-t-2xl overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-black/20" />
            <Badge className={`absolute top-3.5 left-3.5 rounded-full text-[11px] font-bold uppercase tracking-[.4px] px-3 py-1 h-auto z-10 ${badgeClass}`}>{badgeText}</Badge>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.4" className="opacity-90 relative z-10"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4z"/></svg>
          </div>
          <div className="p-5">
            <span className="text-[10.5px] tracking-[1px] text-text-faint font-bold uppercase">{t.tag}</span>
            <h3 className="font-[family-name:var(--font-display)] text-xl uppercase mt-1 mb-1">{t.nombre}</h3>
            <p className="text-xs text-text-muted mb-2">Ingeniería de Sistemas</p>
            <div className="text-xs text-text-muted flex items-center gap-1.5 mb-3">📅 {t.fecha}</div>
            <div className="flex gap-4 mb-4 flex-wrap">
              <span className="text-xs text-text-muted">👤 <b className="text-white">{t.equipos}</b> equipos</span>
              <span className="text-xs text-text-muted">👥 <b className="text-white">{t.jugadores}</b> jugadores</span>
              <span className="text-xs text-text-muted">🛡 <b className="text-white">{t.canchas}</b> canchas</span>
            </div>
            <Button className={`rounded-full w-full text-xs py-2 h-auto ${t.estado === 'closed' ? 'bg-transparent text-gold border border-gold hover:bg-gold/10' : 'bg-gold text-[#1A1206] hover:bg-gold-dark'}`}>{t.estado === 'closed' ? 'Ver resumen' : 'Ver detalles'}</Button>
          </div></div>
      )}
    </SpotlightCard>
  )
}
