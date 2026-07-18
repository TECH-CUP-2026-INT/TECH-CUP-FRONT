import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#2F1350] dark:bg-[#100D1E] border-t border-white/10 dark:border-white/10 py-[60px] pb-[26px] text-white">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-[1.4fr_0.8fr_0.9fr_0.8fr] gap-10 mb-11 max-md:grid-cols-2 max-sm:grid-cols-1">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-[34px] h-[34px] rounded-lg overflow-hidden bg-black flex-shrink-0">
                <img src="/assets/logo.png" alt="TechCup" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-[family-name:var(--font-display)] font-bold text-lg tracking-[.5px] text-white">
                  TECH<span className="text-white/80">CUP</span>
                </span>
                <span className="text-[8.5px] tracking-[1.6px] text-white/80 font-semibold">INGENIERÍA DE SISTEMAS</span>
              </div>
            </div>
            <p className="text-[13.5px] text-white/85 leading-relaxed mt-3.5 max-w-[260px]">
              Generado por y para estudiantes.
            </p>
            <div className="mt-4 w-[170px]">
              <img src="/assets/logo-eci.png" alt="Escuela Colombiana de Ingeniería Julio Garavito" className="w-full h-auto object-contain" />
            </div>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="text-xs tracking-[1.2px] uppercase text-white/90 font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2.5">
              {[
                { href:'/', label:'Inicio' },
                { href:'/torneos', label:'Torneos y Equipos' },
                { href:'/calendario', label:'Calendario' },
              ].map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="text-[13.5px] text-white/85 hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Más información */}
          <div>
            <h4 className="text-xs tracking-[1.2px] uppercase text-white/90 font-semibold mb-4">Más información</h4>
            <ul className="space-y-2.5">
              {['Reglamento', 'Preguntas frecuentes', 'Contacto'].map(l => (
                <li key={l}><a href="#" className="text-[13.5px] text-white/85 hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-[1.2px] uppercase text-white/90 font-semibold mb-4">Síguenos</h4>
            <div className="flex gap-2.5 items-center">
              {/* Instagram con tooltip */}
              <div className="group relative cursor-pointer text-[17px] rounded-[10px]">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-[10px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 rounded-[15px]"
                  style={{ boxShadow: "inset 5px 5px 5px rgba(0,0,0,0.2), inset -5px -5px 15px rgba(255,255,255,0.1), 5px 5px 15px rgba(0,0,0,0.3), -5px -5px 15px rgba(255,255,255,0.1)" }}>
                  <div className="bg-[#2a2b2f] rounded-[10px_15px] p-[10px] border border-purple-mid/30">
                    <div className="flex gap-[10px]">
                      <div className="w-[50px] h-[50px] text-[25px] font-bold border border-purple-mid rounded-[10px] flex items-center justify-center bg-white text-purple-mid">TC</div>
                      <div className="flex flex-col text-white">
                        <div className="text-[17px] font-bold text-purple-mid">TechCup</div>
                        <div className="text-xs text-text-muted">@techcup</div>
                      </div>
                    </div>
                    <div className="text-xs text-text-muted pt-[5px]">1,200+ Followers</div>
                  </div>
                </div>
                <a href="https://www.instagram.com/techcup_eci?igsh=MTg2NDNoYmR2dDFkYg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="block relative no-underline text-white">
                  <div className="w-[55px] h-[55px] transition-transform duration-300 hover:scale-110">
                    <span className="absolute inset-0 border border-purple-mid/60 rounded-[15px] bg-purple-mid/10" />
                    <span className="absolute inset-0 rounded-[15px] transition-all duration-300 opacity-0 hover:opacity-100" style={{
                      background: "linear-gradient(135deg, #6D28D9 0%, #4C1D95 50%, #3B1264 100%)",
                    }} />
                    <span className="absolute inset-0 flex items-center justify-center text-[22px] z-10">
                      <svg fill="white" viewBox="0 0 448 512" height="1.2em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                      </svg>
                    </span>
                  </div>
                </a>
              </div>
              {/* Contacto */}
              <Link to="/contacto" aria-label="Contacto" className="block relative no-underline text-white">
                <div className="w-[55px] h-[55px] transition-transform duration-300 hover:scale-110">
                  <span className="absolute inset-0 border border-purple-mid/60 rounded-[15px] bg-purple-mid/10" />
                  <span className="absolute inset-0 rounded-[15px] transition-all duration-300 opacity-0 hover:opacity-100" style={{
                    background: "linear-gradient(135deg, #6D28D9 0%, #4C1D95 50%, #3B1264 100%)",
                  }} />
                  <span className="absolute inset-0 flex items-center justify-center text-[22px] z-10">
                    <svg fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 6l10 7 10-7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>

          <div className="border-t border-white/10 pt-[22px] text-[12.5px] text-white/70 text-center">
          © {new Date().getFullYear()} TechCup — Decanatura de Ingeniería de Sistemas. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
