import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Marquee } from '@/components/ui/marquee'
import { torneos } from '@/data/torneos'

const features = [
  { icon:'🏆', title:'Torneos organizados', desc:'Compite en torneos internos con reglas claras y justas.' },
  { icon:'👥', title:'Equipos comprometidos', desc:'Crea o únete a un equipo y representa a tu programa.' },
  { icon:'📅', title:'Calendario actualizado', desc:'Consulta fechas, horarios y resultados en tiempo real.' },
  { icon:'📊', title:'Estadísticas en vivo', desc:'Sigue el rendimiento de los equipos y jugadores.' },
]

export default function Landing() {
  const destacados = torneos.filter(t => t.estado !== 'closed').slice(0, 3)

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero con Aurora Background */}
      <AuroraBackground>
        <div className="relative w-full max-w-[1280px] mx-auto px-8 pt-[130px] pb-[70px] overflow-hidden">
          
          {/* Grid dots background */}
          <div className="absolute inset-0 opacity-30 pointer-events-none" 
               style={{
                 backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1px)',
                 backgroundSize: '24px 24px',
                 maskImage: 'radial-gradient(600px 500px at 78% 30%, black 10%, transparent 70%)',
                 WebkitMaskImage: 'radial-gradient(600px 500px at 78% 30%, black 10%, transparent 70%)'
               }} 
          />
          
          {/* Diagonal stripes decorativas */}
          <div className="absolute right-[-8%] top-[-10%] w-[60%] h-[130%] pointer-events-none opacity-40"
               style={{ background: 'repeating-linear-gradient(115deg, rgba(245,166,35,.08) 0 3px, transparent 3px 34px)' }} 
          />

          {/* Decorative rings de fondo (detrás de todo) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute top-[5%] left-[-10%] w-[60%] h-[80%] rounded-full border border-white/5 max-lg:hidden"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-[10%] right-[-5%] w-[50%] h-[60%] rounded-full border border-gold/10 max-lg:hidden"
            />
          </div>

          <div className="grid grid-cols-[1.05fr_0.95fr] gap-10 items-center max-lg:grid-cols-1 max-lg:text-center relative z-[2]">
            
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
            >
              {/* Eyebrow badge */}
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[1.6px] uppercase text-gold bg-gold/10 border border-gold/30 px-3.5 py-1.5 rounded-full mb-[22px]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                Torneo universitario oficial
              </motion.span>
              
              {/* Title con text reveal */}
              <div className="overflow-hidden mb-[18px]">
                <motion.h1
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                  className="font-[family-name:var(--font-display)] font-bold text-[clamp(52px,7vw,92px)] leading-[.92] tracking-[.5px] uppercase"
                >
                  TECH<span className="text-gold">CUP</span>
                </motion.h1>
              </div>
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="font-[family-name:var(--font-display)] text-[clamp(16px,2vw,21px)] font-semibold tracking-[.4px] uppercase text-gray-light leading-tight mb-[22px]"
              >
                Torneos de fútbol de la decanatura de<br />
                <span className="text-gold">Ingeniería de Sistemas</span>
              </motion.p>
              
              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="text-base leading-relaxed text-text-muted max-w-[480px] mb-8 max-lg:mx-auto"
              >
                La competencia que conecta talento, pasión y tecnología. Vive la experiencia de representar a tu equipo y dejar tu huella en la cancha.
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
                <Link to="/torneos" className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm text-white border border-white/20 font-bold text-sm px-6 py-3 hover:bg-white/20 hover:scale-105 transition-all duration-300">
                  Ver torneos activos
                </Link>
              </motion.div>
            </motion.div>

            {/* Right — Foto de futbolista + anillos + logo integrados */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              className="relative aspect-[4/5] max-w-[420px] mx-auto w-full"
            >
              {/* Glow de fondo */}
              <div className="absolute inset-[2%] rounded-2xl bg-purple-mid/25 blur-[80px] animate-pulse" />
              
              {/* Ring exterior */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-2xl border border-white/10"
              />
              
              {/* Ring medio */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[8%] rounded-2xl border border-gold/15"
              />

              {/* Foto del futbolista */}
              <div className="absolute inset-[4%] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_80px_-20px_rgba(76,29,149,.6)]">
                <img
                  src="/hero-soccer.jpg"
                  alt="Futbolista TechCup"
                  className="w-full h-full object-cover scale-110 hover:scale-125 transition-transform duration-[8s] ease-out"
                />
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-black/80 via-purple-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-black/40 via-transparent to-purple-black/40" />
                
                {/* Logo TechCup flotando sobre la foto */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-4 right-4 w-14 h-14 rounded-xl bg-purple-black/80 backdrop-blur-sm border border-gold/30 flex items-center justify-center p-2"
                >
                  <img src="/assets/logo.png" alt="" className="w-full h-full object-contain" />
                </motion.div>
              </div>
              
              {/* Línea decorativa inferior */}
              <div className="absolute -bottom-1 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />

              {/* Ball de fútbol */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-[60px] h-[60px] bottom-[2%] left-[-8%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#d8d8dc_60%,#b9b9c0)] shadow-[0_18px_40px_-8px_rgba(0,0,0,.6)]"
              >
                <div className="absolute inset-[14%] rounded-full bg-[linear-gradient(0deg,transparent_46%,#1a1a1a_46%_54%,transparent_54%),linear-gradient(90deg,transparent_46%,#1a1a1a_46%_54%,transparent_54%)] opacity-55" />
              </motion.div>

              {/* Sparks flotando */}
              {[
                { top:'4%', right:'8%', size:6, delay:0 },
                { top:'50%', right:'2%', size:4, delay:0.8 },
                { bottom:'20%', right:'25%', size:5, delay:1.5 },
                { top:'30%', left:'2%', size:3, delay:2.5 },
                { bottom:'50%', right:'5%', size:5, delay:0.5 },
                { top:'12%', left:'15%', size:3, delay:1.8 },
              ].map((spark, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-gold"
                  style={{
                    width: spark.size,
                    height: spark.size,
                    top: spark.top,
                    bottom: spark.bottom,
                    left: spark.left,
                    right: spark.right,
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1.4, 0.8],
                    boxShadow: ['0 0 10px 2px rgba(245,166,35,.5)', '0 0 20px 6px rgba(245,166,35,.9)', '0 0 10px 2px rgba(245,166,35,.5)'],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: spark.delay }}
                />
              ))}
            </motion.div>

          </div>
        </div>
      </AuroraBackground>

      {/* Results Ticker — cinta de resultados (ARRIBA del grid) */}
      <section className="py-5 relative overflow-hidden z-[3] mt-3">
        {/* Background con glow morado y dorado */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute left-[20%] top-[-50%] w-[300px] h-[300px] rounded-full bg-purple-mid/15 blur-[100px] pointer-events-none" />
        <div className="absolute right-[20%] bottom-[-50%] w-[250px] h-[250px] rounded-full bg-gold/15 blur-[80px] pointer-events-none" />
        
        <div className="relative border-y border-gold/20 py-2.5">
          {/* Antes: glow en esquinas */}
          <div className="absolute top-0 left-[10%] w-[80%] h-[1px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          
          <div className="flex items-center gap-4 absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-black via-black/80 to-transparent px-6">
            <span className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              EN VIVO
            </span>
          </div>
          
          <Marquee speed={28} className="ml-24">
            {[
              { eq1:'Ing. Sistemas', eq2:'Ing. Civil', score:'3 - 1', estado:'Final', color:'#22C55E' },
              { eq1:'Ing. Industrial', eq2:'Ing. Sistemas', score:'0 - 2', estado:'Final', color:'#F59E0B' },
              { eq1:'Ing. Mecánica', eq2:'Ing. Eléctrica', score:'1 - 1', estado:'42\'', color:'#3B82F6' },
              { eq1:'Ing. Sistemas', eq2:'Ing. Industrial', score:'-', estado:'Sáb 8PM', color:'#22C55E' },
              { eq1:'Ing. Civil', eq2:'Ing. Mecánica', score:'-', estado:'Dom 5PM', color:'#EF4444' },
              { eq1:'Ciberseguridad', eq2:'IA', score:'4 - 2', estado:'Final', color:'#8B5CF6' },
              { eq1:'Ing. Estadística', eq2:'Ing. Sistemas', score:'0 - 0', estado:'18\'', color:'#06B6D4' },
            ].map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 whitespace-nowrap hover:bg-white/10 hover:border-gold/30 transition-all"
              >
                <span className="font-semibold text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                  {m.eq1}
                </span>
                <span className="text-[10px] text-text-faint font-bold">VS</span>
                <span className="font-semibold text-sm flex items-center gap-1.5">
                  {m.eq2}
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                </span>
                <span className="w-px h-4 bg-border mx-0.5" />
                <span className={`font-bold text-sm min-w-[32px] text-center ${
                  m.estado === 'Final' ? 'text-text-faint' 
                  : m.estado.includes("'") ? 'text-gold' 
                  : 'text-purple-mid'
                }`}>
                  {m.score}
                </span>
                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full ${
                  m.estado === 'Final' ? 'bg-white/10 text-text-faint' 
                  : m.estado.includes("'") ? 'bg-gold/20 text-gold animate-pulse' 
                  : 'bg-purple-mid/20 text-purple-mid'
                }`}>
                  {m.estado}
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* Features simples */}
      <section className="pb-[90px] relative z-[3]">
        <div className="absolute left-[-10%] top-[-20%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[120px] pointer-events-none" />
        <div className="absolute right-[-5%] bottom-[-10%] w-[400px] h-[400px] rounded-full bg-gold/15 blur-[100px] pointer-events-none" />
        
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
        <div className="absolute top-[20%] left-[30%] w-[600px] h-[600px] rounded-full bg-purple-deep/15 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-gold/15 blur-[100px] pointer-events-none" />
        <div className="absolute top-[60%] left-[5%] w-[200px] h-[200px] rounded-full bg-purple-mid/10 blur-[80px] pointer-events-none" />
        {/* Borde decorativo superior */}
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

      <Footer />
    </div>
  )
}
