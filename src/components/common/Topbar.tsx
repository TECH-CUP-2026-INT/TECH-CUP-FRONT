import { Search, Bell } from 'lucide-react'

interface TopbarProps {
  search?: boolean
  showNotifications?: boolean
  title?: string
  subtitle?: string
}

export default function Topbar({ search: showSearch, showNotifications, title, subtitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-[18px] bg-black/85 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {showSearch ? (
          <div className="flex items-center gap-2.5 bg-surface border border-border rounded-full px-4 py-2.5 w-full text-text-muted">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar torneo..."
              className="bg-transparent border-none outline-none text-white text-[13.5px] w-full placeholder:text-text-faint"
            />
          </div>
        ) : (
          <div>
            {title && <h1 className="text-[17px] font-bold m-0">{title}</h1>}
            {subtitle && <p className="text-[12.5px] text-text-muted mt-0.5">{subtitle}</p>}
          </div>
        )}
      </div>

      {showNotifications && (
        <div className="flex items-center gap-[18px]">
          <button className="relative text-gray-light bg-transparent border-none p-0" aria-label="Notificaciones">
            <Bell size={20} />
            <span className="absolute -top-[5px] -right-[7px] bg-purple-mid text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          <img className="w-9 h-9 rounded-full object-cover" src="https://i.pravatar.cc/72?img=13" alt="" />
        </div>
      )}
    </header>
  )
}
