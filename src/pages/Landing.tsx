import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Marquee } from '@/components/ui/marquee'
import { ThreeDCarousel } from '@/components/ui/three-d-carousel'
import { Copa3D } from '@/components/ui/copa-3d'
import { torneos } from '@/data/torneos'

const heroImages = [
  { src: '/images/landing-arquero2.png', alt: 'Acción en la cancha — arquero en movimiento' },
  { src: '/images/landing-futbol2.png', alt: 'Jugada ofensiva — fútbol universitario' },
  { src: '/images/landing-futbol3.png', alt: 'Competencia y pasión en el campo' },
]

const featureSlides = [
  { title: 'Torneos organizados', desc: 'Compite en torneos internos con reglas claras y justas.', color: '#6D28D9' },
  { title: 'Equipos comprometidos', desc: 'Crea o únete a un equipo y representa a tu programa.', color: '#F5A623' },
  { title: 'Calendario actualizado', desc: 'Consulta fechas, horarios y resultados en tiempo real.', color: '#8B5CF6' },
  { title: 'Estadísticas en vivo', desc: 'Sigue el rendimiento de los equipos y jugadores.', color: '#C084FC' },
]

/* ─── Feature Scene backgrounds (CSS) ─── */
function FeatureScene({ index }: { index: number }) {
  const scenes = [
    /* Torneos: cancha con líneas */
    <div key={0} className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f3a] via-[#120826] to-[#0d0520]" />
      <svg viewBox="0 0 600 400" fill="none" className="absolute inset-0 w-full h-full opacity-20">
        <rect x="50" y="50" width="500" height="300" rx="8" stroke="white" strokeWidth="2" />
        <line x1="300" y1="50" x2="300" y2="350" stroke="white" strokeWidth="1.5" />
        <circle cx="300" cy="200" r="50" stroke="white" strokeWidth="1.5" />
        <circle cx="300" cy="200" r="4" fill="white" />
        <rect x="50" y="140" width="80" height="120" stroke="white" strokeWidth="1.5" />
        <rect x="470" y="140" width="80" height="120" stroke="white" strokeWidth="1.5" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0A0614] to-transparent" />
    </div>,
    /* Equipos: siluetas de equipo */
    <div key={1} className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2a1508] via-[#1a0f05] to-[#0A0614]" />
      <svg viewBox="0 0 600 400" fill="none" className="absolute inset-0 w-full h-full">
        {[0,1,2,3,4,5,6,7,8,9].map(i => (
          <g key={i} transform={`translate(${80 + i * 48}, 120)`}>
            <ellipse cx="16" cy="16" rx="12" ry="14" fill="rgba(245,166,35,0.12)" />
            <rect x="4" y="30" width="24" height="40" rx="6" fill="rgba(245,166,35,0.08)" />
            <rect x="2" y="70" width="10" height="30" rx="4" fill="rgba(245,166,35,0.06)" />
            <rect x="14" y="70" width="10" height="30" rx="4" fill="rgba(245,166,35,0.06)" />
          </g>
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0A0614] to-transparent" />
    </div>,
    /* Calendario: reloj/cancha */
    <div key={2} className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#150a2e] via-[#120826] to-[#0A0614]" />
      <svg viewBox="0 0 600 400" fill="none" className="absolute inset-0 w-full h-full opacity-15">
        <circle cx="300" cy="200" r="120" stroke="white" strokeWidth="2" />
        <circle cx="300" cy="200" r="110" stroke="white" strokeWidth="0.5" strokeDasharray="4 4" />
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * Math.PI / 180
          const x1 = 300 + 100 * Math.cos(angle)
          const y1 = 200 + 100 * Math.sin(angle)
          const x2 = 300 + 110 * Math.cos(angle)
          const y2 = 200 + 110 * Math.sin(angle)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2" />
        })}
        <line x1="300" y1="200" x2="300" y2="120" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1="300" y1="200" x2="350" y2="200" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="300" cy="200" r="4" fill="white" />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0A0614] to-transparent" />
    </div>,
    /* Estadísticas: gráficas */
    <div key={3} className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1040] via-[#120826] to-[#0A0614]" />
      <svg viewBox="0 0 600 400" fill="none" className="absolute inset-0 w-full h-full opacity-20">
        {/* Bar chart */}
        <rect x="100" y="200" width="40" height="100" rx="4" fill="#6D28D9" opacity="0.6" />
        <rect x="160" y="150" width="40" height="150" rx="4" fill="#8B5CF6" opacity="0.6" />
        <rect x="220" y="180" width="40" height="120" rx="4" fill="#A78BFA" opacity="0.6" />
        <rect x="280" y="120" width="40" height="180" rx="4" fill="#F5A623" opacity="0.6" />
        <rect x="340" y="160" width="40" height="140" rx="4" fill="#C084FC" opacity="0.6" />
        <rect x="400" y="100" width="40" height="200" rx="4" fill="#F5A623" opacity="0.8" />
        {/* Line */}
        <polyline points="120,195 180,145 240,175 300,115 360,155 420,95" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
        {[120,180,240,300,360,420].map((x, i) => (
          <circle key={i} cx={x} cy={[195,145,175,115,155,95][i]} r="4" fill="white" />
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0A0614] to-transparent" />
    </div>,
  ]
  return scenes[index] || scenes[0]
}

export default function Landing() {
  const [featuredIdx, setFeaturedIdx] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const destacados = torneos.filter(t => t.estado !== 'closed').slice(0, 3)

  useEffect(() => {
    const t = setInterval(() => setFeaturedIdx(i => (i + 1) % heroImages.length), 3500)
    return () => clearInterval(t)
  }, [])

  const nextFeature = useCallback(() => {
    setActiveFeature(i => (i + 1) % featureSlides.length)
  }, [])

  useEffect(() => {
    const t = setInterval(nextFeature, 5000)
    return () => clearInterval(t)
  }, [nextFeature])

  return (
    <div className="min-h-screen bg-[#E5ECE9] dark:bg-[#0A0614]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Blurred background */}
        <div className="absolute inset-0 pointer-events-none">
          <img src="/images/landing-arquero2.png" alt="" className="w-full h-full object-cover opacity-40 dark:opacity-30" style={{ filter: 'blur(70px) saturate(1.6)' }} draggable={false} />
          <div className="absolute inset-0 bg-white/50 dark:bg-[#0A0614]/60" />
        </div>

        {/* Diagonal gold/purple lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[5%] -right-[8%] w-[55%] h-[45%] origin-top-right opacity-[0.12] dark:opacity-[0.18]" style={{ background: 'linear-gradient(135deg, transparent 30%, #F5A623 48%, #F5A623 52%, transparent 70%)', transform: 'skewX(-20deg)' }} />
          <div className="absolute top-[8%] -right-[3%] w-[45%] h-[35%] origin-top-right opacity-[0.08] dark:opacity-[0.12]" style={{ background: 'linear-gradient(135deg, transparent 28%, #F5A623 46%, transparent 65%)', transform: 'skewX(-22deg)' }} />
          <div className="absolute -top-[2%] right-[5%] w-[40%] h-[50%] origin-top-right opacity-[0.06] dark:opacity-[0.10]" style={{ background: 'linear-gradient(135deg, transparent 25%, #8B5CF6 45%, #6D28D9 55%, transparent 75%)', transform: 'skewX(-18deg)' }} />
          <div className="absolute top-[15%] -right-[10%] w-[50%] h-[30%] origin-top-right opacity-[0.04] dark:opacity-[0.07]" style={{ background: 'linear-gradient(135deg, transparent 20%, #A78BFA 40%, transparent 60%)', transform: 'skewX(-25deg)' }} />
          <div className="absolute top-[5%] right-[15%] w-[30%] h-[25%] origin-top-right opacity-[0.06] dark:opacity-[0.09]" style={{ background: 'linear-gradient(135deg, transparent 40%, #F5A623 50%, transparent 60%)', transform: 'skewX(-15deg)' }} />
          <div className="absolute bottom-[10%] -left-[5%] w-[35%] h-[20%] opacity-[0.03] dark:opacity-[0.05]" style={{ background: 'linear-gradient(115deg, transparent 20%, #6D28D9 45%, transparent 70%)', transform: 'skewX(-20deg)' }} />
        </div>

        {/* Radial glows */}
        <div className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-100" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.15) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-100" style={{ background: 'radial-gradient(ellipse at 70% 60%, rgba(245,166,35,0.08) 0%, transparent 50%)' }} />

        <div className="relative w-full max-w-[1400px] mx-auto px-8 pt-[95px] pb-10 min-h-[620px] flex items-start">
          <div className="absolute inset-0 opacity-10 dark:opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(139,92,246,.15) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <ThreeDCarousel images={heroImages} />
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute top-[5%] left-[-10%] w-[60%] h-[80%] rounded-full border border-[#8B5CF6]/10 dark:border-white/5 max-lg:hidden" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} className="absolute bottom-[10%] right-[-5%] w-[50%] h-[60%] rounded-full border border-[#F5A623]/15 dark:border-gold/10 max-lg:hidden" />
          </div>

          <div className="grid grid-cols-[1fr_1.2fr] gap-14 items-center w-full max-lg:grid-cols-1 max-lg:text-center relative z-[2]">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}>
              <div className="overflow-hidden mb-6">
                <motion.h1 initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }} className="font-[family-name:var(--font-display-alt)] font-bold text-[clamp(52px,7vw,92px)] leading-[.92] tracking-[.5px] uppercase italic">
                  <span className="text-[#3D1A6B] dark:text-[#F7EDE2]">TECH</span>
                  <span style={{ background: 'linear-gradient(135deg, #A5610A 0%, #BD7712 25%, #F5A623 50%, #FBC946 75%, #FBD559 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CUP</span>
                </motion.h1>
              </div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }} className="font-[family-name:var(--font-display)] text-[clamp(16px,2vw,21px)] font-semibold tracking-[.4px] uppercase text-[#5B4A7A] dark:text-gray-light leading-tight mb-5">
                Torneos de fútbol de la decanatura de<br /><span className="text-gold">Ingeniería de Sistemas</span>
              </motion.p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }} className="text-base leading-relaxed text-[#7A6B99] dark:text-text-muted max-w-[520px] mb-10 max-lg:mx-auto">
                La pagina que conecta talento, pasión y tecnología. Vive la experiencia de representar a tu equipo y dejar tu huella en la cancha.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.5 }} className="flex gap-3.5 flex-wrap max-lg:justify-center">
                <Button className="rounded-full bg-purple-mid hover:bg-purple-deep2 text-white font-bold px-6 py-3 h-auto text-sm shadow-lg shadow-purple-mid/25 hover:shadow-purple-mid/40 hover:scale-105 transition-all duration-300 group">
                  Inscribe tu equipo <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Button>
                <Link to="/torneos" className="inline-flex items-center gap-2 rounded-full bg-[#E8E0F5] text-[#4B2D7A] border border-[#C4B0E0] dark:bg-white/10 dark:text-white dark:border-white/20 backdrop-blur-sm font-bold text-sm px-6 py-3 hover:scale-105 transition-all duration-300">
                  Ver torneos activos
                </Link>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }} className="relative h-[400px] max-w-[600px] mx-auto w-full -mt-6">
              <div className="absolute inset-[2%] rounded-2xl bg-purple-mid/20 dark:bg-purple-mid/25 blur-[80px] animate-pulse" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-2xl border border-[#C4B0E0] dark:border-white/10" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className="absolute inset-[8%] rounded-2xl border border-[#F5A623]/30 dark:border-gold/15" />
              <div className="absolute inset-[10%] rounded-2xl overflow-hidden z-[1]">
                <AnimatePresence mode="wait">
                  <motion.img key={featuredIdx} src={heroImages[featuredIdx].src} alt={heroImages[featuredIdx].alt} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }} className="w-full h-full object-contain" style={{ borderRadius: '1.2em', boxShadow: '0 10px 40px rgba(0,0,0,0.3), 0 0 40px rgba(245,166,35,0.1)' }} />
                </AnimatePresence>
              </div>
              <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-4 right-4 w-14 h-14 rounded-xl bg-purple-black/80 backdrop-blur-sm border border-gold/30 flex items-center justify-center p-2 z-10">
                <img src="/assets/logo.png" alt="" className="w-full h-full object-contain" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features — Carrusel con escenas CSS */}
      <section className="pb-[90px] relative z-[3]">
        <div className="absolute left-[-10%] top-[-20%] w-[700px] h-[700px] rounded-full bg-purple-mid/20 blur-[180px] pointer-events-none" />
        <div className="absolute right-[-5%] bottom-[-10%] w-[600px] h-[600px] rounded-full bg-gold/20 blur-[150px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-8 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="bg-[#E8DFF5]/70 dark:bg-black/30 backdrop-blur-sm border border-[#D4C8E8]/40 dark:border-white/5 rounded-2xl p-[30px] overflow-hidden">
            <div className="flex gap-6 max-lg:flex-col">
              {/* Imagen grande */}
              <div className="flex-[1.6] relative min-h-[320px] rounded-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div key={activeFeature} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }} className="absolute inset-0">
                    <FeatureScene index={activeFeature} />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: featureSlides[activeFeature].color }} />
                    <span className="text-[11px] font-bold tracking-[1.4px] uppercase text-white/70">Funcionalidad</span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase text-white mb-1">{featureSlides[activeFeature].title}</h3>
                  <p className="text-sm text-white/70 max-w-[400px]">{featureSlides[activeFeature].desc}</p>
                </div>
              </div>
              {/* Thumbnails */}
              <div className="flex-[0.8] flex flex-col gap-3 justify-center">
                {featureSlides.map((f, i) => (
                  <button key={i} onClick={() => setActiveFeature(i)} className={`relative flex items-center gap-4 p-3 rounded-xl transition-all duration-300 text-left group ${i === activeFeature ? 'bg-white/10 dark:bg-white/10 border border-gold/40 shadow-lg shadow-gold/10' : 'bg-white/5 dark:bg-white/5 border border-transparent hover:bg-white/8 dark:hover:bg-white/8'}`}>
                    <div className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <FeatureScene index={i} />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-sm font-bold tracking-[.2px] truncate ${i === activeFeature ? 'text-gold' : 'text-[#4B2D7A] dark:text-gray-light'}`}>{f.title}</h4>
                      <p className="text-[11px] text-text-muted truncate">{f.desc}</p>
                    </div>
                    {i === activeFeature && (
                      <motion.div layoutId="featureIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-5">
              {featureSlides.map((_, i) => (
                <button key={i} onClick={() => setActiveFeature(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeFeature ? 'w-8 bg-gold' : 'w-1.5 bg-white/20 hover:bg-white/30'}`} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Torneos — Jugador dinámico + tarjetas con escenas */}
      <section className="py-10 pb-[110px] relative overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-[700px] h-[700px] rounded-full bg-purple-deep/20 blur-[180px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[5%] w-[600px] h-[600px] rounded-full bg-gold/20 blur-[150px] pointer-events-none" />
        <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full bg-purple-mid/15 blur-[120px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-8 relative">
          {/* Header section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-gold" />
              <div>
                <span className="text-[11px] font-bold tracking-[1.4px] uppercase text-gold">Torneos</span>
                <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-[.5px] text-[#4B2D7A] dark:text-gray-light">Compite y <span className="text-gold">deja tu huella</span></h2>
              </div>
            </div>
          </div>

          {/* Sub-header removed — está dentro del right column */}

          <div className="grid grid-cols-[0.8fr_1.6fr] gap-10 items-center max-lg:grid-cols-1">
            {/* Left — Copa 3D */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="flex items-center justify-center">
              <Copa3D />
            </motion.div>

            {/* Right — Tournament cards */}
            <div>
              {/* Header toolbar */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D4C8E8]/40 dark:border-white/5">
                <h3 className="font-[family-name:var(--font-display)] text-lg uppercase text-[#4B2D7A] dark:text-white">Todos los torneos</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-text-muted dark:text-text-faint">6 torneos encontrados</span>
                  <div className="relative">
                    <select className="appearance-none bg-white/5 dark:bg-white/5 border border-[#D4C8E8]/40 dark:border-white/10 rounded-lg px-2.5 py-1.5 pr-7 text-[11px] text-[#4B2D7A] dark:text-gray-light cursor-pointer focus:outline-none focus:border-gold/50">
                      <option>Más recientes</option>
                      <option>Más antiguos</option>
                      <option>Nombre</option>
                    </select>
                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                  <div className="flex border border-[#D4C8E8]/40 dark:border-white/10 rounded-lg overflow-hidden">
                    <button className="p-1.5 bg-purple-mid text-white"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg></button>
                    <button className="p-1.5 bg-white/5 dark:bg-white/5 text-text-muted hover:text-white transition-colors"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/></svg></button>
                  </div>
                </div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-5">
              {/* 2026-I — Finalizado */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0, duration: 0.4 }} viewport={{ once: true }}>
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer border border-purple-mid/30 hover:border-gold/50 transition-all duration-300 h-[240px]">
                  <img src="/images/1.png" alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between p-5 z-10">
                    <div>
                      <Badge className="rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 h-auto bg-white/15 text-white border border-white/20 backdrop-blur-sm w-fit mb-2">Finalizado</Badge>
                      <span className="block text-[10px] tracking-[1.2px] text-gold font-bold uppercase mb-1">Torneo oficial</span>
                      <h3 className="font-[family-name:var(--font-display)] text-xl uppercase text-white leading-tight">TechCup 2026-I</h3>
                      <p className="text-[12px] text-white/60 mt-1">Ingeniería de Sistemas</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-white/50 mb-3">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        Mar 3 – Jun 14, 2026
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-white/60"><strong className="text-white/90">32</strong> Equipos</span>
                          <span className="text-[11px] text-white/60"><strong className="text-white/90">384</strong> Jugadores</span>
                          <span className="text-[11px] text-white/60"><strong className="text-white/90">4</strong> Canchas</span>
                        </div>
                        <span className="text-[11px] font-bold text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full group-hover:bg-gold/20 transition-colors">Ver detalles</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 2026-II — Próximo */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} viewport={{ once: true }}>
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer border border-purple-mid/30 hover:border-gold/50 transition-all duration-300 h-[240px]">
                  <img src="/images/2.png" alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between p-5 z-10">
                    <div>
                      <Badge className="rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 h-auto bg-purple-mid text-white w-fit mb-2">Próximo</Badge>
                      <span className="block text-[10px] tracking-[1.2px] text-gold font-bold uppercase mb-1">Torneo oficial</span>
                      <h3 className="font-[family-name:var(--font-display)] text-xl uppercase text-white leading-tight">TechCup 2026-II</h3>
                      <p className="text-[12px] text-white/60 mt-1">Ingeniería de Sistemas</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-white/50 mb-3">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        Ago 20 – Nov 30, 2026
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-white/60"><strong className="text-white/90">32</strong> Equipos</span>
                          <span className="text-[11px] text-white/60"><strong className="text-white/90">384</strong> Jugadores</span>
                          <span className="text-[11px] text-white/60"><strong className="text-white/90">4</strong> Canchas</span>
                        </div>
                        <span className="text-[11px] font-bold text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full group-hover:bg-gold/20 transition-colors">Ver detalles</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Relámpago */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} viewport={{ once: true }}>
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer border border-purple-mid/30 hover:border-gold/50 transition-all duration-300 h-[240px]">
                  <img src="/images/3.png" alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                  <div className="relative h-full flex flex-col justify-between p-5 z-10">
                    <div>
                      <Badge className="rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 h-auto bg-gold/20 text-gold border border-gold/40 backdrop-blur-sm w-fit mb-2">Relámpago</Badge>
                      <span className="block text-[10px] tracking-[1.2px] text-gold font-bold uppercase mb-1">Torneo relámpago</span>
                      <h3 className="font-[family-name:var(--font-display)] text-xl uppercase text-white leading-tight">TechCup Relámpago 2026</h3>
                      <p className="text-[12px] text-white/60 mt-1">Ingeniería de Sistemas</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-white/50 mb-3">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        Sep 2026
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-white/60"><strong className="text-white/90">16</strong> Equipos</span>
                          <span className="text-[11px] text-white/60"><strong className="text-white/90">192</strong> Jugadores</span>
                          <span className="text-[11px] text-white/60"><strong className="text-white/90">2</strong> Canchas</span>
                        </div>
                        <span className="text-[11px] font-bold text-gold bg-gold/10 border border-gold/30 px-3 py-1 rounded-full group-hover:bg-gold/20 transition-colors">Ver detalles</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Últimos Partidos */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute left-[5%] top-[-60%] w-[400px] h-[400px] rounded-full bg-purple-mid/15 blur-[120px] pointer-events-none" />
        <div className="absolute right-[5%] bottom-[-60%] w-[300px] h-[300px] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-8 relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-gold" />
              <div>
                <span className="text-[11px] font-bold tracking-[1.4px] uppercase text-gold">Últimos partidos</span>
                <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-[.5px] text-[#4B2D7A] dark:text-gray-light">Resultados <span className="text-gold">en vivo</span></h2>
              </div>
            </div>
            <span className="hidden md:flex items-center gap-2 text-[11px] font-bold tracking-[1px] uppercase text-gold bg-gold/10 border border-gold/30 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> Actualizado ahora
            </span>
          </div>
          <Marquee speed={35} pauseOnHover={true}>
            {[
              { eq1:'Ing. Sistemas', eq2:'Ing. Civil', score:'3 - 1', estado:'Final', color:'#22C55E' },
              { eq1:'Ing. Industrial', eq2:'Ing. Sistemas', score:'0 - 2', estado:'Final', color:'#F59E0B' },
              { eq1:'Ing. Mecánica', eq2:'Ing. Eléctrica', score:'1 - 1', estado:'42\'', color:'#3B82F6' },
              { eq1:'Ing. Sistemas', eq2:'Ing. Industrial', score:'-', estado:'Sáb 8PM', color:'#22C55E' },
              { eq1:'Ing. Civil', eq2:'Ing. Mecánica', score:'-', estado:'Dom 5PM', color:'#EF4444' },
              { eq1:'Ciberseguridad', eq2:'IA', score:'4 - 2', estado:'Final', color:'#8B5CF6' },
              { eq1:'Ing. Estadística', eq2:'Ing. Sistemas', score:'0 - 0', estado:'18\'', color:'#06B6D4' },
              { eq1:'Ing. Química', eq2:'Ing. Industrial', score:'2 - 1', estado:'Final', color:'#EC4899' },
            ].map((m, i) => (
              <div key={i} className="group relative overflow-hidden rounded-xl min-w-[240px] bg-[#E8DFF5]/70 dark:bg-black/30 backdrop-blur-sm border border-[#D4C8E8]/40 dark:border-white/5 hover:border-gold/40 transition-all duration-300 p-3.5">
                <div className="absolute -inset-[50%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(245,166,35,0.06), transparent 60%)' }} />
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`text-[9px] font-bold uppercase tracking-[.6px] px-2 py-0.5 rounded-full ${m.estado === 'Final' ? 'bg-[#E8E0F5] text-[#6B4D9E] dark:bg-white/10 dark:text-text-faint' : m.estado.includes("'") ? 'bg-gold/15 text-gold dark:bg-gold/20 animate-pulse' : 'bg-purple-mid/15 text-purple-mid'}`}>{m.estado}</span>
                  <span className="text-[9px] text-[#9B8AB5] dark:text-text-faint font-medium">{m.estado === 'Final' ? 'FINAL' : m.estado.includes("'") ? 'EN VIVO' : 'PRÓXIMO'}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: m.color + '20', color: m.color }}>{m.eq1.split(' ').pop()?.substring(0, 3) || m.eq1.substring(0, 3)}</div>
                    <span className="text-[11px] font-semibold text-[#4B2D7A] dark:text-gray-light text-center leading-tight truncate w-full">{m.eq1}</span>
                  </div>
                  <div className="flex flex-col items-center px-1">
                    <span className={`text-lg font-black leading-none ${m.estado === 'Final' ? 'text-[#4B2D7A] dark:text-gray-light' : m.estado.includes("'") ? 'text-gold' : 'text-purple-mid'}`}>{m.score}</span>
                    <span className="text-[8px] text-[#9B8AB5] dark:text-text-faint font-bold uppercase mt-0.5">VS</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: m.color + '20', color: m.color }}>{m.eq2.split(' ').pop()?.substring(0, 3) || m.eq2.substring(0, 3)}</div>
                    <span className="text-[11px] font-semibold text-[#4B2D7A] dark:text-gray-light text-center leading-tight truncate w-full">{m.eq2}</span>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      <Footer />
    </div>
  )
}



