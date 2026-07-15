/**
 * Ejemplo de uso de los DashboardComponents para replicar la estética del dashboard
 *
 * Uso:
 *   import DashboardExample from './DashboardExample'
 *   <DashboardExample />
 */

import { useState } from "react";
import { DashboardHeader, GlassCard, DashboardSection, ProfileHero, StatCard, GoldButton, OutlineButton } from "@/components/DashboardComponents";

export default function DashboardExample() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationCount] = useState(3);

  return (
    <div className="min-h-screen bg-black">
      {/* ─── HEADER ─── */}
      <DashboardHeader
        title="Panel Jugador"
        userName="Hola 👋"
        userAvatar="https://i.pravatar.cc/72?img=13"
        notificationCount={notificationCount}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onChatClick={() => console.log("Chat clicked")}
        onNotificationsClick={() => console.log("Notifications clicked")}
        onProfileClick={() => console.log("Profile clicked")}
      />

      {/* ─── MAIN CONTENT ─── */}
      <DashboardSection>

        {/* ═══ PROFILE HERO ═══ */}
        <ProfileHero
          avatarContent={<span>7</span>}
          name="Juan Camilo Rivera"
          subtitle="Delantero · Camiseta #7"
          stats={[
            { icon: "⚽", label: "12 goles" },
            { icon: "📋", label: "8 partidos" },
            { icon: "🟨", label: "2 tarjetas" },
          ]}
          action={
            <GoldButton>Editar perfil</GoldButton>
          }
        />

        {/* ═══ 3-COLUMN GRID (equipo + invitaciones) ═══ */}
        <section className="grid grid-cols-3 max-lg:grid-cols-1 gap-5 mb-[26px]">
          {/* Mi equipo */}
          <GlassCard className="p-5">
            <h3 className="text-[14.5px] font-semibold tracking-[.3px] mb-3 flex items-center gap-2 text-white">
              <span className="text-gold">👥</span>
              <span className="text-gold">Mi equipo</span>
            </h3>
            <div className="text-center py-4">
              <p className="text-4xl mb-2 opacity-60">🏠</p>
              <p className="text-sm text-text-muted mb-4">No pertenecés a ningún equipo aún</p>
              <div className="flex gap-2 justify-center">
                <GoldButton>Buscar equipo</GoldButton>
                <OutlineButton>Crear equipo</OutlineButton>
              </div>
            </div>
          </GlassCard>

          {/* Invitaciones */}
          <GlassCard className="p-5">
            <h3 className="text-[14.5px] font-semibold tracking-[.3px] mb-3 flex items-center gap-2 text-white">
              <span className="text-gold">📨</span>
              <span className="text-gold">Invitaciones</span>
            </h3>
            <div className="text-center py-4">
              <p className="text-4xl mb-2 opacity-60">🔔</p>
              <p className="text-sm text-text-muted">No tenés invitaciones pendientes</p>
              <p className="text-xs text-text-faint mt-1">Las invitaciones de capitanes aparecerán acá</p>
            </div>
          </GlassCard>

          {/* Placeholder para tercera columna */}
          <GlassCard className="p-5">
            <h3 className="text-[14.5px] font-semibold tracking-[.3px] mb-3 flex items-center gap-2 text-white">
              <span className="text-gold">📊</span>
              <span className="text-gold">Mis stats</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Partidos jugados</span>
                <span className="text-white font-bold">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Goles</span>
                <span className="text-white font-bold">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Asistencias</span>
                <span className="text-white font-bold">5</span>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* ═══ 2-COLUMN ASYMMETRIC GRID (torneos + partidos) ═══ */}
        <section className="grid grid-cols-[1.3fr_1fr] gap-5 mb-[22px] items-start max-lg:grid-cols-1">

          {/* Torneos disponibles */}
          <GlassCard className="p-[22px_24px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14.5px] font-semibold tracking-[.3px] text-white">
                🏆 Torneos disponibles
              </h3>
              <a href="/torneos" className="text-xs text-gold font-bold hover:text-gold-dark transition-colors">
                Ver todos →
              </a>
            </div>
            <div className="space-y-3">
              {[
                { nombre: "TechCup 2026-II", fecha: "Ago 20 – Nov 30, 2026", categoria: "Fútbol 11", estado: "Próximo" },
                { nombre: "TechCup Relámpago 2026", fecha: "Sep 2026", categoria: "Fútbol 11", estado: "Próximo" },
                { nombre: "TechCup Futsal 2026", fecha: "Sep 1 – Dic 15, 2026", categoria: "Futsal", estado: "Próximo" },
              ].map((torneo, i) => (
                <button
                  key={i}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-black/30 backdrop-blur-sm border border-purple-mid/20 hover:border-gold/40 hover:bg-purple-deep/40 transition-all cursor-pointer group text-left"
                >
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-gold transition-colors">
                      {torneo.nombre}
                    </p>
                    <p className="text-xs text-text-muted">{torneo.fecha} · {torneo.categoria}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-gold/20 text-gold border border-purple-mid/40">
                    {torneo.estado}
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Próximos partidos */}
          <GlassCard className="p-[22px_24px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14.5px] font-semibold tracking-[.3px] text-white">
                📅 Próximos partidos
              </h3>
              <a href="/mis-partidos" className="text-xs text-gold font-bold hover:text-gold-dark transition-colors">
                Ver todos →
              </a>
            </div>
            <div className="space-y-0">
              {[
                { dia: "11", mes: "MAY", eq1: "Sistemas FC", eq2: "Los Bits", lugar: "Cancha Principal", hora: "6:00 PM" },
                { dia: "11", mes: "MAY", eq1: "Tigres FC", eq2: "Code United", lugar: "Cancha Principal", hora: "8:00 PM" },
                { dia: "12", mes: "MAY", eq1: "Dragones FC", eq2: "IA Warriors", lugar: "Cancha Principal 2", hora: "7:00 PM" },
              ].map((partido, i) => (
                <a
                  key={i}
                  href={`/partido/${i + 1}`}
                  className="flex items-center gap-3.5 py-3 border-b border-gold/10 last:border-b-0 hover:bg-white/[0.05] transition-all rounded-lg -mx-2 px-2 group"
                >
                  <div className="w-[52px] text-center flex-shrink-0 bg-purple-deep/40 rounded-lg py-1 border border-purple-mid/20">
                    <b className="block font-[family-name:var(--font-display)] text-lg text-white">{partido.dia}</b>
                    <span className="text-[10px] text-text-muted uppercase">{partido.mes}</span>
                  </div>
                  <div className="flex-1 text-[13.5px] font-semibold text-white">
                    {partido.eq1} <span className="text-text-faint">vs</span> {partido.eq2}
                    <small className="block font-normal text-text-muted text-[11.5px] mt-0.5">{partido.lugar}</small>
                  </div>
                  <div className="text-xs text-gold font-bold bg-gold/10 px-2.5 py-1 rounded-full">{partido.hora}</div>
                </a>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* ═══ CTA SECTION ═══ */}
        <section className="flex items-center justify-between gap-5 p-[26px_30px] rounded-[18px] bg-black/50 backdrop-blur-sm border border-white/10 mt-6 max-md:flex-col max-md:items-start">
          <div>
            <h3 className="font-[family-name:var(--font-display)] uppercase text-xl leading-tight mb-1 text-white">
              Chat de equipo
            </h3>
            <p className="text-[13px] text-text-muted">
              Comunicate con tu equipo, coordiná estrategias y recibí novedades del torneo.
            </p>
          </div>
          <button className="group relative cursor-pointer overflow-hidden rounded-full border border-gold/40 bg-gold/5 px-8 py-3 font-bold text-gold transition-all duration-500 hover:bg-gold/15">
            <div className="relative z-10 flex items-center gap-2">
              <span className="inline-block transition-all duration-500 translate-x-0 opacity-100">Ir al chat</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="inline-block h-4 w-4 transition-all duration-500 translate-x-[-20px] opacity-0"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
            <div
              className="absolute inset-0 z-0 transition-all duration-500 opacity-0"
              style={{ background: "linear-gradient(90deg, transparent, rgba(245, 166, 35, 0.15), transparent)", transform: "translateX(-100%)" }}
            />
          </button>
        </section>

      </DashboardSection>
    </div>
  );
}
