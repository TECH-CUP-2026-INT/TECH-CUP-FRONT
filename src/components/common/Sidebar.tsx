import { useRef, useState, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { useAuth, type UserRole } from '@/hooks/auth/useAuth'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/common/avatar'
import {
  Home, Trophy, Calendar, Sword, BarChart3, ShieldCheck, MapPin, HelpCircle, ChevronDown, X, PanelLeftClose, PanelLeft, Swords, ClipboardCheck, Users, Bell, PlusCircle, Medal
} from 'lucide-react'

type NavItem = { id:string; icon:typeof Home; label:string; href:string; roles?: UserRole[] }

const allItems: NavItem[] = [
  { id:'inicio',      icon: Home,          label:'Inicio',               href:'/dashboard',          roles:['jugador','organizador'] },
  { id:'torneos',     icon: Trophy,        label:'Torneos y Equipos',    href:'/app/torneos' },
  { id:'calendario',  icon: Calendar,      label:'Calendario',           href:'/app/calendario' },
  { id:'partidos',    icon: Sword,         label:'Mis partidos',        href:'/mis-partidos',       roles:['jugador'] },
  { id:'mi-equipo',   icon: Users,         label:'Mi equipo',           href:'/mi-equipo',          roles:['jugador'] },
  { id:'notificaciones', icon: Bell,       label:'Notificaciones',       href:'/notificaciones' },
  { id:'rankings',    icon: Medal,         label:'Rankings',             href:'/rankings' },
  { id:'estadisticas',icon: BarChart3,     label:'Estadísticas',         href:'/estadisticas' },
  { id:'crear-torneo',icon: PlusCircle,    label:'Crear Torneo',         href:'/crear-torneo',       roles:['organizador'] },
  { id:'arbitraje',   icon: ClipboardCheck,label:'Arbitraje',            href:'/arbitraje',          roles:['arbitro'] },
  { id:'arbitro-db',  icon: Home,          label:'Panel Árbitro',       href:'/arbitro/dashboard',  roles:['arbitro'] },
  { id:'admin-panel', icon: ShieldCheck,   label:'Panel Organizador',   href:'/dashboard/admin',    roles:['organizador'] },
  { id:'campus',      icon: MapPin,        label:'Campus',               href:'/campus' },
  { id:'soporte',     icon: HelpCircle,    label:'Soporte',              href:'/soporte' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

export default function Sidebar({ open, onClose, collapsed: collapsedProp, onCollapse }: SidebarProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [collapsed, setCollapsed] = useState(collapsedProp ?? false)

  const items = useMemo(() => {
    const role = user?.role
    return allItems.filter(item => !item.roles || (role && item.roles.includes(role))).map(item => {
      if (item.id === 'inicio' && role) {
        const roleRoute = role === 'arbitro' ? '/arbitro/dashboard' : role === 'organizador' ? '/dashboard/admin' : `/dashboard/${role}`
        return { ...item, href: roleRoute }
      }
      return item
    })
  }, [user?.role])

  const handleCollapse = () => {
    const newVal = !collapsed
    setCollapsed(newVal)
    onCollapse?.(newVal)
  }

  const activeId = pathname.startsWith('/dashboard') || pathname === '/' ? 'inicio'
    : pathname.startsWith('/app/torneos') || pathname.startsWith('/torneos') ? 'torneos'
    : pathname.startsWith('/app/calendario') || pathname.startsWith('/calendario') ? 'calendario'
    : pathname.startsWith('/mis-partidos') ? 'partidos'
    : pathname.startsWith('/estadisticas') ? 'estadisticas'
    : pathname.startsWith('/mi-equipo') ? 'mi-equipo'
    : pathname.startsWith('/perfil') ? 'perfil'
    : pathname.startsWith('/notificaciones') ? 'notificaciones'
    : pathname.startsWith('/rankings') ? 'rankings'
    : pathname.startsWith('/crear-torneo') ? 'crear-torneo'
    : pathname.startsWith('/arbitraje') ? 'arbitraje'
    : pathname.startsWith('/arbitro') ? 'arbitro-db'
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
  const sideCollapsed = collapsed

  const handleNavigate = () => {
    setShowOnHover(false)
  }

  return (
    <>
      {/* Overlay solo en mobile — en desktop el contenido se corre */}
      {open && (
        <div className="fixed inset-0 bg-[#0A0614]/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        ref={sidebarRef}
        onMouseEnter={() => { setHovered(true); setShowOnHover(true); clearTimeout(hideTimer.current) }}
        onMouseLeave={() => { setHovered(false); hideTimer.current = setTimeout(() => setShowOnHover(false), 500) }}
        className={cn(
          'bg-black/90 backdrop-blur-md border-r border-border flex flex-col py-5 fixed left-0 top-0 h-screen z-[60] transition-all duration-300 overflow-hidden shadow-2xl shadow-black/50',
          isVisible ? 'translate-x-0' : '-translate-x-full',
          sideCollapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Header */}
        <div className={cn('flex items-center pb-5', sideCollapsed ? 'justify-center px-2' : 'justify-between px-3')}>
          {!sideCollapsed && (
            <Link to="/dashboard" className="flex items-center gap-2.5" onClick={handleNavigate}>
              <div className="w-[34px] h-[34px] rounded-lg overflow-hidden bg-purple-black flex-shrink-0">
                <img src="/assets/logo.png" alt="TechCup" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-[family-name:var(--font-display)] font-bold text-lg tracking-[.5px]">
                  TECH<span className="text-gold-ink">CUP</span>
                </span>
                <span className="text-[8.5px] tracking-[1.6px] text-text-muted font-semibold">
                  FÚTBOL · ING. SISTEMAS
                </span>
              </div>
            </Link>
          )}
          <div className="flex items-center gap-1">
            <button
              className="text-gray-light hover:text-gold-ink transition-colors p-1"
              onClick={handleCollapse}
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
                      'sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold text-gray-light whitespace-nowrap relative overflow-hidden',
                      isActive && 'text-white active',
                      sideCollapsed && 'justify-center px-2'
                    )}
                    title={sideCollapsed ? item.label : undefined}
                  >
                    <span className="relative z-[1] flex items-center gap-3">
                      <Icon size={20} className={cn('flex-shrink-0', isActive ? 'opacity-100' : 'opacity-85')} />
                      {!sideCollapsed && <span className="truncate">{item.label}</span>}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Promo — solo capitán */}
        {!sideCollapsed && user?.isCaptain && (
          <div className="mx-3 mt-3 rounded-2xl p-4 bg-gradient-to-br from-purple-deep to-purple-black border border-white/10">
            <p className="font-[family-name:var(--font-display)] text-sm leading-tight uppercase mb-3">
              ¡Lleva a tu equipo <span className="text-gold-ink">a la gloria!</span>
            </p>
            <button onClick={() => { navigate('/crear-equipo'); onClose() }} className="w-full rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold text-xs h-auto py-2 transition-colors">
              Crear equipo →
            </button>
          </div>
        )}

        {/* Profile */}
        <Link to="/perfil" className={cn('mt-3 pt-3 border-t border-border flex items-center gap-2.5 cursor-pointer group', sideCollapsed ? 'justify-center px-2' : 'px-3')} onClick={handleNavigate}>
          <div className="relative">
              <Avatar className={cn('rounded-full border-2 border-transparent group-hover:border-gold transition-colors', sideCollapsed ? 'w-9 h-9' : 'w-[38px] h-[38px]')}>
                <AvatarImage src={user?.avatar || ''} alt="Avatar" className="rounded-full object-cover" />
                <AvatarFallback className="text-[11px] font-bold">{(user?.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
            </div>
          {!sideCollapsed && (
            <>
              <div className="flex-1 leading-tight min-w-0">
                <b className="text-[13px] block truncate">{user?.name || 'Juan Camilo Rivera'}</b>
                <span className="text-[11.5px] text-text-muted capitalize">{user?.role || 'Estudiante'}</span>
              </div>
              <ChevronDown size={16} className="flex-shrink-0 text-gray-light" />
            </>
          )}
        </Link>
      </aside>

      <style>{`
        .sidebar-link::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          transform: scaleX(0);
          transform-origin: 0 50%;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(82.3deg, rgba(150, 93, 233, 0.4) 10.8%, rgba(99, 88, 238, 0.3) 94.3%);
          transition: all 0.4s ease;
          pointer-events: none;
        }
        .sidebar-link:hover::before {
          transform: scaleX(1);
        }
        .sidebar-link:active::before {
          transform: scaleX(1);
          background: linear-gradient(82.3deg, rgba(150, 93, 233, 0.6) 10.8%, rgba(99, 88, 238, 0.5) 94.3%);
        }
        .sidebar-link .relative.z-\[1\] {
          position: relative;
          z-index: 1;
        }
        .sidebar-link.active::before,
        a.sidebar-link.active::before {
          transform: scaleX(1);
          background: linear-gradient(82.3deg, rgba(150, 93, 233, 0.5) 10.8%, rgba(99, 88, 238, 0.4) 94.3%);
        }
      `}</style>
    </>
  )
}
