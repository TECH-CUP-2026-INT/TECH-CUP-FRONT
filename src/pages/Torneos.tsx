import { useState, useMemo } from 'react'
import Sidebar from '@/components/shared/Sidebar'
import Footer from '@/components/shared/Footer'
import Topbar from '@/components/shared/Topbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Menu, Search, RefreshCw, LayoutGrid, List } from 'lucide-react'
import { torneos, type Torneo } from '@/data/torneos'

const PAGE_SIZE = 3

export default function Torneos() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
  const estados = [
    { value:'todos', label:'Todos' },
    { value:'live', label:'En curso' },
    { value:'upcoming', label:'Próximo' },
    { value:'closed', label:'Finalizado' },
  ]

  function clearFilters() {
    setFilterEstado('todos')
    setFilterSemestre('todos')
    setFilterCategoria('todos')
    setFilterSearch('')
    setPage(1)
  }

  return (
    <div className="grid grid-cols-[260px_1fr] min-h-screen max-md:grid-cols-1">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-[18px] bg-black/85 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-white p-1.5" onClick={() => setSidebarOpen(true)} aria-label="Menú">
              <Menu size={22} />
            </button>
            <Topbar search showNotifications />
          </div>
        </header>

        <main className="p-8 pb-[60px] max-md:p-5 relative">
          {/* Background glow */}
          <div className="fixed top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-mid/10 blur-[150px] pointer-events-none" />
          <div className="fixed bottom-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-gold/10 blur-[120px] pointer-events-none" />
          
          <div className="mb-[26px]">
            <h1 className="font-[family-name:var(--font-display)] text-[38px] uppercase leading-tight mb-2">Torneos</h1>
            <p className="text-[14.5px] text-text-muted">Descubre los torneos disponibles y sé parte de la competencia.</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-[repeat(3,160px)_1fr_auto] gap-3 items-end mb-[30px] max-lg:grid-cols-2 max-sm:grid-cols-1">
            <div>
              <label className="block text-[11px] text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Estado</label>
              <Select value={filterEstado} onValueChange={v => { setFilterEstado(v); setPage(1) }}>
                <SelectTrigger className="bg-surface border-border text-white rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-surface border-border text-white">
                  {estados.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[11px] text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Semestre</label>
              <Select value={filterSemestre} onValueChange={v => { setFilterSemestre(v); setPage(1) }}>
                <SelectTrigger className="bg-surface border-border text-white rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-surface border-border text-white">
                  <SelectItem value="todos">Todos</SelectItem>
                  {semestres.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[11px] text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Categoría</label>
              <Select value={filterCategoria} onValueChange={v => { setFilterCategoria(v); setPage(1) }}>
                <SelectTrigger className="bg-surface border-border text-white rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-surface border-border text-white">
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="Fútbol 11">Fútbol 11</SelectItem>
                  <SelectItem value="Futsal">Futsal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <label className="block text-[11px] text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Buscar por nombre</label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
                <input
                  type="text"
                  placeholder="Ej. TechCup 2024"
                  value={filterSearch}
                  onChange={e => { setFilterSearch(e.target.value); setPage(1) }}
                  className="w-full bg-surface border border-border text-white rounded-lg py-2.5 pl-9 pr-3 text-[13.5px] outline-none focus:border-purple-mid placeholder:text-text-faint"
                />
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters} className="border-gold text-gold rounded-full hover:bg-gold/10 self-end mb-0.5">
              <RefreshCw size={14} /> Limpiar filtros
            </Button>
          </div>

          {/* List header */}
          <div className="flex items-center justify-between mb-[18px] flex-wrap gap-3">
            <h2 className="text-[17px] font-semibold">Todos los torneos</h2>
            <div className="flex items-center gap-3.5 text-[13px] text-text-muted">
              <span>{filtered.length} torneos encontrados</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-8 h-8 rounded-lg border border-border flex items-center justify-center ${viewMode === 'grid' ? 'bg-purple-mid text-white border-purple-mid' : 'bg-surface text-text-muted'}`}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-8 h-8 rounded-lg border border-border flex items-center justify-center ${viewMode === 'list' ? 'bg-purple-mid text-white border-purple-mid' : 'bg-surface text-text-muted'}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Grid / List */}
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1 gap-[22px] mb-10'
            : 'flex flex-col gap-3 mb-10'
          }>
            {paged.map(t => (
              <TorneoCard key={t.id} torneo={t} listMode={viewMode === 'list'} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-[34px] h-[34px] rounded-lg border border-border bg-surface text-gray-light text-[13px] font-semibold disabled:opacity-40 disabled:cursor-default hover:border-purple-mid transition-colors"
                aria-label="Anterior"
              >«</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-[34px] h-[34px] rounded-lg border text-[13px] font-semibold transition-colors ${
                    p === page
                      ? 'bg-purple-mid text-white border-purple-mid'
                      : 'border-border bg-surface text-gray-light hover:border-purple-mid'
                  }`}
                >{p}</button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-[34px] h-[34px] rounded-lg border border-border bg-surface text-gray-light text-[13px] font-semibold disabled:opacity-40 disabled:cursor-default hover:border-purple-mid transition-colors"
                aria-label="Siguiente"
              >»</button>
            </div>
          )}
        </main>

        <Footer />
      </div>
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
    <SpotlightCard
      accent={t.estado === 'live' ? 'gold' : t.estado === 'upcoming' ? 'purple' : 'gold'}
      className={`bg-surface border border-border rounded-2xl ${listMode ? 'flex' : ''}`}
    >
      {listMode ? (
        <>
          <div className={`w-[180px] min-h-[140px] flex-shrink-0 flex items-center justify-center relative ${mediaBg}`}>
            <Badge className={`absolute top-3.5 left-3.5 rounded-full text-[11px] font-bold uppercase tracking-[.4px] px-3 py-1 h-auto ${badgeClass}`}>
              {badgeText}
            </Badge>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.4" className="opacity-90">
              <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4z"/>
            </svg>
          </div>
          <div className="p-[18px_20px_20px] flex-1">
            <span className="text-[10.5px] tracking-[1px] text-text-faint font-bold uppercase">{t.tag}</span>
            <h3 className="font-[family-name:var(--font-display)] text-xl uppercase mt-1.5 mb-0.5">{t.nombre}</h3>
            {t.sub && <p className="text-[12.5px] text-text-muted mb-2.5">{t.sub}</p>}
            <div className="text-xs text-text-muted flex items-center gap-1.5 mb-3.5">📅 {t.fecha}</div>
            <div className="flex gap-4 mb-[18px] flex-wrap">
              <span className="text-xs text-text-muted">👤 <b className="text-white">{t.equipos}</b> equipos</span>
              <span className="text-xs text-text-muted">👥 <b className="text-white">{t.jugadores}</b> jugadores</span>
              <span className="text-xs text-text-muted">🛡 <b className="text-white">{t.canchas}</b> canchas</span>
            </div>
            <Button className={`rounded-full w-full text-xs py-2 h-auto ${t.estado === 'closed' ? 'bg-transparent text-gold border border-gold hover:bg-gold/10' : 'bg-gold text-[#1A1206] hover:bg-gold-dark'}`}>
              {t.estado === 'closed' ? 'Ver resumen' : 'Ver detalles'}
            </Button>
          </div>
        </>
      ) : (
        <div className="[&_>_*:first-child]:rounded-t-2xl">
          <div className={`h-[140px] flex items-center justify-center relative ${mediaBg}`}>
            <Badge className={`absolute top-3.5 left-3.5 rounded-full text-[11px] font-bold uppercase tracking-[.4px] px-3 py-1 h-auto ${badgeClass}`}>
              {badgeText}
            </Badge>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.4" className="opacity-90">
              <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4z"/>
            </svg>
          </div>
          <div className="p-[18px_20px_20px]">
            <span className="text-[10.5px] tracking-[1px] text-text-faint font-bold uppercase">{t.tag}</span>
            <h3 className="font-[family-name:var(--font-display)] text-xl uppercase mt-1.5 mb-0.5">{t.nombre}</h3>
            {t.sub && <p className="text-[12.5px] text-text-muted mb-2.5">{t.sub}</p>}
            <div className="text-xs text-text-muted flex items-center gap-1.5 mb-3.5">📅 {t.fecha}</div>
            <div className="flex gap-4 mb-[18px] flex-wrap">
              <span className="text-xs text-text-muted">👤 <b className="text-white">{t.equipos}</b> equipos</span>
              <span className="text-xs text-text-muted">👥 <b className="text-white">{t.jugadores}</b> jugadores</span>
              <span className="text-xs text-text-muted">🛡 <b className="text-white">{t.canchas}</b> canchas</span>
            </div>
            <Button className={`rounded-full w-full text-xs py-2 h-auto ${t.estado === 'closed' ? 'bg-transparent text-gold border border-gold hover:bg-gold/10' : 'bg-gold text-[#1A1206] hover:bg-gold-dark'}`}>
              {t.estado === 'closed' ? 'Ver resumen' : 'Ver detalles'}
            </Button>
          </div>
        </div>
      )}
    </SpotlightCard>
  )
}
