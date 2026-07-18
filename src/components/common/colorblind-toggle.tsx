import { Eye } from 'lucide-react'
import { useColorblind, type ColorblindMode } from '@/configs/colorblind'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/common/dropdown-menu'

const OPTIONS: { value: ColorblindMode; label: string }[] = [
  { value: 'none', label: 'Ninguno (por defecto)' },
  { value: 'protanopia', label: 'Protanopia' },
  { value: 'deuteranopia', label: 'Deuteranopia' },
  { value: 'tritanopia', label: 'Tritanopia' },
]

export function ColorblindToggle() {
  const { mode, setMode } = useColorblind()
  const isActive = mode !== 'none'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`relative w-9 h-9 rounded-full flex items-center justify-center border transition-colors
            ${isActive
              ? 'bg-gold/15 border-gold/50 text-gold'
              : 'bg-gray-200/80 border-gray-300/60 dark:bg-white/5 dark:border-[rgba(255,255,255,0.08)] text-gray-light hover:border-gold/40'
            }`}
          aria-label="Ajustes de daltonismo"
          title="Ajustes de daltonismo"
        >
          <Eye size={16} />
          {isActive && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gold ring-2 ring-white dark:ring-black" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-border bg-surface text-gray-light rounded-2xl p-1.5 mt-2">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-text-muted">
          Modo daltonismo
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        {OPTIONS.map(opt => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => setMode(opt.value)}
            className={`rounded-xl py-2 cursor-pointer text-sm font-semibold focus:bg-gold/15 focus:text-gold ${
              mode === opt.value ? 'text-gold' : ''
            }`}
          >
            {mode === opt.value ? '● ' : '○ '}
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
