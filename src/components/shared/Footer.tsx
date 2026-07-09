import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-purple-black border-t border-border py-[60px] pb-[26px]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_0.8fr] gap-10 mb-11 max-md:grid-cols-2 max-sm:grid-cols-1">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-[34px] h-[34px] rounded-lg overflow-hidden bg-purple-black flex-shrink-0">
                <img src="/assets/logo.png" alt="TechCup" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-[family-name:var(--font-display)] font-bold text-lg tracking-[.5px]">
                  TECH<span className="text-gold">CUP</span>
                </span>
                <span className="text-[8.5px] tracking-[1.6px] text-text-muted font-semibold">INGENIERÍA DE SISTEMAS</span>
              </div>
            </div>
            <p className="text-[13.5px] text-text-muted leading-relaxed mt-3.5 max-w-[260px]">
              Plataforma oficial de torneos de fútbol de la Decanatura de Ingeniería de Sistemas.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="text-xs tracking-[1.2px] uppercase text-gold font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2.5">
              {[
                { href:'/', label:'Inicio' },
                { href:'/torneos', label:'Torneos y Equipos' },
                { href:'/calendario', label:'Calendario' },
              ].map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-[13.5px] text-gray-light hover:text-gold transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Más información */}
          <div>
            <h4 className="text-xs tracking-[1.2px] uppercase text-gold font-semibold mb-4">Más información</h4>
            <ul className="space-y-2.5">
              {['Reglamento', 'Preguntas frecuentes', 'Contacto'].map(l => (
                <li key={l}><a href="#" className="text-[13.5px] text-gray-light hover:text-gold transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-[1.2px] uppercase text-gold font-semibold mb-4">Síguenos</h4>
            <div className="flex gap-2.5">
              {['ig','fb','tw','yt'].map(s => (
                <a key={s} href="#" aria-label={s} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-gray-light hover:border-gold hover:text-gold transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-[22px] text-[12.5px] text-text-faint text-center">
          © {new Date().getFullYear()} TechCup — Decanatura de Ingeniería de Sistemas. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
