import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ChevronDown, SlidersHorizontal } from "lucide-react";

const WEEK_DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
const NOMBRES_MES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

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

export default function CalendarFilters({ mes = 4, año = 2026, onMesChange, onFilterChange }) {
  const [grupo, setGrupo] = useState("");
  const [cancha, setCancha] = useState("");
  const [estado, setEstado] = useState("");

  const primerDia = new Date(año, mes, 1)
  const primerDiaSemana = (primerDia.getDay() || 7) - 1 // 0=Lu
  const diasEnMes = new Date(año, mes + 1, 0).getDate()
  const ultimoDiaMesAnt = new Date(año, mes, 0).getDate()

  const WEEKS = useMemo(() => {
    const semanas = []
    let semana = []
    // Días del mes anterior
    for (let i = 0; i < primerDiaSemana; i++) {
      semana.push(ultimoDiaMesAnt - primerDiaSemana + 1 + i)
    }
    // Días del mes actual
    for (let d = 1; d <= diasEnMes; d++) {
      semana.push(d)
      if (semana.length === 7) {
        semanas.push(semana)
        semana = []
      }
    }
    // Días del mes siguiente
    if (semana.length > 0) {
      let next = 1
      while (semana.length < 7) {
        semana.push(next++)
      }
      semanas.push(semana)
    }
    return semanas
  }, [mes, año, primerDiaSemana, diasEnMes, ultimoDiaMesAnt])

  const today = new Date()
  const todayDate = today.getDate()
  const todayMes = today.getMonth()
  const todayAño = today.getFullYear()
  const semanaActualIdx = WEEKS.findIndex(week => week.includes(todayDate) && mes === todayMes && año === todayAño)
  const selectedWeekIdx = semanaActualIdx >= 0 ? semanaActualIdx : Math.min(1, WEEKS.length - 1)

  const aplicarFiltros = () => {
    onFilterChange?.({ grupo, cancha, estado })
  }

  return (
    <div
      className="w-full max-w-[260px] flex flex-col gap-3.5 p-[18px] rounded-2xl"
      style={{ backgroundColor: "#0D0916", color: "#E9E6F0" }}
    >
      {/* ---------- Mini calendario ---------- */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[14px] font-semibold text-white">{NOMBRES_MES[mes]} {año}</h2>
          <div className="flex items-center gap-1.5">
            <button
              className="p-1 rounded-lg transition-colors"
              style={{ backgroundColor: "#171020", color: "#9C93B5" }}
              onClick={() => onMesChange?.(mes - 1 < 0 ? 11 : mes - 1, mes - 1 < 0 ? año - 1 : año)}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              className="p-1 rounded-lg transition-colors"
              style={{ backgroundColor: "#171020", color: "#9C93B5" }}
              onClick={() => onMesChange?.(mes + 1 > 11 ? 0 : mes + 1, mes + 1 > 11 ? año + 1 : año)}
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
            const isSelectedWeek = weekIdx === selectedWeekIdx;
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
                  const inMonth = day >= 1 && day <= diasEnMes;
                  const isToday = day === todayDate && mes === todayMes && año === todayAño;
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
                          backgroundColor: isToday ? "#7C3AED" : "transparent",
                          color: isToday
                            ? "#FFFFFF"
                            : inMonth
                            ? "#E9E6F0"
                            : "#4A4358",
                          fontWeight: isToday ? 700 : 500,
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
              onFilterChange?.({ grupo: '', cancha: '', estado: '' })
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
          onClick={aplicarFiltros}
        >
          <SlidersHorizontal size={15} />
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}
