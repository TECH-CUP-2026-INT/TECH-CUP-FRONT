import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth'
import { ThemeProvider } from '@/lib/theme'
import { StarfieldBackground } from '@/components/ui/starfield-bg'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import TorneosPublic from '@/pages/TorneosPublic'
import Calendario from '@/pages/Calendario'
import Contacto from '@/pages/Contacto'
import MatchDetail from '@/pages/MatchDetail'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import RefereeLogin from '@/pages/RefereeLogin'
import Chat from '@/pages/Chat'
import Perfil from '@/pages/Perfil'
import EditarPerfil from '@/pages/EditarPerfil'
import MiEquipo from '@/pages/MiEquipo'
import RecoverPassword from '@/pages/RecoverPassword'
import MisPartidos from '@/pages/MisPartidos'
import Estadisticas from '@/pages/Estadisticas'
import Soporte from '@/pages/Soporte'
import DetalleTorneo from '@/pages/DetalleTorneo'
import Arbitraje from '@/pages/Arbitraje'
import RefereeDashboard from '@/pages/RefereeDashboard'
import CrearEquipo from '@/pages/CrearEquipo'
import InscribirEquipo from '@/pages/InscribirEquipo'
import Llaves from '@/pages/Llaves'
import Campus from '@/pages/Campus'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
      <StarfieldBackground className="min-h-screen">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/torneos" element={<TorneosPublic />} />
        <Route path="/app/torneos" element={<TorneosPublic />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/app/calendario" element={<Calendario />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/app/contacto" element={<Contacto />} />
        <Route path="/partido/:id" element={<MatchDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/arbitro" element={<RefereeLogin />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfil/editar" element={<EditarPerfil />} />
        <Route path="/mi-equipo" element={<MiEquipo />} />
        <Route path="/recuperar" element={<RecoverPassword />} />
        <Route path="/mis-partidos" element={<MisPartidos />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/soporte" element={<Soporte />} />
        <Route path="/torneo/:id" element={<DetalleTorneo />} />
        <Route path="/arbitraje" element={<Arbitraje />} />
        <Route path="/arbitro/dashboard" element={<RefereeDashboard />} />
        <Route path="/crear-equipo" element={<CrearEquipo />} />
        <Route path="/inscribir-equipo" element={<InscribirEquipo />} />
        <Route path="/llaves" element={<Llaves />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campus" element={<Campus />} />
      </Routes>
      </StarfieldBackground>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
