import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from '@/hooks/auth/useAuth'
import { ThemeProvider } from '@/configs/theme'
import { StarfieldBackground } from '@/components/common/starfield-bg'
import { ErrorBoundary } from '@/components/common/error-boundary'

import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import DashboardJugador from '@/pages/DashboardJugador'
import DashboardAdmin from '@/pages/DashboardAdmin'
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
import CrearTorneo from '@/pages/CrearTorneo'
import InscribirEquipo from '@/pages/InscribirEquipo'
import Llaves from '@/pages/Llaves'
import Campus from '@/pages/Campus'
import Notificaciones from '@/pages/Notificaciones'
import Rankings from '@/pages/Rankings'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export default function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
      <AuthProvider>
      <StarfieldBackground className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none z-0 dark:hidden" style={{ backgroundImage: 'url(/images/fondo-landing2-claro.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.45 }} />
      <div className="fixed inset-0 pointer-events-none z-0 hidden dark:block" style={{ backgroundImage: 'url(/images/fondo-landing2.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3 }} />
      <ErrorBoundary>
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
        <Route path="/dashboard/jugador" element={<DashboardJugador />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/organizador" element={<DashboardAdmin />} />
        <Route path="/campus" element={<Campus />} />
        <Route path="/crear-torneo" element={<CrearTorneo />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/rankings" element={<Rankings />} />
      </Routes>
      </ErrorBoundary>
      </StarfieldBackground>
      </AuthProvider>
      </ThemeProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  )
}
