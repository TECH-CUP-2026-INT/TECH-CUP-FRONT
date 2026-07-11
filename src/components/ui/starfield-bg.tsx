"use client"

import { type ReactNode, useEffect, useRef } from "react"

/* ============================================================
   StarfieldBackground — Fondo de estrellas animado
   Basado en: https://uiverse.io/jaykdoe
   ============================================================ */

interface StarfieldBgProps {
  children?: ReactNode
  showLogo?: boolean
  className?: string
  showPlayer?: boolean
}

// ── Interactive Particle Network ──

function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId = 0
    let mouse = { x: -1000, y: -1000 }
    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = []
    const COUNT = 70
    const CONNECT_DIST = 140
    const MOUSE_RADIUS = 150

    const resize = () => {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      // Clamp particles to new bounds
      for (const p of particles) {
        p.x = Math.max(0, Math.min(canvas!.width, p.x))
        p.y = Math.max(0, Math.min(canvas!.height, p.y))
      }
    }
    resize()
    window.addEventListener("resize", resize)

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        size: Math.random() * 2 + 1.5,
      })
    }

    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse interaction
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
          p.vx -= (dx / dist) * force * 0.5
          p.vy -= (dy / dist) * force * 0.5
        }

        p.x += p.vx
        p.y += p.vy

        // Friction
        p.vx *= 0.98
        p.vy *= 0.98

        // Bounce con clamp
        if (p.x < 0) { p.x = 0; p.vx *= -1 }
        if (p.x > canvas!.width) { p.x = canvas!.width; p.vx *= -1 }
        if (p.y < 0) { p.y = 0; p.vy *= -1 }
        if (p.y > canvas!.height) { p.y = canvas!.height; p.vy *= -1 }

        // Draw particle (morado y dorado)
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        const hue = i % 2 === 0 ? "rgba(245,166,35,0.6)" : "rgba(109,40,217,0.5)"
        ctx!.fillStyle = hue
        ctx!.fill()
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35
            ctx!.beginPath()
            ctx!.moveTo(a.x, a.y)
            ctx!.lineTo(b.x, b.y)
            // Alternar colores de línea: morado y dorado
            const mix = (i + j) % 2 === 0
            ctx!.strokeStyle = mix
              ? `rgba(109,40,217,${alpha * 1.2})`
              : `rgba(245,166,35,${alpha * 0.8})`
            ctx!.lineWidth = 0.7
            ctx!.stroke()
          }
        }
      }

      animId = requestAnimationFrame(animate)
    }

    animate()

    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -1000; mouse.y = -1000 }
    window.addEventListener("mousemove", onMouse)
    window.addEventListener("mouseleave", onLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouse)
      window.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

export function StarfieldBackground({ children, showLogo = true, className = "", showPlayer = false }: StarfieldBgProps) {
  return (
    <div className={"relative min-h-screen overflow-hidden " + className}
      style={{ background: "radial-gradient(ellipse at bottom, #321b35 0%, #090a0f 100%)" }}
    >
      {/* Fondo con blur */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "url('/bg-logo.png') center/cover no-repeat",
        filter: "blur(4px)",
        opacity: 0.6,
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at bottom, rgba(80,30,100,0.6) 0%, rgba(30,10,50,0.8) 100%)",
      }} />
      {/* Particle network canvas */}
      <ParticleNetwork />

      {/* Conic gradient shine (debajo de los puntos) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -inset-[100%] opacity-[0.04]"
          style={{
            background: "conic-gradient(transparent, rgba(245,166,35,0.3), transparent, rgba(109,40,217,0.2), transparent)",
            transform: "rotate(258deg)",
          }}
        />
      </div>
      {/* Linear shine (debajo de los puntos) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: "linear-gradient(105deg, transparent 30%, rgba(245,166,35,0.4) 50%, transparent 70%)",
        }}
      />
      {/* Puntos dorados y morados (encima) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: [
            "radial-gradient(rgba(245,166,35,0.5) 1px, transparent 1px)",
            "radial-gradient(rgba(109,40,217,0.4) 1px, transparent 1px)",
          ].join(", "),
          backgroundSize: "30px 30px, 30px 30px",
          backgroundPosition: "0 0, 15px 15px",
        }}
      />
      {/* Gradiente de transición morado */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(to top, rgba(59,18,100,0.6) 0%, rgba(22,11,36,0.2) 20%, transparent 50%, rgba(22,11,36,0.4) 85%, rgba(59,18,100,0.5) 100%)",
      }} />
      {/* Tinte morado sutil */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 30%, rgba(109,40,217,0.06) 0%, transparent 60%)",
      }} />

      {/* Jugador animado con copa */}
      {showPlayer && (
        <div className="absolute bottom-[10%] right-[8%] z-[1] pointer-events-none select-none">
          <div className="relative animate-bounce-slow">
            {/* Silueta jugador */}
            <svg width="120" height="180" viewBox="0 0 120 180" fill="none" className="drop-shadow-[0_0_30px_rgba(109,40,217,0.3)]">
              {/* Cuerpo */}
              <ellipse cx="60" cy="110" rx="25" ry="45" fill="rgba(109,40,217,0.2)" stroke="rgba(109,40,217,0.3)" strokeWidth="1" />
              {/* Cabeza */}
              <circle cx="60" cy="60" r="20" fill="rgba(109,40,217,0.2)" stroke="rgba(109,40,217,0.3)" strokeWidth="1" />
              {/* Copa */}
              <path d="M45 40 L40 15 L50 15 L52 25 L68 25 L70 15 L80 15 L75 40 L70 42 L65 50 L55 50 L50 42 L45 40Z" fill="rgba(245,166,35,0.25)" stroke="rgba(245,166,35,0.4)" strokeWidth="1.5" />
              {/* Brazos levantados */}
              <line x1="35" y1="95" x2="20" y2="75" stroke="rgba(109,40,217,0.25)" strokeWidth="3" strokeLinecap="round" />
              <line x1="85" y1="95" x2="100" y2="75" stroke="rgba(109,40,217,0.25)" strokeWidth="3" strokeLinecap="round" />
              {/* Piernas */}
              <line x1="45" y1="150" x2="35" y2="175" stroke="rgba(109,40,217,0.25)" strokeWidth="3" strokeLinecap="round" />
              <line x1="75" y1="150" x2="85" y2="175" stroke="rgba(109,40,217,0.25)" strokeWidth="3" strokeLinecap="round" />
              {/* Balón en la base */}
              <circle cx="60" cy="175" r="10" fill="rgba(245,166,35,0.1)" stroke="rgba(245,166,35,0.2)" strokeWidth="1" />
            </svg>
          </div>
        </div>
      )}

      {/* Logo central grande y difuminado */}
      {showLogo && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] flex flex-col items-center opacity-[0.12] pointer-events-none select-none blur-sm">
          <img src="/assets/logo.png" alt="TechCup" className="w-60 h-60 object-contain" />
          <span className="text-[80px] font-[family-name:var(--font-display)] font-bold tracking-[6px] -mt-4"
            style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.15)" }}>
            TECHCUP
          </span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-[2]">
        {children}
      </div>

      <style>{`
        .animate-bounce-slow {
          animation: bounceSlow 3s ease-in-out infinite;
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  )
}
