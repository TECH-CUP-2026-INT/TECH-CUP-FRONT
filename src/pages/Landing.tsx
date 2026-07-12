import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Marquee } from '@/components/ui/marquee'
import { ThreeDCarousel } from '@/components/ui/three-d-carousel'
import { torneos } from '@/data/torneos'

const heroImages = [
  { src: '/images/landing-arquero2.png', alt: 'Acción en la cancha — arquero en movimiento' },
  { src: '/images/landing-futbol2.png', alt: 'Jugada ofensiva — fútbol universitario' },
  { src: '/images/landing-futbol3.png', alt: 'Competencia y pasión en el campo' },
]

const features = [
  { icon:'🏆', title:'Torneos organizados', desc:'Compite en torneos internos con reglas claras y justas.' },
  { icon:'👥', title:'Equipos comprometidos', desc:'Crea o únete a un equipo y representa a tu programa.' },
  { icon:'📅', title:'Calendario actualizado', desc:'Consulta fechas, horarios y resultados en tiempo real.' },
  { icon:'📊', title:'Estadísticas en vivo', desc:'Sigue el rendimiento de los equipos y jugadores.' },
]

export default function Landing() {
  const [featuredIdx, setFeaturedIdx] = useState(0)
  const destacados = torneos.filter(t => t.estado !== 'closed').slice(0, 3)

  useEffect(() => {
    const t = setInterval(() => setFeaturedIdx(i => (i + 1) % heroImages.length), 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F0FF] dark:bg-[#190D2B]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">

        {/* Blurred background image — full bleed */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="/images/landing-arquero2.png"
            alt=""
            className="w-full h-full object-cover
              opacity-40 dark:opacity-30"
            style={{ filter: 'blur(70px) saturate(1.6)' }}
            draggable={false}
          />
          {/* Overlay adaptativo */}
          <div className="absolute inset-0
            bg-white/50 dark:bg-[#190D2B]/50" />
        </div>

        {/* Diagonal ribbons — cintas inclinadas a la derecha */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Ribbon 1 */}
          <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[35%] origin-top-right
            opacity-[0.06] dark:opacity-[0.07]"
            style={{
              background: 'linear-gradient(135deg, transparent 30%, #E7AD30 50%, transparent 70%)',
              transform: 'skewX(-18deg)',
            }}
          />
          {/* Ribbon 2 */}
          <div className="absolute top-[20%] -right-[5%] w-[50%] h-[25%]
            opacity-[0.04] dark:opacity-[0.05]"
            style={{
              background: 'linear-gradient(135deg, transparent 25%, #8B5CF6 45%, #E7AD30 55%, transparent 75%)',
              transform: 'skewX(-22deg)',
            }}
          />
          {/* Ribbon 3 */}
          <div className="absolute top-[40%] -left-[5%] w-[55%] h-[20%]
            opacity-[0.05] dark:opacity-[0.06]"
            style={{
              background: 'linear-gradient(115deg, transparent 20%, #E7AD30 40%, #8B5CF6 55%, transparent 75%)',
              transform: 'skewX(-15deg)',
            }}
          />
          {/* Ribbon 4 */}
          <div className="absolute bottom-[5%] -right-[8%] w-[65%] h-[30%]
            opacity-[0.03] dark:opacity-[0.04]"
            style={{
              background: 'linear-gradient(115deg, transparent 20%, #A78BFA 40%, #E7AD30 60%, transparent 80%)',
              transform: 'skewX(-20deg)',
            }}
          />
          {/* Ribbon 5 */}
          <div className="absolute top-[5%] -left-[15%] w-[45%] h-[40%]
            opacity-[0.02] dark:opacity-[0.03]"
            style={{
              background: 'linear-gradient(115deg, transparent 15%, #8B5CF6 35%, transparent 65%)',
              transform: 'skewX(-25deg)',
            }}
          />
        </div>

        {/* Radial glow overlays */}
        <div className="absolute inset-0 pointer-events-none
          opacity-60 dark:opacity-100"
          style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.15) 0%, transparent 60%)'
          }}
        />
        <div className="absolute inset-0 pointer-events-none
          opacity-40 dark:opacity-100"
          style={{
            background: 'radial-gradient(ellipse at 70% 60%, rgba(231,173,48,0.05) 0%, transparent 50%)'
          }}
        />

        <div className="relative w-full max-w-[1400px] mx-auto px-8 pt-[95px] pb-10 min-h-[620px] flex items-start">

        {/* Grid dots background */}
          <div className="absolute inset-0 opacity-10 dark:opacity-15 pointer-events-none" 
               style={{
                 backgroundImage: 'radial-gradient(rgba(139,92,246,.15) 1px, transparent 1px)',
                 backgroundSize: '30px 30px',
               }} 
          />

          {/* Carrusel 3D de fondo — interactúa con el texto */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <ThreeDCarousel images={heroImages} />
          </div>

          {/* Decorative rings de fondo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute top-[5%] left-[-10%] w-[60%] h-[80%] rounded-full border border-[#8B5CF6]/10 dark:border-white/5 max-lg:hidden"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-[10%] right-[-5%] w-[50%] h-[60%] rounded-full border border-[#E7AD30]/15 dark:border-gold/10 max-lg:hidden"
            />
          </div>

          <div className="grid grid-cols-[1fr_1.2fr] gap-14 items-center w-full max-lg:grid-cols-1 max-lg:text-center relative z-[2]">
            
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
            >
              {/* Title */}
              <div className="overflow-hidden mb-6">
                <motion.h1
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                  className="font-[family-name:var(--font-display-alt)] font-bold text-[clamp(52px,7vw,92px)] leading-[.92] tracking-[.5px] uppercase italic"
                >
                  <span className="text-[#2D1B4E] dark:text-[#F7EDE2]">TECH</span>
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #A5610A 0%, #BD7712 25%, #E7AD30 50%, #FBC946 75%, #FBD559 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >CUP</span>
                </motion.h1>
              </div>
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="font-[family-name:var(--font-display)] text-[clamp(16px,2vw,21px)] font-semibold tracking-[.4px] uppercase text-[#5B4A7A] dark:text-gray-light leading-tight mb-5"
              >
                Torneos de fútbol de la decanatura de<br />
                <span className="text-gold">Ingeniería de Sistemas</span>
              </motion.p>
              
              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-base leading-relaxed text-[#7A6B99] dark:text-text-muted max-w-[520px] mb-10 max-lg:mx-auto"
              >
                La pagina que conecta talento, pasión y tecnología. Vive la experiencia de representar a tu equipo y dejar tu huella en la cancha.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="flex gap-3.5 flex-wrap max-lg:justify-center"
              >
                <Button className="rounded-full bg-purple-mid hover:bg-purple-deep2 text-white font-bold px-6 py-3 h-auto text-sm shadow-lg shadow-purple-mid/25 hover:shadow-purple-mid/40 hover:scale-105 transition-all duration-300 group">
                  Inscribe tu equipo 
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Button>
                <Link to="/torneos" className="inline-flex items-center gap-2 rounded-full
                  bg-[#E8E0F5] text-[#4B2D7A] border border-[#C4B0E0]
                  dark:bg-white/10 dark:text-white dark:border-white/20
                  backdrop-blur-sm font-bold text-sm px-6 py-3 hover:scale-105 transition-all duration-300">
                  Ver torneos activos
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — marco luminoso con carrusel detrás */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="relative h-[400px] max-w-[600px] mx-auto w-full -mt-6"
            >
              {/* Glow de fondo */}
              <div className="absolute inset-[2%] rounded-2xl bg-purple-mid/20 dark:bg-purple-mid/25 blur-[80px] animate-pulse" />
              
              {/* Ring exterior */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-2xl border border-[#C4B0E0] dark:border-white/10"
              />
              
              {/* Ring medio */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[8%] rounded-2xl border border-[#E7AD30]/30 dark:border-gold/15"
              />

              {/* Featured card — imagen grande que cambia cada segundos */}
              <div className="absolute inset-[10%] rounded-2xl overflow-hidden z-[1]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={featuredIdx}
                    src={heroImages[featuredIdx].src}
                    alt={heroImages[featuredIdx].alt}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                    className="w-full h-full object-contain"
                    style={{
                      borderRadius: '1.2em',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.3), 0 0 40px rgba(231,173,48,0.08)',
                    }}
                  />
                </AnimatePresence>
              </div>

              {/* Logo TechCup */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-4 right-4 w-14 h-14 rounded-xl bg-purple-black/80 backdrop-blur-sm border border-gold/30 flex items-center justify-center p-2 z-10"
              >
                <img src="/assets/logo.png" alt="" className="w-full h-full object-contain" />
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Features simples */}
      <section className="pb-[90px] relative z-[3]">
        <div className="absolute left-[-10%] top-[-20%] w-[700px] h-[700px] rounded-full bg-purple-mid/20 blur-[180px] pointer-events-none" />
        <div className="absolute right-[-5%] bottom-[-10%] w-[600px] h-[600px] rounded-full bg-gold/20 blur-[150px] pointer-events-none" />
        <div className="absolute top-[30%] left-[50%] w-[400px] h-[400px] rounded-full bg-purple-deep/15 blur-[120px] pointer-events-none" />
        
        {/* Líneas decorativas */}
        <div className="absolute top-0 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-purple-mid/40 to-transparent" />
        
        <div className="max-w-[1280px] mx-auto px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-4 max-md:grid-cols-2 gap-[18px] bg-surface/80 backdrop-blur-sm border border-border/60 rounded-2xl p-[30px]"
          >
            {features.map((f, i) => (
              <div key={i} className="flex gap-3.5 items-start group">
                <span className="w-11 h-11 rounded-xl flex-shrink-0 bg-purple-mid/20 border border-purple-mid/40 flex items-center justify-center text-lg group-hover:bg-purple-mid/30 transition-colors">
                  {f.icon}
                </span>
                <div>
                  <h3 className="text-sm font-extrabold tracking-[.3px] mb-1">{f.title}</h3>
                  <p className="text-[13px] text-text-muted leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Torneos */}
      <section className="py-10 pb-[110px] relative overflow-hidden">
        {/* Background orbs más intensos */}
        <div className="absolute top-[10%] left-[20%] w-[700px] h-[700px] rounded-full bg-purple-deep/20 blur-[180px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[5%] w-[600px] h-[600px] rounded-full bg-gold/20 blur-[150px] pointer-events-none" />
        <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full bg-purple-mid/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-[80%] left-[10%] w-[300px] h-[300px] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-purple-mid/40 to-transparent" />
        
        <div className="max-w-[1280px] mx-auto px-8 relative">
          <div className="grid grid-cols-[0.8fr_1.6fr] gap-10 mb-10 items-end max-lg:grid-cols-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="w-1 h-6 rounded-full bg-gold" />
                <span className="text-[11px] font-bold tracking-[1.4px] uppercase text-gold">Activos ahora</span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-4xl uppercase tracking-[.5px] leading-tight mb-3.5">
                <span className="text-gold">Torneos</span><br />disponibles
              </h2>
              <p className="text-[14.5px] text-text-muted leading-relaxed mb-[22px] max-w-[320px]">
                Sé parte de la competencia. Inscribe tu equipo y demuestra que el talento en sistemas también brilla en la cancha.
              </p>
              <Link to="/torneos" className="inline-flex items-center gap-2 rounded-full bg-transparent text-gold border border-gold font-bold text-sm px-6 py-3 h-auto hover:bg-gold/10 transition-colors">
                Ver todos los torneos →
              </Link>
            </motion.div>

            <div className="grid grid-cols-3 max-lg:grid-cols-1 gap-5">
              {destacados.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <SpotlightCard accent="gold" className="bg-surface border-border rounded-2xl group">
                    <div className="h-[110px] flex items-center justify-center bg-gradient-to-br from-purple-deep to-[#1a0f2e] relative overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_50%,rgba(245,166,35,.15),transparent_60%)]" />
                      <Badge className={`absolute top-3.5 left-3.5 rounded-full text-[11px] font-bold uppercase tracking-[.4px] px-3 py-1 h-auto z-10 ${
                        t.estado === 'live' ? 'bg-purple-mid text-white' : 'bg-gold/15 text-gold border border-gold/50'
                      }`}>
                        {t.estado === 'live' ? 'En curso' : 'Próximo'}
                      </Badge>
                      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="1.5" className="opacity-90 relative z-10">
                        <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0V4z"/>
                      </svg>
                    </div>
                    <div className="p-4">
                      <span className="text-[10.5px] tracking-[1px] text-text-faint font-bold uppercase">Torneo oficial</span>
                      <h3 className="font-[family-name:var(--font-display)] text-lg uppercase mt-1 mb-1">{t.nombre}</h3>
                      <p className="text-xs text-text-muted">
                        {t.estado === 'live' ? `📍 ${t.equipos} equipos · Fase de grupos` : '📅 Próximamente · ✅ Inscripciones abiertas'}
                      </p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Últimos Partidos — cinta de resultados mejorada */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#F0EAFA]/50 dark:bg-black/40" />
        <div className="absolute left-[5%] top-[-60%] w-[400px] h-[400px] rounded-full bg-purple-mid/15 blur-[120px] pointer-events-none" />
        <div className="absolute right-[5%] bottom-[-60%] w-[300px] h-[300px] rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="max-w-[1280px] mx-auto px-8 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-gold" />
              <div>
                <span className="text-[11px] font-bold tracking-[1.4px] uppercase text-gold">Últimos partidos</span>
                <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-[.5px] text-[#4B2D7A] dark:text-gray-light">
                  Resultados <span className="text-gold">en vivo</span>
                </h2>
              </div>
            </div>
            <span className="hidden md:flex items-center gap-2 text-[11px] font-bold tracking-[1px] uppercase text-gold bg-gold/10 border border-gold/30 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Actualizado ahora
            </span>
          </div>

          {/* Partidos — Marquee */}
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
              <div
                key={i}
                className="group relative overflow-hidden rounded-xl min-w-[240px]
                  bg-white/70 dark:bg-white/5
                  border border-[#E2D5F0] dark:border-white/10
                  hover:border-gold/30 dark:hover:border-gold/30
                  transition-all duration-300 p-3.5"
              >
                <div className="absolute -inset-[50%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(231,173,48,0.06), transparent 60%)' }}
                />
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`text-[9px] font-bold uppercase tracking-[.6px] px-2 py-0.5 rounded-full ${m.estado === 'Final' ? 'bg-[#E8E0F5] text-[#6B4D9E] dark:bg-white/10 dark:text-text-faint' : m.estado.includes("'") ? 'bg-gold/15 text-gold dark:bg-gold/20 animate-pulse' : 'bg-purple-mid/15 text-purple-mid'}`}>
                    {m.estado}
                  </span>
                  <span className="text-[9px] text-[#9B8AB5] dark:text-text-faint font-medium">
                    {m.estado === 'Final' ? 'FINAL' : m.estado.includes("'") ? 'EN VIVO' : 'PRÓXIMO'}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: m.color + '20', color: m.color }}>
                      {m.eq1.split(' ').pop()?.substring(0, 3) || m.eq1.substring(0, 3)}
                    </div>
                    <span className="text-[11px] font-semibold text-[#4B2D7A] dark:text-gray-light text-center leading-tight truncate w-full">{m.eq1}</span>
                  </div>
                  <div className="flex flex-col items-center px-1">
                    <span className={`text-lg font-black leading-none ${m.estado === 'Final' ? 'text-[#4B2D7A] dark:text-gray-light' : m.estado.includes("'") ? 'text-gold' : 'text-purple-mid'}`}>
                      {m.score}
                    </span>
                    <span className="text-[8px] text-[#9B8AB5] dark:text-text-faint font-bold uppercase mt-0.5">VS</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: m.color + '20', color: m.color }}>
                      {m.eq2.split(' ').pop()?.substring(0, 3) || m.eq2.substring(0, 3)}
                    </div>
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
