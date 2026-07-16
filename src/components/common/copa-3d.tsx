export function Copa3D() {
  return (
    <div className="relative w-full max-w-[300px] mx-auto aspect-[4/5] flex items-center justify-center select-none">
      {/* Purple ambient glow */}
      <div
        className="absolute inset-[8%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.35) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'copa-glow 4s ease-in-out infinite alternate',
        }}
      />

      {/* Secondary glow — deeper */}
      <div
        className="absolute inset-[15%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.2) 0%, transparent 60%)',
          filter: 'blur(60px)',
          animation: 'copa-glow 4s ease-in-out 1s infinite alternate',
        }}
      />

      {/* Texto en lugar de la copa */}
      <div className="relative w-full aspect-[3/4] flex flex-col items-center justify-center text-center px-6">
        <span className="text-sm font-bold tracking-[2px] uppercase text-purple-mid mb-5">Torneos</span>
        <h3 className="font-[family-name:var(--font-display)] text-5xl uppercase text-white leading-[1.1] mb-5">
          Compite y<br />
          <span className="text-purple-mid">deja tu huella</span>
        </h3>
        <p className="text-lg text-white/60 max-w-[300px] leading-relaxed">
                    Inscribe tu equipo, sigue los resultados en vivo y vive la emoción del torneo.
        </p>
      </div>

      {/* Shadow on ground */}
      <div
        className="absolute bottom-[3%] left-1/2 w-[50%] h-[5%] rounded-full pointer-events-none"
        style={{
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, transparent 70%)',
          filter: 'blur(6px)',
          animation: 'copa-shadow 5s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes copa-glow {
          0%   { opacity: 0.85; transform: scale(1); }
          100% { opacity: 1;    transform: scale(1.02); }
        }
        @keyframes copa-shadow {
          0%, 100% { transform: translateX(-50%) scaleX(1);   opacity: 0.5; }
          50%      { transform: translateX(-50%) scaleX(0.7); opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
