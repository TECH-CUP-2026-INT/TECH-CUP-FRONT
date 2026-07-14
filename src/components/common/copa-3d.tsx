export function Copa3D() {
  return (
    <div className="relative w-full max-w-[300px] mx-auto aspect-[4/5] flex items-center justify-center select-none">
      {/* Golden ambient glow */}
      <div
        className="absolute inset-[8%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(200,133,26,0.35) 0%, rgba(200,133,26,0.08) 40%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'copa-glow 4s ease-in-out infinite alternate',
        }}
      />

      {/* Secondary glow — deeper */}
      <div
        className="absolute inset-[15%] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(245,166,35,0.2) 0%, transparent 60%)',
          filter: 'blur(60px)',
          animation: 'copa-glow 4s ease-in-out 1s infinite alternate',
        }}
      />

      {/* Trophy image — floating */}
      <div
        className="relative w-full aspect-[3/4] flex items-center justify-center"
        style={{ animation: 'copa-float 5s ease-in-out infinite' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/images/copa%20y%20manchas.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
          }}
        />
        {/* Contorno glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/copa%20y%20manchas.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center bottom',
            filter: 'blur(12px) brightness(1.1)',
            opacity: 0.2,
            animation: 'contour-glow 4s ease-in-out infinite alternate',
          }}
        />
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

      {/* Particle dots */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: `rgba(200,133,26,${0.3 + (i % 3) * 0.15})`,
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 2) * 50}%`,
            animation: `copa-particle ${3 + i * 0.5}s ease-in-out ${i * 0.4}s infinite alternate`,
          }}
        />
      ))}

      <style>{`
        @keyframes copa-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes copa-glow {
          0%   { opacity: 0.85; transform: scale(1); }
          100% { opacity: 1;    transform: scale(1.02); }
        }
        @keyframes copa-shimmer {
          0%   { transform: translateX(-120%); }
          50%  { transform: translateX(120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes copa-shadow {
          0%, 100% { transform: translateX(-50%) scaleX(1);   opacity: 0.5; }
          50%      { transform: translateX(-50%) scaleX(0.7); opacity: 0.3; }
        }
        @keyframes contour-glow {
          0%   { opacity: 0.15; }
          100% { opacity: 0.3;  }
        }
        @keyframes copa-particle {
          0%   { opacity: 0; transform: translateY(0) scale(0.5); }
          100% { opacity: 1; transform: translateY(-20px) scale(1); }
        }
      `}</style>
    </div>
  )
}
