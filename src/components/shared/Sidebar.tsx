import { useRef, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  Home, Trophy, Calendar, Sword, BarChart3, ShieldCheck, MapPin, HelpCircle, ChevronDown, X, PanelLeftClose, PanelLeft, User
} from 'lucide-react'

const items = [
  { id:'inicio',      icon: Home,         label:'Inicio',            href:'/dashboard' },
  { id:'torneos',     icon: Trophy,       label:'Torneos y Equipos', href:'/app/torneos' },
  { id:'calendario',  icon: Calendar,     label:'Calendario',        href:'/app/calendario' },
  { id:'partidos',    icon: Sword,        label:'Mis partidos',     href:'/mis-partidos' },
  { id:'mi-equipo',   icon: Trophy,        label:'Mi equipo',        href:'/mi-equipo' },
  { id:'perfil',      icon: User,         label:'Perfil',            href:'/perfil' },
  { id:'estadisticas',icon: BarChart3,    label:'Estadísticas',      href:'/estadisticas' },
  { id:'reglamento',  icon: ShieldCheck,  label:'Reglamento',        href:'/reglamento' },
  { id:'campus',      icon: MapPin,       label:'Campus',            href:'/campus' },
  { id:'soporte',     icon: HelpCircle,   label:'Soporte',           href:'/soporte' },
  { id:'arbitraje',   icon: ShieldCheck,  label:'Arbitraje',         href:'/arbitraje' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const activeId = pathname.startsWith('/dashboard') ? 'inicio'
    : pathname.startsWith('/app/torneos') || pathname.startsWith('/torneos') ? 'torneos'
    : pathname.startsWith('/app/calendario') || pathname.startsWith('/calendario') ? 'calendario'
    : pathname.startsWith('/mis-partidos') ? 'partidos'
    : pathname.startsWith('/estadisticas') ? 'estadisticas'
    : pathname.startsWith('/mi-equipo') ? 'mi-equipo'
    : pathname.startsWith('/perfil') ? 'perfil'
    : pathname.startsWith('/arbitraje') || pathname.startsWith('/arbitro') ? 'arbitraje'
    : pathname.startsWith('/calendario') ? 'calendario'
    : pathname.slice(1).split('/')[0] || 'inicio'

  // Auto-show on hover near left edge
  const [showOnHover, setShowOnHover] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX < 25) {
        setShowOnHover(true)
        hideTimer.current && clearTimeout(hideTimer.current)
      } else if (e.clientX > 280) {
        hideTimer.current && clearTimeout(hideTimer.current)
        hideTimer.current = setTimeout(() => setShowOnHover(false), 400)
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      hideTimer.current && clearTimeout(hideTimer.current)
    }
  }, [])

  const isVisible = open || showOnHover
  const sideCollapsed = collapsed && !hovered

  const handleNavigate = () => {
    onClose()
    setShowOnHover(false)
  }

  return (
    <>
      {/* Overlay cuando se abre manualmente */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      )}

      <aside
        ref={sidebarRef}
        onMouseEnter={() => { setHovered(true); setShowOnHover(true); clearTimeout(hideTimer.current) }}
        onMouseLeave={() => { setHovered(false); hideTimer.current = setTimeout(() => setShowOnHover(false), 500) }}
        className={cn(
          'bg-black border-r border-border flex flex-col py-5 fixed left-0 top-0 h-screen z-50 transition-all duration-300 overflow-hidden shadow-2xl shadow-black/50',
          isVisible ? 'translate-x-0' : '-translate-x-full',
          sideCollapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Header */}
        <div className={cn('flex items-center pb-5', sideCollapsed ? 'justify-center px-2' : 'justify-between px-3')}>
          <Link to="/dashboard" className="flex items-center gap-2.5" onClick={handleNavigate}>
            <div className="w-[34px] h-[34px] rounded-lg overflow-hidden bg-purple-black flex-shrink-0">
              <img src="/assets/logo.png" alt="TechCup" className="w-full h-full object-cover" />
            </div>
            {!sideCollapsed && (
              <div className="flex flex-col leading-none">
                <span className="font-[family-name:var(--font-display)] font-bold text-lg tracking-[.5px]">
                  TECH<span className="text-gold">CUP</span>
                </span>
                <span className="text-[8.5px] tracking-[1.6px] text-text-muted font-semibold">
                  FÚTBOL · ING. SISTEMAS
                </span>
              </div>
            )}
          </Link>
          <div className="flex items-center gap-1">
            <button
              className="text-gray-light hover:text-gold transition-colors p-1"
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Colapsar"
            >
              {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
            </button>
            <button className="text-gray-light hover:text-red-400 transition-colors p-1" onClick={() => { onClose(); setShowOnHover(false) }} aria-label="Cerrar">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Nav - un click nomás */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-1">
          <ul className={cn('space-y-0.5', sideCollapsed ? 'px-1' : 'px-0')}>
            {items.map((item) => {
              const Icon = item.icon
              const isActive = item.id === activeId
              return (
                <li key={item.id}>
                  <Link
                    to={item.href}
                    onClick={handleNavigate}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold text-gray-light border-l-[3px] border-transparent transition-all hover:bg-white/5 hover:text-white whitespace-nowrap',
                      isActive && 'bg-purple-mid/22 text-white border-l-gold',
                      sideCollapsed && 'justify-center px-2 border-l-0'
                    )}
                    title={sideCollapsed ? item.label : undefined}
                  >
                    <Icon size={20} className={cn('flex-shrink-0', isActive ? 'opacity-100' : 'opacity-85')} />
                    {!sideCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Promo */}
        {!sideCollapsed && (
          <div className="mx-3 mt-3 rounded-2xl p-4 bg-gradient-to-br from-purple-deep to-purple-black border border-white/10">
            <p className="font-[family-name:var(--font-display)] text-sm leading-tight uppercase mb-3">
              ¡Lleva a tu equipo <span className="text-gold">a la gloria!</span>
            </p>
            <button onClick={() => { navigate('/crear-equipo'); onClose() }} className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold text-xs h-auto py-2 transition-colors">
              Crear equipo →
            </button>
          </div>
        )}

        {/* Profile */}
        <div className={cn('mt-3 pt-3 border-t border-border flex items-center gap-2.5 cursor-pointer group', sideCollapsed ? 'justify-center px-2' : 'px-3')}>
          <div className="relative">
            <img src="https://i.pravatar.cc/72?img=13" alt="Avatar" className={cn('rounded-full object-cover border-2 border-transparent group-hover:border-gold transition-colors', sideCollapsed ? 'w-9 h-9' : 'w-[38px] h-[38px]')} />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
          </div>
          {!sideCollapsed && (
            <>
              <div className="flex-1 leading-tight min-w-0">
                <b className="text-[13px] block truncate">Juan Camilo Rivera</b>
                <span className="text-[11.5px] text-text-muted">Estudiante</span>
              </div>
              <ChevronDown size={16} className="flex-shrink-0 text-gray-light" />
            </>
          )}
        </div>
      </aside>
    </>
  )
}
