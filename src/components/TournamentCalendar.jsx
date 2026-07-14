import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Square,
  List,
  MapPin,
  Shield,
  Swords,
  Cat,
  Code2,
  Zap,
  Flame,
} from "lucide-react";

/**
 * TournamentCalendar
 * Réplica de un calendario semanal de torneo (estilo esports),
 * mismos colores, tipografía y estructura que el diseño original.
 */

// ---------- Datos de ejemplo (mismos partidos del diseño) ----------

const TEAM_ICONS = {
  "SYS FC": { icon: Shield, bg: "#7A1F2B", fg: "#F3D9DC" },
  "IA WAR": { icon: Swords, bg: "#E7E7EA", fg: "#3A3A42" },
  TIGG: { icon: Cat, bg: "#E7B23A", fg: "#3A2A05" },
  TIG: { icon: Cat, bg: "#E7B23A", fg: "#3A2A05" },
  CODE: { icon: Code2, bg: "#2B2B33", fg: "#C9C9D6" },
  BITS: { icon: Zap, bg: "#E7E7EA", fg: "#3A3A42" },
  DRAG: { icon: Flame, bg: "#1A1A1F", fg: "#C9C9D6" },
};

const GROUP_STYLES = {
  "Grupo A": { bg: "#7C3AED", fg: "#F3EEFF" },
  "Grupo B": { bg: "#E7A93A", fg: "#2E2205" },
  "Grupo C": { bg: "#7C3AED", fg: "#F3EEFF" },
};

const DAYS = [
  { key: "LUN", date: "12 MAY", full: "Lunes 12 de Mayo" },
  { key: "MAR", date: "13 MAY", full: "Martes 13 de Mayo" },
  { key: "MIE", date: "1 MAY", full: "Miércoles", highlight: true },
  { key: "JUE", date: "15 MAY", full: "Jueves 15 de Mayo" },
  { key: "VIE", date: "16 MAY", full: "Viernes 16 de Mayo" },
  { key: "SAB", date: "17 MAY", full: "Sábado 17 de Mayo" },
  { key: "DOM", date: "18 MAY", full: "Domingo 18 de Mayo" },
];

const START_HOUR = 8;
const END_HOUR = 21;
const HOUR_HEIGHT = 60; // px por hora

const MATCHES = [
  {
    id: 1,
    day: 1, // MAR
    start: 10 * 60 + 30,
    duration: 60,
    group: "Grupo B",
    home: "SYS FC",
    away: "IA WAR",
    court: "Cancha 2",
  },
  {
    id: 2,
    day: 2, // MIE
    start: 12 * 60,
    duration: 90,
    group: "Grupo A",
    home: "IA WAR",
    away: "CODE",
    court: "Cancha 1",
  },
  {
    id: 3,
    day: 2, // MIE
    start: 19 * 60 + 30,
    duration: 60,
    group: "Grupo A",
    home: "CODE",
    away: "DRAG",
    court: "Cancha 1",
  },
  {
    id: 4,
    day: 3, // JUE
    start: 15 * 60 + 30,
    duration: 60,
    group: "Grupo C",
    home: "DRAG",
    away: "BITS",
    court: "Cancha 3",
  },
  {
    id: 5,
    day: 4, // VIE
    start: 16 * 60,
    duration: 60,
    group: "Grupo B",
    home: "TIG",
    away: "SYS FC",
    court: "Cancha 1",
  },
  {
    id: 6,
    day: 5, // SAB
    start: 9 * 60,
    duration: 75,
    group: "Grupo A",
    home: "TIGG",
    away: "CODE",
    court: "Cancha 1",
  },
  {
    id: 7,
    day: 0, // LUN
    start: 18 * 60,
    duration: 60,
    group: "Grupo C",
    home: "BITS",
    away: "IA WAR",
    court: "Cancha 2",
  },
  {
    id: 8,
    day: 6, // DOM
    start: 20 * 60,
    duration: 60,
    group: "Grupo B",
    home: "SYS FC",
    away: "BITS",
    court: "Cancha 3",
  },
];

// Línea de "ahora" (estática, como en el diseño ~14:00)
const NOW_MINUTES = 14 * 60;

// ---------- Subcomponentes ----------

function TeamBadge({ team }) {
  const config = TEAM_ICONS[team] || {
    icon: Shield,
    bg: "#2B2B33",
    fg: "#C9C9D6",
  };
  const Icon = config.icon;
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: 26,
        height: 26,
        backgroundColor: config.bg,
        color: config.fg,
      }}
    >
      <Icon size={14} strokeWidth={2.5} />
    </div>
  );
}

function GroupPill({ group }) {
  const style = GROUP_STYLES[group] || { bg: "#7C3AED", fg: "#fff" };
  return (
    <span
      className="text-[10px] font-bold px-2 py-[2px] rounded-full leading-none whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.fg }}
    >
      {group.replace("Grupo ", "Grupo ")}
    </span>
  );
}

function MatchCard({ match }) {
  const top = ((match.start - START_HOUR * 60) / 60) * HOUR_HEIGHT;
  const height = (match.duration / 60) * HOUR_HEIGHT;
  const timeLabel = minutesToLabel(match.start);

  return (
    <div
      className="absolute left-1 right-1 rounded-xl p-2.5 flex flex-col gap-1.5 cursor-pointer transition-transform hover:-translate-y-[1px]"
      style={{
        top,
        height: Math.max(height, 70),
        backgroundColor: "#1B1524",
        border: "1px solid #322A44",
        boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] font-medium" style={{ color: "#9C93B5" }}>
          {timeLabel}
        </span>
        <GroupPill group={match.group} />
      </div>

      <div className="flex items-center gap-1.5">
        <TeamBadge team={match.home} />
        <span
          className="text-[10px] font-semibold"
          style={{ color: "#6E6685" }}
        >
          vs
        </span>
        <TeamBadge team={match.away} />
      </div>

      <div className="text-[12px] font-semibold text-white leading-tight truncate">
        {match.home} <span style={{ color: "#8B84A0" }}>vs</span> {match.away}
      </div>

      <div
        className="flex items-center gap-1 text-[10.5px] mt-auto"
        style={{ color: "#8B84A0" }}
      >
        <MapPin size={11} />
        <span>{match.court}</span>
      </div>
    </div>
  );
}

function minutesToLabel(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ---------- Componente principal ----------

export default function TournamentCalendar() {
  const [view, setView] = useState("Semana");

  const hours = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) hours.push(h);

  const nowTop = ((NOW_MINUTES - START_HOUR * 60) / 60) * HOUR_HEIGHT;

  return (
    <div
      className="w-full flex flex-col font-sans"
      style={{ backgroundColor: "#0D0916", color: "#E9E6F0" }}
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between px-6 py-4 flex-wrap gap-3">
        {/* Tabs de vista */}
        <div
          className="flex items-center rounded-xl p-1 gap-1"
          style={{ backgroundColor: "#171020" }}
        >
          {[
            { label: "Semana", icon: CalendarIcon },
            { label: "Día", icon: Square },
            { label: "Lista", icon: List },
          ].map(({ label, icon: Icon }) => {
            const active = view === label;
            return (
              <button
                key={label}
                onClick={() => setView(label)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-colors"
                style={{
                  backgroundColor: active ? "#7C3AED" : "transparent",
                  color: active ? "#FFFFFF" : "#9C93B5",
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Navegación de fecha */}
        <div className="flex items-center gap-3">
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: "#171020", color: "#9C93B5" }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[15px] font-semibold text-white whitespace-nowrap">
            12 – 18 de Mayo, 2024
          </span>
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: "#171020", color: "#9C93B5" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Botón Hoy */}
        <button
          className="px-4 py-2 rounded-xl text-[13px] font-semibold"
          style={{
            backgroundColor: "#171020",
            color: "#E9E6F0",
            border: "1px solid #2A2236",
          }}
        >
          Hoy
        </button>
      </div>

      {/* Encabezado de días */}
      <div
        className="grid sticky top-0 z-10"
        style={{
          gridTemplateColumns: "64px repeat(7, 1fr)",
          backgroundColor: "#0D0916",
          borderBottom: "1px solid #201933",
        }}
      >
        <div />
        {DAYS.map((day) => (
          <div
            key={day.key}
            className="flex flex-col items-center justify-center py-3 gap-1"
          >
            <span
              className="text-[11px] font-semibold tracking-wide"
              style={{ color: day.highlight ? "#E9E6F0" : "#8B84A0" }}
            >
              {day.key}
            </span>
            {day.highlight ? (
              <span
                className="flex items-center justify-center rounded-full text-[12px] font-bold"
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#7C3AED",
                  color: "#fff",
                }}
              >
                {day.date.split(" ")[0]}
              </span>
            ) : (
              <span className="text-[12px] font-medium" style={{ color: "#6E6685" }}>
                {day.date}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Cuerpo del calendario */}
      <div className="flex-1 overflow-auto">
        <div
          className="grid relative"
          style={{ gridTemplateColumns: "64px repeat(7, 1fr)" }}
        >
          {/* Columna de "All day" + horas */}
          <div>
            <div
              className="flex items-start justify-end pr-2 text-[10.5px]"
              style={{
                height: 36,
                color: "#6E6685",
                borderBottom: "1px solid #201933",
              }}
            >
              All day
            </div>
            {hours.map((h) => (
              <div
                key={h}
                className="flex items-start justify-end pr-2 text-[10.5px] -translate-y-2"
                style={{ height: HOUR_HEIGHT, color: "#6E6685" }}
              >
                {String(h).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Columnas de días */}
          {DAYS.map((day, dayIndex) => (
            <div
              key={day.key}
              className="relative"
              style={{
                borderLeft: "1px solid #201933",
                backgroundColor: day.highlight
                  ? "rgba(124,58,237,0.06)"
                  : "transparent",
              }}
            >
              {/* All day row */}
              <div style={{ height: 36, borderBottom: "1px solid #201933" }} />

              {/* Líneas de hora */}
              {hours.map((h) => (
                <div
                  key={h}
                  style={{
                    height: HOUR_HEIGHT,
                    borderBottom: "1px solid #17111f",
                  }}
                />
              ))}

              {/* Línea de "ahora" solo en la columna resaltada */}
              {day.highlight && (
                <div
                  className="absolute left-0 right-0 flex items-center z-20"
                  style={{ top: nowTop + 36 }}
                >
                  <div
                    className="rounded-full -ml-[5px]"
                    style={{
                      width: 9,
                      height: 9,
                      backgroundColor: "#F59E0B",
                    }}
                  />
                  <div
                    className="flex-1"
                    style={{ height: 1.5, backgroundColor: "#F59E0B" }}
                  />
                </div>
              )}

              {/* Partidos */}
              <div className="absolute inset-0" style={{ top: 36 }}>
                {MATCHES.filter((m) => m.day === dayIndex).map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
