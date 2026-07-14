import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '@/components/common/Sidebar'
import AppTopbar from '@/components/common/AppTopbar'
import Footer from '@/components/common/Footer'
import { SpotlightCard } from '@/components/common/spotlight-card'
import { Button } from '@/components/common/button'
import { Input } from '@/components/common/input'
import { Label } from '@/components/common/label'
import { ArrowLeft, ArrowRight, Check, Upload, Palette, Shirt } from 'lucide-react'

const colores = ['#6D28D9','#F5A623','#22C55E','#EF4444','#3B82F6','#EC4899','#14B8A6','#F97316','#8B5CF6','#000000','#FFFFFF','#1F1F28']
const diseños = ['SF','TC','FC','🚀','⚡','🛡️','🐯','🔥']

export default function CrearEquipo() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [paso, setPaso] = useState(1)
  const [nombre, setNombre] = useState('')
  const [colorP, setColorP] = useState('#6D28D9')
  const [colorS, setColorS] = useState('#F5A623')
  const [diseno, setDiseno] = useState('SF')
  const navigate = useNavigate()

  const preview = (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-black/50 border border-border">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black shadow-lg" style={{ backgroundColor: colorP, color: colorS }}>
        {diseno}
      </div>
      <div>
        <p className="font-[family-name:var(--font-display)] text-lg uppercase" style={{ color: colorP }}>{nombre || 'Mi equipo'}</p>
        <p className="text-xs text-text-muted">Preview en vivo</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <AppTopbar title="Crear equipo" onMenuClick={() => setSidebarOpen(true)} />
        <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
        <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />
        
        <main className="max-w-[600px] mx-auto px-8 py-8 pb-[60px] relative z-10">
          <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-8">
            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              {[1,2,3].map(p => (
                <div key={p} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${paso >= p ? 'bg-gold text-[#1A1206]' : 'bg-surface text-text-muted border border-border'}`}>{p}</div>
                  <span className={`text-xs font-semibold hidden md:block ${paso >= p ? 'text-gold' : 'text-text-muted'}`}>
                    {p === 1 ? 'Nombre' : p === 2 ? 'Colores' : 'Escudo'}
                  </span>
                  {p < 3 && <div className={`w-8 h-px mx-1 ${paso > p ? 'bg-gold' : 'bg-border'}`} />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {paso === 1 && (
                <motion.div key="p1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-1">Nombre del <span className="text-gold">equipo</span></h2>
                  <p className="text-sm text-text-muted mb-6">Elegí un nombre único para tu equipo.</p>
                  <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Nombre</Label>
                  <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej. Sistemas FC" className="bg-black border-border text-white rounded-xl h-12 mt-1.5 mb-6 focus-visible:border-gold" />
                  {preview}
                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setPaso(2)} disabled={!nombre.trim()} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark h-12 px-8 disabled:opacity-40">
                      Siguiente <ArrowRight size={16} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {paso === 2 && (
                <motion.div key="p2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-1">Colores del <span className="text-gold">equipo</span></h2>
                  <p className="text-sm text-text-muted mb-6">Elegí los colores que representen a tu equipo.</p>
                  <div className="mb-4">
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Color primario</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {colores.map(c => (
                        <button key={c} onClick={() => setColorP(c)} className={`w-9 h-9 rounded-xl border-2 transition-all ${colorP === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Color secundario</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {colores.map(c => (
                        <button key={c} onClick={() => setColorS(c)} className={`w-9 h-9 rounded-xl border-2 transition-all ${colorS === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  {preview}
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setPaso(1)} className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 flex-1"><ArrowLeft size={16} /> Anterior</Button>
                    <Button onClick={() => setPaso(3)} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark h-12 flex-1">Siguiente <ArrowRight size={16} /></Button>
                  </div>
                </motion.div>
              )}

              {paso === 3 && (
                <motion.div key="p3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase mb-1">Escudo del <span className="text-gold">equipo</span></h2>
                  <p className="text-sm text-text-muted mb-6">Elegí un diseño o subí tu propio escudo.</p>
                  <div className="mb-4">
                    <Label className="text-xs text-text-faint font-semibold uppercase tracking-[.4px]">Elegir diseño</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {diseños.map(d => (
                        <button key={d} onClick={() => setDiseno(d)} className={`h-14 rounded-xl flex items-center justify-center text-lg font-black transition-all ${diseno === d ? 'ring-2 ring-gold bg-gold/10' : 'bg-black/50 border border-border hover:border-gold/50'}`} style={{ backgroundColor: colorP, color: colorS }}>{d}</button>
                      ))}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full rounded-full border-border text-gray-light hover:bg-white/5 h-12 mb-6 gap-2">
                    <Upload size={16} /> Subir escudo propio
                  </Button>
                  {preview}
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setPaso(2)} className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 flex-1"><ArrowLeft size={16} /> Anterior</Button>
                    <Button onClick={() => { navigate('/inscribir-equipo') }} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark h-12 flex-1">
                      <Check size={16} /> Crear equipo
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </SpotlightCard>
        </main>
        <Footer />
      </div>
    </div>
  )
}
