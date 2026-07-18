import type { ReactNode } from "react"

interface StarfieldBgProps {
  children?: ReactNode
  className?: string
}

/* Fondo global de la app: color sólido dirigido por el tema (--color-black),
   con un degradado radial muy sutil (6% opacidad) para dar profundidad sin
   lavar el contraste ni cambiar de morado a morado entre modos. */
export function StarfieldBackground({ children, className = "" }: StarfieldBgProps) {
  return (
    <div
      className={"relative min-h-screen bg-black " + className}
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 45% at 50% -10%, rgba(109,40,217,0.06) 0%, transparent 100%)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-[2]">
        {children}
      </div>
    </div>
  )
}
