import React, { useState, useMemo } from "react";
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

// ---------- Constantes de equipos ----------

const TEAM_MAP = {
  'Vera FC': { short: 'VERA', group: 'A', icon: Shield, bg: '#7C3AED', fg: '#F3EEFF' },
  'Quiceno United': { short: 'QUI', group: 'A', icon: Flame, bg: '#F97316', fg: '#FFF7ED' },
  'Bernal Warriors': { short: 'BER', group: 'B', icon: Swords, bg: '#8B5CF6', fg: '#F3EEFF' },
  'Rojas Tigers': { short: 'ROJ', group: 'B', icon: Cat, bg: '#EF4444', fg: '#FEE2E2' },
  'Prieto FC': { short: 'PRI', group: 'C', icon: Code2, bg: '#22C55E', fg: '#DCFCE7' },
  'García Lions': { short: 'GAR', group: 'C', icon: Zap, bg: '#3B82F6', fg: '#DBEAFE' },
  'Barrera FC': { short: 'BAR', group: 'A', icon: Code2, bg: '#EC4899', fg: '#FCE7F3' },
  'Arteaga United': { short: 'ART', group: 'B', icon: Flame, bg: '#14B8A6', fg: '#CCFBF1' },
  'Modelo FC': { short: 'MOD', group: 'A', icon: Shield, bg: '#A855F7', fg: '#F3EEFF' },
  'Tinjacá Stars': { short: 'TIN', group: 'C', icon: Zap, bg: '#EAB308', fg: '#FEF9C3' },
  'Beltrán Referees': { short: 'BEL', group: 'B', icon: Cat, bg: '#DC2626', fg: '#FEE2E2' },
}

const TEAM_ICONS = {
  "VERA": { icon: Shield, bg: "#7C3AED", fg: "#F3EEFF" },
  "BER": { icon: Swords, bg: "#8B5CF6", fg: "#F3EEFF" },
  "QUI": { icon: Flame, bg: "#F97316", fg: "#FFF7ED" },
  "ROJ": { icon: Cat, bg: "#EF4444", fg: "#FEE2E2" },
  "PRI": { icon: Code2, bg: "#22C55E", fg: "#DCFCE7" },
  "GAR": { icon: Zap, bg: "#3B82F6", fg: "#DBEAFE" },
  "ART": { icon: Flame, bg: "#14B8A6", fg: "#CCFBF1" },
  "BAR": { icon: Code2, bg: "#EC4899", fg: "#FCE7F3" },
  "MOD": { icon: Shield, bg: "#A855F7", fg: "#F3EEFF" },
  "TIN": { icon: Zap, bg: "#EAB308", fg: "#FEF9C3" },
  "BEL": { icon: Cat, bg: "#DC2626", fg: "#FEE2E2" },
};

const GROUP_STYLES = {
  "Grupo A": { bg: "#7C3AED", fg: "#F3EEFF" },
  "Grupo B": { bg: "#E7A93A", fg: "#2E2205" },
  "Grupo C": { bg: "#7C3AED", fg: "#F3EEFF" },
};

const START_HOUR = 8;
const END_HOUR = 21;
const HOUR_HEIGHT = 60;

// ---------- Helpers ----------

function minutosADesdeMedianoche(horaStr) {
  // "8:00 PM" -> 20*60, "5:00 PM" -> 17*60, "9:30 PM" -> 21*60+30
  const [h, mPart] = horaStr.split(':')
  const min = parseInt(mPart.replace(/\D/g, ''))
  const esPM = horaStr.includes('PM')
  let hh = parseInt(h)
  if (esPM && hh !== 12) hh += 12
  if (!esPM && hh === 12) hh = 0
  return hh * 60 + min
}

function convertirPartidos(partidos) {
  return partidos.map((p, idx) => {
    const info1 = TEAM_MAP[p.eq1] || { short: p.eq1.slice(0, 6).toUpperCase(), group: 'A', icon: Shield, bg: '#2B2B33', fg: '#C9C9D6' }
    const info2 = TEAM_MAP[p.eq2] || { short: p.eq2.slice(0, 6).toUpperCase(), group: 'A', icon: Shield, bg: '#2B2B33', fg: '#C9C9D6' }
    return {
      id: idx + 1,
      day: new Date(2026, 6, p.dia).getDay(), // 0=Dom
      start: minutosADesdeMedianoche(p.hora),
      duration: 60,
      group: `Grupo ${info1.group}`,
      home: info1.short,
      away: info2.short,
      court: p.lugar === 'Cancha Principal Sede Norte' ? 'Cancha 1'
        : p.lugar === 'Cancha Principal Sede Norte 2' ? 'Cancha 2'
        : 'Cancha 3',
    }
  })
}

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

function minutesToLabel(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ---------- Componente principal ----------

export default function TournamentCalendar({ partidos = [], mes = 4, año = 2026, onMesChange }) {
  const [view, setView] = useState("Semana");
  const [selectedMatch, setSelectedMatch] = useState(null);

  const today = new Date()
  const primerDia = new Date(año, mes, 1)
  const primerDiaSemana = (primerDia.getDay() || 7) - 1 // 0=Lu
  const diasEnMes = new Date(año, mes + 1, 0).getDate()

  // Encontrar la semana actual: día 14 del mes -> qué semana cae
  const semanaActualIdx = Math.floor((14 + primerDiaSemana - 1) / 7)

  function generarSemana(semanaIdx) {
    const inicio = semanaIdx * 7 - primerDiaSemana + 1
    return [0,1,2,3,4,5,6].map(offset => {
      const d = inicio + offset
      return d >= 1 && d <= diasEnMes ? d : null
    })
  }

  const semana = generarSemana(semanaActualIdx).filter(d => d !== null)
  const diasSemana = semana.length > 0 ? semana : [1,2,3,4,5,6,7]

  const NOMBRES_DIAS = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB']
  const NOMBRES_MES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

  const DAYS = diasSemana.map((d, i) => {
    const fecha = new Date(año, mes, d)
    const dayOfWeek = fecha.getDay()
    const key = NOMBRES_DIAS[dayOfWeek]
    return {
      key,
      date: `${d} ${NOMBRES_MES[mes].slice(0,3).toUpperCase()}`,
      full: `${key} ${d} de ${NOMBRES_MES[mes]}`,
      highlight: d === today.getDate() && mes === today.getMonth() && año === today.getFullYear(),
      dayNum: d,
    }
  })

  const MATCHES = useMemo(() => convertirPartidos(partidos), [partidos])

  const hours = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) hours.push(h);

  const nowTop = ((NOW_MINUTES - START_HOUR * 60) / 60) * HOUR_HEIGHT;

  const navegarSemana = (dir) => {
    const nuevaFecha = new Date(año, mes, diasSemana[0] + dir * 7)
    onMesChange?.(nuevaFecha.getMonth(), nuevaFecha.getFullYear())
  }

  const irAHoy = () => {
    onMesChange?.(today.getMonth(), today.getFullYear())
  }

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
            onClick={() => navegarSemana(-1)}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[15px] font-semibold text-white whitespace-nowrap">
            {diasSemana[0]} – {diasSemana[diasSemana.length - 1]} de {NOMBRES_MES[mes]}, {año}
          </span>
          <button
            className="p-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: "#171020", color: "#9C93B5" }}
            onClick={() => navegarSemana(1)}
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
          onClick={irAHoy}
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
      {view === "Día" ? (
        /* ───── Vista DÍA ───── */
        <DayView
          DAYS={DAYS}
          hours={hours}
          MATCHES={MATCHES}
          nowTop={nowTop}
          HOUR_HEIGHT={HOUR_HEIGHT}
          selectedMatch={selectedMatch}
          onSelectMatch={setSelectedMatch}
        />
      ) : view === "Lista" ? (
        /* ───── Vista LISTA ───── */
        <ListView
          MATCHES={MATCHES}
          DAYS={DAYS}
          selectedMatch={selectedMatch}
          onSelectMatch={setSelectedMatch}
        />
      ) : (
        /* ───── Vista SEMANA ───── */
        <WeekView
          DAYS={DAYS}
          hours={hours}
          MATCHES={MATCHES}
          nowTop={nowTop}
          HOUR_HEIGHT={HOUR_HEIGHT}
          selectedMatch={selectedMatch}
          onSelectMatch={setSelectedMatch}
        />
      )}
    </div>
  );
}

/* ───── SUBCOMPONENTES DE VISTA ───── */

function WeekView({ DAYS, hours, MATCHES, nowTop, HOUR_HEIGHT, selectedMatch, onSelectMatch }) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="grid relative" style={{ gridTemplateColumns: "64px repeat(7, 1fr)" }}>
        <div>
          <div className="flex items-start justify-end pr-2 text-[10.5px]" style={{ height: 36, color: "#6E6685", borderBottom: "1px solid #201933" }}>All day</div>
          {hours.map((h) => (
            <div key={h} className="flex items-start justify-end pr-2 text-[10.5px] -translate-y-2" style={{ height: HOUR_HEIGHT, color: "#6E6685" }}>
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>
        {DAYS.map((day, dayIndex) => (
          <div key={day.key} className="relative" style={{ borderLeft: "1px solid #201933", backgroundColor: day.highlight ? "rgba(124,58,237,0.06)" : "transparent" }}>
            <div style={{ height: 36, borderBottom: "1px solid #201933" }} />
            {hours.map((h) => (
              <div key={h} style={{ height: HOUR_HEIGHT, borderBottom: "1px solid #17111f" }} />
            ))}
            {day.highlight && (
              <div className="absolute left-0 right-0 flex items-center z-20" style={{ top: nowTop + 36 }}>
                <div className="rounded-full -ml-[5px]" style={{ width: 9, height: 9, backgroundColor: "#F59E0B" }} />
                <div className="flex-1" style={{ height: 1.5, backgroundColor: "#F59E0B" }} />
              </div>
            )}
            <div className="absolute inset-0" style={{ top: 36 }}>
              {MATCHES.filter((m) => m.day === dayIndex).map((match) => (
                <MatchCard key={match.id} match={match} selected={selectedMatch?.id === match.id} onClick={() => onSelectMatch?.(match)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DayView({ DAYS, hours, MATCHES, nowTop, HOUR_HEIGHT, selectedMatch, onSelectMatch }) {
  const today = DAYS.find(d => d.highlight) || DAYS[0]
  const todayIdx = DAYS.indexOf(today)
  return (
    <div className="flex-1 overflow-auto">
      <div className="grid relative" style={{ gridTemplateColumns: "64px 1fr" }}>
        <div>
          <div className="flex items-start justify-end pr-2 text-[10.5px]" style={{ height: 36, color: "#6E6685", borderBottom: "1px solid #201933" }}>All day</div>
          {hours.map((h) => (
            <div key={h} className="flex items-start justify-end pr-2 text-[10.5px] -translate-y-2" style={{ height: HOUR_HEIGHT, color: "#6E6685" }}>
              {String(h).padStart(2, "0")}:00
            </div>
          ))}
        </div>
        <div className="relative" style={{ borderLeft: "1px solid #201933" }}>
          <div style={{ height: 36, borderBottom: "1px solid #201933" }} />
          {hours.map((h) => (
            <div key={h} style={{ height: HOUR_HEIGHT, borderBottom: "1px solid #17111f" }} />
          ))}
          <div className="absolute left-0 right-0 flex items-center z-20" style={{ top: nowTop + 36 }}>
            <div className="rounded-full -ml-[5px]" style={{ width: 9, height: 9, backgroundColor: "#F59E0B" }} />
            <div className="flex-1" style={{ height: 1.5, backgroundColor: "#F59E0B" }} />
          </div>
          <div className="absolute inset-0" style={{ top: 36 }}>
            {MATCHES.filter((m) => m.day === todayIdx).map((match) => (
              <MatchCard key={match.id} match={match} selected={selectedMatch?.id === match.id} onClick={() => onSelectMatch?.(match)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListView({ MATCHES, DAYS, selectedMatch, onSelectMatch }) {
  const allMatches = MATCHES.map(m => {
    const day = DAYS[m.day]
    return { ...m, dayLabel: day?.date || '', dayName: day?.key || '' }
  }).sort((a, b) => a.day - b.day || a.start - b.start)

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="flex flex-col gap-2">
        {allMatches.length === 0 && (
          <div className="text-center py-10 text-[13px]" style={{ color: '#6E6685' }}>
            No hay partidos esta semana
          </div>
        )}
        {allMatches.map((match) => (
          <button key={match.id} onClick={() => onSelectMatch?.(match)}
            className="w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all"
            style={{
              backgroundColor: selectedMatch?.id === match.id ? '#1B1524' : '#171020',
              border: `1px solid ${selectedMatch?.id === match.id ? '#7C3AED' : '#2A2236'}`,
            }}
          >
            <div className="flex flex-col items-center min-w-[50px]">
              <span className="text-[10px] font-bold tracking-wide" style={{ color: '#E7A93A' }}>{match.dayLabel}</span>
              <span className="text-[13px] font-semibold text-white">{match.dayName}</span>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <TeamBadge team={match.home} />
              <span className="text-[11px]" style={{ color: '#6E6685' }}>vs</span>
              <TeamBadge team={match.away} />
              <span className="text-[12px] font-semibold text-white ml-2">{match.home} vs {match.away}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]" style={{ color: '#8B84A0' }}>
              <span>{String(Math.floor(match.start / 60)).padStart(2, '0')}:{String(match.start % 60).padStart(2, '0')}</span>
              <MapPin size={11} /><span>{match.court}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───── Actualizar MatchCard para aceptar onClick ───── */
function MatchCard({ match, selected, onClick }) {
  const top = ((match.start - START_HOUR * 60) / 60) * HOUR_HEIGHT;
  const height = (match.duration / 60) * HOUR_HEIGHT;
  const timeLabel = minutesToLabel(match.start);

  return (
    <div onClick={onClick}
      className="absolute left-1 right-1 rounded-xl p-2.5 flex flex-col gap-1.5 cursor-pointer transition-transform hover:-translate-y-[1px]"
      style={{
        top,
        height: Math.max(height, 70),
        backgroundColor: "#1B1524",
        border: selected ? "1px solid #7C3AED" : "1px solid #322A44",
        boxShadow: selected ? "0 0 0 1px #7C3AED, 0 2px 8px rgba(0,0,0,0.35)" : "0 2px 8px rgba(0,0,0,0.35)",
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
        <span className="text-[10px] font-semibold" style={{ color: "#6E6685" }}>vs</span>
        <TeamBadge team={match.away} />
      </div>
      <div className="text-[12px] font-semibold text-white leading-tight truncate">
        {match.home} <span style={{ color: "#8B84A0" }}>vs</span> {match.away}
      </div>
      <div className="flex items-center gap-1 text-[10.5px] mt-auto" style={{ color: "#8B84A0" }}>
        <MapPin size={11} />
        <span>{match.court}</span>
      </div>
    </div>
  );
}
