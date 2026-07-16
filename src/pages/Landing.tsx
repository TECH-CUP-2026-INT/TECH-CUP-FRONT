import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, Calendar, BarChart3, Clock } from 'lucide-react'
import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'
import { Button } from '@/components/common/button'
import { Badge } from '@/components/common/badge'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Marquee } from '@/components/common/marquee'
import { Copa3D } from '@/components/common/copa-3d'
import { torneos } from '@/services/torneos'

const featureSlides = [
  { title: 'Torneos organizados', desc: 'Compite en torneos temáticos con reglas claras y justas.', color: '#FFD700', icon: Trophy },
  { title: 'Equipos comprometidos', desc: 'Únete a una comunidad de jugadores apasionados y competitivos.', color: '#FFD700', icon: Users },
  { title: 'Calendario actualizado', desc: 'Consulta fechas, horarios y resultados en tiempo real.', color: '#FFD700', icon: Calendar },
  { title: 'Estadísticas en vivo', desc: 'Sigue el desempeño de los equipos y jugadores en cada torneo.', color: '#FFD700', icon: BarChart3 },
]

const heroFondos = [
  '/images/landing-arquero2.png',
  '/images/landing-futbol2.png',
]

export default function Landing() {
  const navigate = useNavigate()
  const [activeFeature, setActiveFeature] = useState(0)
  const [heroImg, setHeroImg] = useState(0)

  const nextFeature = useCallback(() => {
    setActiveFeature(i => (i + 1) % featureSlides.length)
  }, [])

  useEffect(() => {
    const t = setInterval(nextFeature, 5000)
    return () => clearInterval(t)
  }, [nextFeature])

  useEffect(() => {
    const t = setInterval(() => {
      setHeroImg(i => (i + 1) % heroFondos.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-[#E5ECE9] dark:bg-[#0A0614]">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Fondo difuminado — fondo.jpg */}
        <div className="absolute inset-0 pointer-events-none">
          <img src="/images/fondo.png" alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-50" style={{ filter: 'blur(40px) saturate(1.8)' }} draggable={false} />
          <div className="absolute inset-0 bg-white/30 dark:bg-[#0A0614]/40" />
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

        {/* Mallas de puntos — dorado abajo-izq, morado derecha */}
        <div className="absolute bottom-8 left-8 w-[200px] h-[200px] opacity-20 dark:opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F5A623 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute top-[20%] right-12 w-[160px] h-[300px] opacity-15 dark:opacity-25 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6D28D9 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        {/* Radial glows */}
        <div className="absolute inset-0 pointer-events-none opacity-60 dark:opacity-100" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(139,92,246,0.15) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-100" style={{ background: 'radial-gradient(ellipse at 70% 60%, rgba(245,166,35,0.08) 0%, transparent 50%)' }} />
        {/* Glow intenso detrás del jugador */}
        <div className="absolute left-[10%] top-[20%] w-[400px] h-[400px] rounded-full bg-gold/20 blur-[120px] pointer-events-none opacity-60" />
        <div className="absolute left-[5%] top-[30%] w-[250px] h-[250px] rounded-full bg-purple-mid/30 blur-[100px] pointer-events-none opacity-40" />

        {/* Fondo de pantalla completo — según modo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img src="/images/fondo.png" alt="" className="absolute inset-0 w-full h-full object-cover dark:block hidden" />
          <img src="/images/fondo-blanco.png" alt="" className="absolute inset-0 w-full h-full object-cover block dark:hidden" />
          <div className="absolute inset-0 dark:block hidden" style={{ boxShadow: 'inset 0 0 150px 80px rgba(10,6,20,0.95)' }} />
          <div className="absolute inset-0 block dark:hidden" style={{ boxShadow: 'inset 0 0 150px 80px rgba(229,236,233,0.95)' }} />
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto px-8 pt-[95px] pb-10 min-h-[620px] flex items-start">

          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute top-[5%] left-[-10%] w-[60%] h-[80%] rounded-full border border-[#8B5CF6]/10 dark:border-white/5 max-lg:hidden" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} className="absolute bottom-[10%] right-[-5%] w-[50%] h-[60%] rounded-full border border-[#F5A623]/15 dark:border-gold/10 max-lg:hidden" />
          </div>

          <div className="grid grid-cols-[1fr_1fr] gap-14 items-center w-full max-lg:grid-cols-1 max-lg:text-center relative z-[2]">
            {/* Imagen — IZQUIERDA */}
            <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }} className="relative flex items-center justify-center max-lg:hidden">
              <div className="relative w-full max-w-[520px] aspect-[4/3]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={heroImg}
                    src={heroFondos[heroImg]}
                    alt="Jugador TechCup"
                    className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                </AnimatePresence>
                <motion.div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[200px] h-[20px] rounded-full bg-black/30 blur-xl"
                  animate={{ scaleX: [1, 0.8, 1], opacity: [0.3, 0.15, 0.3] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              {/* Dots del carrusel */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                {heroFondos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroImg(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === heroImg ? 'bg-gold w-5' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Texto — DERECHA */}
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
                <Button onClick={() => navigate('/torneos')} className="rounded-full bg-gold hover:bg-gold-dark text-[#1D0440] font-bold px-7 py-3.5 h-auto text-sm shadow-lg shadow-gold/30 hover:shadow-gold/50 hover:scale-105 transition-all duration-300 group">
                  Inscribe tu equipo <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Texto inferior derecha — encima de todo */}
        <div className="absolute bottom-8 right-8 z-20 max-w-[360px] text-right max-md:hidden">
          <p className="font-[family-name:var(--font-display)] text-4xl uppercase leading-[1.1] mb-4 text-white drop-shadow-lg">
            La pasión nos <span className="text-gold">conecta</span>
          </p>
          <p className="text-sm text-white/70 leading-relaxed drop-shadow">
            Iniciá sesión y viví la emoción del torneo universitario más importante de Ingeniería de Sistemas.
          </p>
          <div className="flex items-center gap-3 mt-6 justify-end">
            <div className="w-8 h-[2px] rounded-full bg-gold/20" />
            <div className="w-8 h-[2px] rounded-full bg-purple-mid/40" />
            <div className="w-8 h-[2px] rounded-full bg-gold/60" />
          </div>
        </div>
      </section>

      {/* Features — Carrusel con escenas CSS */}
      <section className="pb-[90px] relative z-[3]">
        <div className="absolute left-[-10%] top-[-20%] w-[700px] h-[700px] rounded-full bg-purple-mid/20 blur-[180px] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-8 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="bg-[#E8DFF5]/70 dark:bg-black/30 backdrop-blur-sm border border-[#D4C8E8]/40 dark:border-white/5 rounded-2xl p-[40px] overflow-hidden">
            <div className="flex gap-8 max-lg:flex-col">
              {/* Imagen grande */}
              <div className="flex-[1.6] relative min-h-[420px] rounded-xl overflow-hidden">
                {activeFeature === 0 ? (
                  <img src="/images/feature-torneos.png" alt="" className="absolute inset-0 w-full h-full object-contain" />
                ) : activeFeature === 1 ? (
                  <img src="/images/feature-equipos.png" alt="" className="absolute inset-0 w-full h-full object-contain" />
                ) : activeFeature === 2 ? (
                  <img src="/images/feature-calendario.png" alt="" className="absolute inset-0 w-full h-full object-contain" />
                ) : activeFeature === 3 ? (
                  <img src="/images/feature-estadisticas.png" alt="" className="absolute inset-0 w-full h-full object-contain" />
                ) : (
                  <>
                <img src="/images/mosaico1.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/copa%20y%20manchas.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center bottom' }} />
                {/* Mosaico 2x2 con las 4 fotos — más grande */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1">
                  {['landing-mosaico-1', 'landing-mosaico-2', 'landing-mosaico-3', 'landing-mosaico-4'].map((img, idx) => (
                    <div key={idx} className="relative overflow-hidden rounded-lg group cursor-pointer">
                      <img src={`/images/${img}.jpeg`} alt="" className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105" />
                      <div className="absolute inset-0 transition-all duration-300 opacity-0 group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, #E7A017 0%, rgba(231,160,23,0.3) 100%)' }} />
                    </div>
                  ))}
                </div>
                  </>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: featureSlides[activeFeature].color }} />
                    <span className="text-xs font-bold tracking-[1.6px] uppercase text-white/70">Funcionalidad</span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-3xl uppercase text-white mb-2">{featureSlides[activeFeature].title}</h3>
                  <p className="text-base text-white/70 max-w-[450px]">{featureSlides[activeFeature].desc}</p>
                </div>
              </div>
              {/* Thumbnails — estilo cards */}
              <div className="flex-[0.8] flex flex-col gap-4 justify-center">
                <div className="flex flex-col gap-4">
                {featureSlides.map((f, i) => {
                  const Icon = f.icon
                  return (
                  <button key={i} onClick={() => setActiveFeature(i)} className={`feature-card relative flex items-center gap-6 p-4 rounded-xl bg-[#130B24] border cursor-pointer overflow-hidden group transition-all duration-300 ${i === activeFeature ? 'border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.15)]' : 'border-[#2A1A4A]/80 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.12)]'}`}>
                    {/* Active left indicator */}
                    {i === activeFeature && (
                      <div className="absolute left-0 top-[20%] h-[60%] w-[4px] bg-[#FFD700] rounded-r-sm shadow-[0_0_10px_#FFD700]" />
                    )}
                    {/* Background subtle highlight */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-transparent transition-opacity ${i === activeFeature ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    {/* Icon container */}
                    <div className="relative z-10 w-[84px] h-[84px] flex-shrink-0 rounded-xl flex items-center justify-center border border-white/5" style={{ background: 'linear-gradient(180deg, rgba(30,15,60,1) 0%, rgba(20,10,40,1) 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 10px rgba(0,0,0,0.5)' }}>
                      <Icon className="w-8 h-8 text-[#FFD700]" style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.5))' }} />
                      <div className="absolute -bottom-[2px] left-[20%] w-[60%] h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #FFD700, transparent)', opacity: 0.8, filter: 'blur(2px)' }} />
                    </div>
                    {/* Text */}
                    <div className="flex-1 relative z-10 py-1 text-left">
                      <h4 className="text-xl font-semibold mb-1 tracking-wide" style={{ background: 'linear-gradient(to right, #FFE066, #FFB300)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{f.title}</h4>
                      <p className="text-sm text-[#A592C4] leading-relaxed">{f.desc}</p>
                    </div>
                  </button>
                  )
                })}
              </div>
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
        <div className="absolute bottom-[5%] right-[5%] w-[600px] h-[600px] rounded-full bg-purple-mid/20 blur-[150px] pointer-events-none" />
        <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full bg-purple-mid/15 blur-[120px] pointer-events-none" />

        <div className="max-w-[1280px] mx-auto px-8 relative">
          {/* Header section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 rounded-full bg-purple-mid" />
              <div>
                <span className="text-[11px] font-bold tracking-[1.4px] uppercase text-purple-mid">Torneos</span>
                <h2 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-[.5px] text-[#4B2D7A] dark:text-gray-light">Compite y <span className="text-purple-mid">deja tu huella</span></h2>
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
                    <select className="appearance-none bg-white/5 dark:bg-white/5 border border-[#D4C8E8]/40 dark:border-white/10 rounded-lg px-2.5 py-1.5 pr-7 text-[11px] text-[#4B2D7A] dark:text-gray-light cursor-pointer focus:outline-none focus:border-purple-mid/50">
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
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer border border-purple-mid/30 hover:border-purple-mid/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 h-[240px]">
                  <img src="/images/1.png" alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px] dark:bg-transparent dark:backdrop-blur-none" />
                  <div className="relative h-full flex flex-col justify-between p-5 z-10">
                    <div>
                      <Badge className="rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 h-auto bg-white/15 text-white border border-white/20 backdrop-blur-sm w-fit mb-2">Finalizado</Badge>
                      <span className="block text-[10px] tracking-[1.2px] text-purple-mid font-bold uppercase mb-1">Torneo oficial</span>
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
                        <span className="text-[11px] font-bold text-purple-mid bg-purple-mid/10 border border-purple-mid/30 px-3 py-1 rounded-full group-hover:bg-purple-mid/20 transition-colors">Ver detalles</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 2026-II — Próximo */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} viewport={{ once: true }}>
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer border border-purple-mid/30 hover:border-purple-mid/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 h-[240px]">
                  <img src="/images/2.png" alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px] dark:bg-transparent dark:backdrop-blur-none" />
                  <div className="relative h-full flex flex-col justify-between p-5 z-10">
                    <div>
                      <Badge className="rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 h-auto bg-purple-mid text-white w-fit mb-2">Próximo</Badge>
                      <span className="block text-[10px] tracking-[1.2px] text-purple-mid font-bold uppercase mb-1">Torneo oficial</span>
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
                        <span className="text-[11px] font-bold text-purple-mid bg-purple-mid/10 border border-purple-mid/30 px-3 py-1 rounded-full group-hover:bg-purple-mid/20 transition-colors">Ver detalles</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Relámpago */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} viewport={{ once: true }}>
                <div className="relative rounded-2xl overflow-hidden group cursor-pointer border border-purple-mid/30 hover:border-purple-mid/60 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 h-[240px]">
                  <img src="/images/3.png" alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0614] via-[#0A0614]/60 to-transparent" />
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px] dark:bg-transparent dark:backdrop-blur-none" />
                  <div className="relative h-full flex flex-col justify-between p-5 z-10">
                    <div>
                      <Badge className="rounded-full text-[10px] font-bold uppercase tracking-[.4px] px-2.5 py-0.5 h-auto bg-purple-mid/20 text-purple-mid border border-purple-mid/40 backdrop-blur-sm w-fit mb-2">Relámpago</Badge>
                      <span className="block text-[10px] tracking-[1.2px] text-purple-mid font-bold uppercase mb-1">Torneo relámpago</span>
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
                        <span className="text-[11px] font-bold text-purple-mid bg-purple-mid/10 border border-purple-mid/30 px-3 py-1 rounded-full group-hover:bg-purple-mid/20 transition-colors">Ver detalles</span>
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
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-gradient-to-br from-[#2d1b4e]/40 via-[#1a0f2e]/30 to-[#0d0720]/40 backdrop-blur-[2px] border border-gold/20 rounded-2xl z-0" />
          <div className="flex items-center justify-between mb-6 relative z-10">
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
          <div className="relative z-10">
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
        </div>
      </section>

      <Footer />
    </div>
  )
}



