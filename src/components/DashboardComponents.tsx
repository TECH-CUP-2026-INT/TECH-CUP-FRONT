"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";

/* ─────────────────────────────────────────
   DashboardHeader — Barra de navegación
   ───────────────────────────────────────── */
interface DashboardHeaderProps {
  title: string;
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onMenuClick?: () => void;
  onChatClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
}

export function DashboardHeader({
  title,
  userName = "Hola 👋",
  userAvatar,
  notificationCount = 0,
  onMenuClick,
  onChatClick,
  onNotificationsClick,
  onProfileClick,
}: DashboardHeaderProps) {
  return (
    <header className="fixed top-0 z-50 flex items-center justify-between px-8 py-[18px] bg-[#2F1350] dark:bg-[#100D1E] border-b border-white/10 max-md:px-4 transition-all duration-300 right-0 left-0">
      {/* Línea gradiente superior */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-mid/60 to-transparent" />

      {/* Izquierda: menú + título */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-white p-1.5 hover:text-gold transition-colors"
          aria-label="Menú"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </button>
        <h1 className="text-[17px] font-bold text-white">{title}</h1>
      </div>

      {/* Derecha: acciones de usuario */}
      <div className="flex items-center gap-[18px]">
        <span className="text-[14px] text-text-muted font-medium hidden md:block">
          {userName}
        </span>

        <button
          onClick={onChatClick}
          className="relative p-1.5 rounded-lg transition-all bg-transparent text-gray-light border border-transparent hover:border-purple-mid/40 hover:bg-purple-mid/10"
          aria-label="Chat"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
          </svg>
        </button>

        <button
          onClick={onNotificationsClick}
          className="relative p-1.5 rounded-lg transition-all bg-transparent text-gray-light border border-transparent hover:border-purple-mid/40 hover:bg-purple-mid/10"
          aria-label="Notificaciones"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 003.4 0" />
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -top-[5px] -right-[7px] bg-purple-mid text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-black">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Toggle oscuro */}
        <button
          className="relative p-1.5 rounded-lg transition-all bg-transparent text-gray-light border border-transparent hover:border-purple-mid/40 hover:bg-purple-mid/10"
          aria-label="Alternar modo oscuro"
        >
          <span className="flex" style={{ opacity: 1, transform: "none" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-sun text-amber-500"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          </span>
        </button>

        {/* Avatar */}
        <button
          onClick={onProfileClick}
          className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gold/40 ring-offset-2 ring-offset-black hover:ring-gold transition-all cursor-pointer"
          aria-label="Perfil"
        >
          <img
            className="w-full h-full object-cover"
            src={userAvatar || "https://i.pravatar.cc/72?img=13"}
            alt=""
          />
        </button>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────
   GlassCard — Tarjeta glassmórfica con spotlights
   ───────────────────────────────────────── */
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300",
        "bg-black/40 backdrop-blur-sm border border-purple-mid/30",
        "shadow-lg shadow-purple-mid/10",
        hover && "hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   DashboardSection — Sección completa del dashboard
   ───────────────────────────────────────── */
interface DashboardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({ children, className }: DashboardSectionProps) {
  return (
    <main className="p-8 pb-[60px] max-md:p-5 relative">
      {/* Orbes de fondo atmosphere */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-mid/15 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-gold/15 blur-[120px] pointer-events-none" />
      <div className={cn("relative z-10", className)}>{children}</div>
    </main>
  );
}

/* ─────────────────────────────────────────
   ProfileHero — Banner de perfil con imagen de fondo
   ───────────────────────────────────────── */
interface ProfileHeroProps {
  imageSrc?: string;
  avatarContent: React.ReactNode;
  name: string;
  subtitle: string;
  stats?: { icon: string; label: string }[];
  action?: React.ReactNode;
}

export function ProfileHero({
  imageSrc = "/dash-board.jpg",
  avatarContent,
  name,
  subtitle,
  stats = [],
  action,
}: ProfileHeroProps) {
  return (
    <section
      className="rounded-2xl mb-[26px] relative overflow-hidden border border-purple-mid/30"
      style={{ minHeight: "280px" }}
    >
      <img
        alt=""
        className="absolute inset-0 w-full h-full"
        src={imageSrc}
        style={{ objectFit: "cover", objectPosition: "center center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="relative z-10 flex items-center gap-6 flex-wrap px-10">
        {/* Avatar circular con gradiente */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-purple-mid flex items-center justify-center text-3xl font-bold text-white ring-2 ring-gold/40">
          {avatarContent}
        </div>

        {/* Info del usuario */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{name}</h2>
          <p className="text-sm text-gold/70">{subtitle}</p>
          {stats.length > 0 && (
            <div className="flex gap-4 mt-2 text-xs text-text-muted">
              {stats.map((s, i) => (
                <span key={i}>
                  {s.icon} {s.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Acción (ej: botón editar) */}
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   StatCard — Tarjeta de estadísticas (4 columnas)
   ───────────────────────────────────────── */
interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  accent?: "gold" | "purple";
}

export function StatCard({ icon, value, label, accent = "purple" }: StatCardProps) {
  return (
    <GlassCard className="p-5 flex gap-3.5 items-center">
      <span
        className={cn(
          "w-[46px] h-[46px] rounded-xl flex items-center justify-center flex-shrink-0",
          accent === "purple" ? "bg-purple-mid/20 text-[#b39ef2]" : "bg-gold/15 text-gold"
        )}
      >
        {icon}
      </span>
      <div>
        <div className="font-[family-name:var(--font-display)] text-[26px] leading-none text-white">
          {value}
        </div>
        <div className="text-xs text-text-muted mt-1">{label}</div>
      </div>
    </GlassCard>
  );
}

/* ─────────────────────────────────────────
   Botones reutilizables
   ───────────────────────────────────────── */
export function GoldButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "rounded-full bg-gold/15 backdrop-blur-md border border-gold/40 text-gold",
        "hover:bg-gold/25 hover:text-white shadow-lg shadow-gold/10",
        "text-xs font-bold px-4 py-2 h-9",
        "transition-all inline-flex items-center justify-center gap-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function OutlineButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "rounded-full bg-white/5 backdrop-blur-md border border-purple-mid/40 text-gold",
        "hover:bg-gold/15 hover:border-gold/60 hover:text-white",
        "text-xs px-4 py-2 h-9",
        "transition-all inline-flex items-center justify-center gap-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
