/**
 * Demo users para testing y presentaciones.
 * Se usan en Login.tsx para quick-login cuando la API no está disponible.
 */
export interface DemoUser {
  email: string
  name: string
  role: 'jugador' | 'organizador' | 'arbitro'
  isCaptain: boolean
  avatar?: string
}

export const DEMO_USERS: DemoUser[] = [
  { email: 'juan.vera-a@mail.escuelaing.edu.co', name: 'Juan Vera', role: 'organizador', isCaptain: true },
  { email: 'mabel.bernal-a@mail.escuelaing.edu.co', name: 'Mabel Bernal', role: 'organizador', isCaptain: true },
  { email: 'carlos.rojas-r@mail.escuelaing.edu.co', name: 'Carlos Rojas', role: 'jugador', isCaptain: false },
  { email: 'nicolas.prieto-r@mail.escuelaing.edu.co', name: 'Nicolás Prieto', role: 'jugador', isCaptain: false },
  { email: 'jose.garcia-ch@mail.escuelaing.edu.co', name: 'José García', role: 'jugador', isCaptain: true },
  { email: 'hever.barrera@mail.escuelaing.edu.co', name: 'Hever Barrera', role: 'organizador', isCaptain: false },
  { email: 'sara.arteaga-r@mail.escuelaing.edu.co', name: 'Sara Arteaga', role: 'organizador', isCaptain: false },
  { email: 'tomas.quiceno-o@mail.escuelaing.edu.co', name: 'Tomás Quiceno', role: 'organizador', isCaptain: true },
  { email: 'julian.tinjaca-c@mail.escuelaing.edu.co', name: 'Julián Tinjacá', role: 'jugador', isCaptain: false },
  { email: 'johan.beltran-g@mail.escuelaing.edu.co', name: 'Johan Beltrán', role: 'arbitro', isCaptain: false },
  { email: 'jhonatan.modelo-r@mail.escuelaing.edu.co', name: 'Jhonatan Modelo', role: 'organizador', isCaptain: true },
]
