import React, { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ChevronDown, SlidersHorizontal } from "lucide-react";

/**
 * CalendarFilters
 * Réplica del panel lateral: mini-calendario mensual con semana
 * seleccionada resaltada, + sección de filtros con selects y
 * botón "Aplicar filtros".
 */

const WEEK_DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

// Semanas de Mayo 2024 (cada fila = una semana, null = día fuera de mes)
const WEEKS = [
  [29, 30, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19], // semana seleccionada
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 1, 2],
];

const CURRENT_MONTH_RANGE = [1, 31]; // días del mes vigente (Mayo)
const SELECTED_WEEK_INDEX = 2;
const SELECTED_DAY = 14;

function Select({ label, value, options, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl px-3.5 py-3 text-[13px] font-medium outline-none cursor-pointer"
        style={{
          backgroundColor: "#171020",
          color: "#C9C3D6",
          border: "1px solid #2A2236",
        }}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "#8B84A0" }}
      />
    </div>
  );
}

export default function CalendarFilters() {
  const [grupo, setGrupo] = useState("");
  const [cancha, setCancha] = useState("");
  const [estado, setEstado] = useState("");

  const isInCurrentMonth = (day, weekIdx, dayIdx) => {
    // Primera semana: los primeros días pueden ser del mes anterior si son altos (29,30)
    if (weekIdx === 0 && day > 20) return false;
    // Última semana: días bajos después del 31 son del próximo mes
    if (weekIdx === WEEKS.length - 1 && day < 20) return false;
    return true;
  };

  return (
    <div
      className="w-full max-w-[260px] flex flex-col gap-3.5 p-[18px] rounded-2xl"
      style={{ backgroundColor: "#0D0916", color: "#E9E6F0" }}
    >
      {/* ---------- Mini calendario ---------- */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[14px] font-semibold text-white">Mayo 2024</h2>
          <div className="flex items-center gap-1.5">
            <button
              className="p-1 rounded-lg transition-colors"
              style={{ backgroundColor: "#171020", color: "#9C93B5" }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              className="p-1 rounded-lg transition-colors"
              style={{ backgroundColor: "#171020", color: "#9C93B5" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Encabezado días de la semana */}
        <div className="grid grid-cols-7 mb-2">
          {WEEK_DAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[10px] font-semibold tracking-wide"
              style={{ color: "#6E6685" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Filas de semanas */}
        <div className="flex flex-col gap-1">
          {WEEKS.map((week, weekIdx) => {
            const isSelectedWeek = weekIdx === SELECTED_WEEK_INDEX;
            return (
              <div
                key={weekIdx}
                className="grid grid-cols-7 rounded-lg relative"
                style={{
                  backgroundColor: isSelectedWeek
                    ? "rgba(124,58,237,0.28)"
                    : "transparent",
                }}
              >
                {week.map((day, dayIdx) => {
                  const inMonth = isInCurrentMonth(day, weekIdx, dayIdx);
                  const isSelectedDay =
                    isSelectedWeek && day === SELECTED_DAY && inMonth;
                  return (
                    <div
                      key={dayIdx}
                      className="flex items-center justify-center py-1.5"
                    >
                      <span
                        className="flex items-center justify-center rounded-full text-[12px] font-medium"
                        style={{
                          width: 26,
                          height: 26,
                          backgroundColor: isSelectedDay ? "#7C3AED" : "transparent",
                          color: isSelectedDay
                            ? "#FFFFFF"
                            : inMonth
                            ? "#E9E6F0"
                            : "#4A4358",
                          fontWeight: isSelectedDay ? 700 : 500,
                        }}
                      >
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- Filtros ---------- */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[14px] font-semibold text-white">Filtros</h3>
          <button
            className="flex items-center gap-1.5 text-[12.5px] font-medium transition-opacity hover:opacity-80"
            style={{ color: "#E7A93A" }}
            onClick={() => {
              setGrupo("");
              setCancha("");
              setEstado("");
            }}
          >
            <RotateCcw size={13} />
            Limpiar
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <Select
            label="Todos los grupos"
            value={grupo}
            onChange={setGrupo}
            options={["Grupo A", "Grupo B", "Grupo C"]}
          />
          <Select
            label="Todas las canchas"
            value={cancha}
            onChange={setCancha}
            options={["Cancha 1", "Cancha 2", "Cancha 3"]}
          />
          <Select
            label="Todos los estados"
            value={estado}
            onChange={setEstado}
            options={["Próximo", "En curso", "Finalizado"]}
          />
        </div>

        <button
          className="w-full flex items-center justify-center gap-2 mt-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors"
          style={{
            backgroundColor: "transparent",
            color: "#E7A93A",
            border: "1px solid #E7A93A",
          }}
        >
          <SlidersHorizontal size={15} />
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}
