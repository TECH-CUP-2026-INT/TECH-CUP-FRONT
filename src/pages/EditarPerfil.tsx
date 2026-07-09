import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/shared/Sidebar'
import AppTopbar from '@/components/shared/AppTopbar'
import Footer from '@/components/shared/Footer'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Camera, Lock, ArrowLeft } from 'lucide-react'

export default function EditarPerfil() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <AppTopbar title="Editar perfil" onMenuClick={() => setSidebarOpen(true)} />

        <main className="max-w-[680px] mx-auto px-8 py-8 pb-[60px]">
          <button onClick={() => navigate('/perfil')} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-gold transition-colors mb-6">
            <ArrowLeft size={16} /> Volver al perfil
          </button>

          <SpotlightCard accent="gold" className="bg-surface border border-border rounded-2xl p-8">
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-6">
              Editar <span className="text-gold">perfil</span>
            </h2>

            {/* Foto */}
            <div className="flex items-center gap-5 mb-8 max-md:flex-col">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gold/40 ring-offset-2 ring-offset-black">
                  <img src="https://i.pravatar.cc/150?img=13" alt="" className="w-full h-full object-cover" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-purple-mid border-2 border-black flex items-center justify-center hover:bg-purple-deep2"><Camera size={12} className="text-white" /></button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="rounded-full border-gold text-gold bg-transparent hover:bg-gold/10 text-xs h-auto py-2 px-4">Subir foto</Button>
                <Button size="sm" variant="outline" className="rounded-full border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs h-auto py-2 px-4">Eliminar</Button>
              </div>
            </div>

            {/* Datos básicos */}
            <h3 className="text-xs text-text-faint uppercase tracking-[.4px] font-semibold mb-4">Datos básicos</h3>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Nombre completo</label>
                <Input defaultValue="Juan Camilo Rivera" className="bg-black border-border text-white rounded-xl h-11 focus-visible:border-gold" />
              </div>
              <div className="relative">
                <label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Correo electrónico</label>
                <Input defaultValue="juan.rangel@escuelaing.edu.co" className="bg-black border-border text-white/60 rounded-xl h-11 focus-visible:border-gold pr-10" disabled />
                <Lock size={14} className="absolute right-3 top-[38px] text-text-faint" />
              </div>
            </div>

            {/* Datos académicos */}
            <h3 className="text-xs text-text-faint uppercase tracking-[.4px] font-semibold mb-4">Datos académicos</h3>
            <div className="grid grid-cols-2 gap-4 mb-8 max-md:grid-cols-1">
              <div>
                <label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Programa</label>
                <select className="w-full bg-black border border-border text-white rounded-xl h-11 px-3 text-sm outline-none focus:border-gold">
                  <option>Ing. Sistemas</option><option>Ing. Industrial</option><option>Ing. Civil</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Semestre</label>
                <select className="w-full bg-black border border-border text-white rounded-xl h-11 px-3 text-sm outline-none focus:border-gold">
                  {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} selected={s===6}>{s}° semestre</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => navigate('/perfil')} className="rounded-full border-border text-gray-light hover:bg-white/5 h-12 px-8">
                Cancelar
              </Button>
              <Button className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 px-8">
                Guardar cambios
              </Button>
            </div>
          </SpotlightCard>
        </main>
        <Footer />
      </div>
    </div>
  )
}
