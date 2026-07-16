import { useState, useMemo } from 'react'
import Sidebar from '@/components/common/Sidebar'
import Footer from '@/components/common/Footer'
import Topbar from '@/components/common/Topbar'
import { Button } from '@/components/common/button'
import { Menu, Search, RefreshCw } from 'lucide-react'
import { torneos } from '@/services/torneos'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/common/select'

const PAGE_SIZE = 3

export default function Torneos() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterSemestre, setFilterSemestre] = useState('todos')
  const [filterCategoria, setFilterCategoria] = useState('todos')
  const [filterSearch, setFilterSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return torneos.filter(t => {
      if (filterEstado !== 'todos' && t.estado !== filterEstado) return false
      if (filterSemestre !== 'todos' && t.semestre !== filterSemestre) return false
      if (filterCategoria !== 'todos' && t.categoria !== filterCategoria) return false
      if (filterSearch && !t.nombre.toLowerCase().includes(filterSearch.toLowerCase())) return false
      return true
    })
  }, [filterEstado, filterSemestre, filterCategoria, filterSearch])

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
            <span className="text-[13px] text-text-muted">{filtered.length} torneos encontrados</span>
          </div>

        </main>

        <Footer />
      </div>
    </div>
  )
}
