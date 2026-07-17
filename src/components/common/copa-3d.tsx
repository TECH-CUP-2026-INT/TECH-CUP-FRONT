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
