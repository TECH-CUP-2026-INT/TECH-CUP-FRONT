import React from "react";
import { MapPin, Shield, Swords, Cat, Code2, Calendar } from "lucide-react";

/**
 * UpcomingMatches
 * Réplica de la tarjeta "Próximos partidos": lista de encuentros
 * con fecha destacada, equipos, hora, badge de grupo y cancha.
 */

const TEAM_ICONS = {
  "IA Warriors": { icon: Swords, bg: "#3B2E63", fg: "#C9B8F5" },
  "Code United": { icon: Code2, bg: "#7A1F2B", fg: "#F3D9DC" },
  "Tigres FC": { icon: Cat, bg: "#E7B23A", fg: "#3A2A05" },
  "Sistemas FC": { icon: Shield, bg: "#7A1F2B", fg: "#F3D9DC" },
};

const GROUP_STYLES = {
  "Grupo A": { bg: "#7C3AED", fg: "#F3EEFF" },
  "Grupo B": { bg: "#E7A93A", fg: "#2E2205" },
  "Grupo C": { bg: "#7C3AED", fg: "#F3EEFF" },
};

const MATCHES = [
  {
    id: 1,
    month: "MAY",
    day: 14,
    weekday: "MAR",
    time: "12:00",
    group: "Grupo A",
    home: "IA Warriors",
    away: "Code United",
    court: "Cancha 1",
  },
  {
    id: 2,
    month: "MAY",
    day: 15,
    weekday: "MIÉ",
    time: "16:00",
    group: "Grupo B",
    home: "Tigres FC",
    away: "Sistemas FC",
    court: "Cancha 1",
  },
  {
    id: 3,
    month: "MAY",
    day: 17,
    weekday: "VIE",
    time: "09:00",
    group: "Grupo A",
    home: "Tigres FC",
    away: "Code United",
    court: "Cancha 1",
  },
];

function TeamBadge({ team }) {
  const config = TEAM_ICONS[team] || { icon: Shield, bg: "#2B2B33", fg: "#C9C9D6" };
  const Icon = config.icon;
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{ width: 28, height: 28, backgroundColor: config.bg, color: config.fg }}
    >
      <Icon size={14} strokeWidth={2.5} />
    </div>
  );
}

function GroupPill({ group }) {
  const style = GROUP_STYLES[group] || { bg: "#7C3AED", fg: "#fff" };
  return (
    <span
      className="text-[10.5px] font-bold px-2.5 py-1 rounded-full leading-none whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.fg }}
    >
      {group}
    </span>
  );
}

function DateBadge({ month, day }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl shrink-0"
      style={{
        width: 46,
        backgroundColor: "#171020",
        border: "1px solid #2A2236",
        padding: "6px 0",
      }}
    >
      <span className="text-[10px] font-bold tracking-wide" style={{ color: "#E7A93A" }}>
        {month}
      </span>
      <span className="text-[16px] font-bold text-white leading-tight">{day}</span>
    </div>
  );
}

function MatchRow({ match }) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl"
      style={{ backgroundColor: "#171020", border: "1px solid #2A2236" }}
    >
      <DateBadge month={match.month} day={match.day} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <TeamBadge team={match.home} />
            <span className="text-[10.5px] font-semibold" style={{ color: "#6E6685" }}>
              vs
            </span>
            <TeamBadge team={match.away} />
            <span className="text-[13px] font-semibold text-white ml-1">
              {match.time}
            </span>
          </div>
          <GroupPill group={match.group} />
        </div>

        <div className="text-[13px] font-semibold text-white truncate">
          {match.home} <span style={{ color: "#8B84A0", fontWeight: 500 }}>vs</span>{" "}
          {match.away}
        </div>

        <div
          className="flex items-center gap-1 text-[11.5px] mt-1"
          style={{ color: "#8B84A0" }}
        >
          <MapPin size={11} />
          <span>{match.court}</span>
        </div>
      </div>
    </div>
  );
}

export default function UpcomingMatches() {
  return (
    <div
      className="w-full flex flex-col gap-3 p-[18px] rounded-2xl"
      style={{ backgroundColor: "#0D0916", color: "#E9E6F0" }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-white">Próximos partidos</h2>
        <button
          className="text-[12.5px] font-medium transition-opacity hover:opacity-80"
          style={{ color: "#E7A93A" }}
        >
          Ver todos
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {MATCHES.map((match) => (
          <MatchRow key={match.id} match={match} />
        ))}
      </div>

      <button
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold transition-colors"
        style={{
          backgroundColor: "transparent",
          color: "#E7A93A",
          border: "1px solid #E7A93A",
        }}
      >
        <Calendar size={15} />
        Ver todo el fixture
      </button>
    </div>
  );
}
