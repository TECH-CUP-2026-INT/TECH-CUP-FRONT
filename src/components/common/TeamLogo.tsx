import type { LucideIcon } from 'lucide-react'

interface TeamLogoProps {
  icon: LucideIcon
  size?: number
  bgColor?: string
  iconColor?: string
  className?: string
}

export function TeamLogo({ icon: Icon, size = 26, bgColor = 'rgb(231, 178, 58)', iconColor = 'rgb(58, 42, 5)', className = '' }: TeamLogoProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: bgColor, color: iconColor }}
    >
      <Icon size={size * 0.54} strokeWidth={2.5} />
    </div>
  )
}
