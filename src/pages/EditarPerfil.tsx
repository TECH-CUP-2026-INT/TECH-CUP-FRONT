import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/shared/DashboardLayout'
import { SpotlightCard } from '@/components/ui/spotlight-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'
import { Camera, Lock, ArrowLeft, CheckCircle } from 'lucide-react'

const STORAGE_KEY = 'techcup_profile'

interface ProfileData {
  name: string
  program: string
  semester: string
  avatar: string
}

function loadProfile(): ProfileData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch { return null }
}

function saveProfile(data: ProfileData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export default function EditarPerfil() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const saved = useMemo(() => loadProfile(), [])

  const [name, setName] = useState(saved?.name || user?.name || 'Juan Camilo Rivera')
  const [program, setProgram] = useState(saved?.program || 'Ing. Sistemas')
  const [semester, setSemester] = useState(saved?.semester || '6')
  const [avatar] = useState(saved?.avatar || user?.avatar || 'https://i.pravatar.cc/150?img=13')
  const [savedMsg, setSavedMsg] = useState(false)

  const handleSave = () => {
    saveProfile({ name, program, semester, avatar })
    if (user) {
      const updated = { ...user, name }
      localStorage.setItem('techcup_user', JSON.stringify(updated))
    }
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2500)
  }

  return (
    <DashboardLayout title="Editar perfil">
      <main className="max-w-[680px] mx-auto px-8 py-8 pb-[60px]">
          <button onClick={() => navigate('/perfil')} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-gold transition-colors mb-6">
            <ArrowLeft size={16} /> Volver al perfil
          </button>

          <SpotlightCard accent="gold" className="bg-gradient-to-br from-purple-deep2/70 to-purple-black/80 border border-gold/20 rounded-2xl p-8 shadow-lg shadow-purple-900/20">
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase tracking-[.5px] mb-6 text-white">
              Editar <span className="text-gold">perfil</span>
            </h2>

            {/* Foto */}
            <div className="flex items-center gap-5 mb-8 max-md:flex-col">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gold/40 ring-offset-2 ring-offset-black">
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-purple-mid border-2 border-black flex items-center justify-center hover:bg-purple-deep2"><Camera size={12} className="text-white" /></button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="rounded-full border-gold text-gold bg-transparent hover:bg-gold/10 text-xs h-auto py-2 px-4">Subir foto</Button>
                <Button size="sm" variant="outline" className="rounded-full border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs h-auto py-2 px-4">Eliminar</Button>
              </div>
            </div>

            {/* Datos básicos */}
            <h3 className="text-xs text-gold/60 uppercase tracking-[.4px] font-semibold mb-4">Datos básicos</h3>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Nombre completo</label>
                <Input value={name} onChange={e => setName(e.target.value)} className="bg-black/40 border-gold/20 text-white rounded-xl h-11 focus-visible:border-gold placeholder:text-text-faint" />
              </div>
              <div className="relative">
                <label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Correo electrónico</label>
                <Input defaultValue={user?.email || 'correo@escuelaing.edu.co'} className="bg-black/40 border-gold/20 text-white/60 rounded-xl h-11 focus-visible:border-gold pr-10" disabled />
                <Lock size={14} className="absolute right-3 top-[38px] text-text-faint" />
              </div>
            </div>

            {/* Datos académicos */}
            <h3 className="text-xs text-gold/60 uppercase tracking-[.4px] font-semibold mb-4">Datos académicos</h3>
            <div className="grid grid-cols-2 gap-4 mb-8 max-md:grid-cols-1">
              <div>
                <label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Programa</label>
                <select value={program} onChange={e => setProgram(e.target.value)} className="w-full bg-black/40 border border-gold/20 text-white rounded-xl h-11 px-3 text-sm outline-none focus:border-gold">
                  <option>Ing. Sistemas</option><option>Ing. Industrial</option><option>Ing. Civil</option><option>Ing. Biomédica</option><option>Matemáticas</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-faint font-semibold uppercase tracking-[.4px] mb-1.5">Semestre</label>
                <select value={semester} onChange={e => setSemester(e.target.value)} className="w-full bg-black/40 border border-gold/20 text-white rounded-xl h-11 px-3 text-sm outline-none focus:border-gold">
                  {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>{s}° semestre</option>)}
                </select>
              </div>
            </div>

            {savedMsg && (
              <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-4">
                <CheckCircle size={16} /> Cambios guardados correctamente
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => navigate('/perfil')} className="rounded-full border-gold/30 text-gold hover:bg-gold/10 h-12 px-8">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="rounded-full bg-gold text-[#1A1206] hover:bg-gold-dark font-bold h-12 px-8 shadow-lg shadow-gold/20">
                Guardar cambios
              </Button>
            </div>
          </SpotlightCard>
        </main>
    </DashboardLayout>
  )
}
