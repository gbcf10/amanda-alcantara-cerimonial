"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameDay,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export type AvailabilityStatus = "available" | "unavailable" | "booked";

export type AvailabilityDay = {
  date: string; // ISO yyyy-MM-dd
  status: AvailabilityStatus;
};

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

const STATUS_STYLES: Record<AvailabilityStatus, string> = {
  available: "bg-green-50 text-green-800 hover:bg-green-100 cursor-pointer",
  unavailable: "bg-red-50 text-red-800/60 cursor-not-allowed line-through",
  booked: "bg-amber-50 text-amber-800/60 cursor-not-allowed line-through",
};

export function AvailabilityCalendar({
  availability,
  selectedDate,
  onSelectDate,
}: {
  availability: AvailabilityDay[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));

  const statusByDate = useMemo(() => {
    const map = new Map<string, AvailabilityStatus>();
    for (const day of availability) map.set(day.date, day.status);
    return map;
  }, [availability]);

  const days = useMemo(() => {
    const start = startOfMonth(visibleMonth);
    const end = endOfMonth(visibleMonth);
    return eachDayOfInterval({ start, end });
  }, [visibleMonth]);

  const leadingBlanks = getDay(startOfMonth(visibleMonth));
  const today = startOfDay(new Date());

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setVisibleMonth((m) => subMonths(m, 1))}
          className="rounded-full px-2 py-1 text-sm text-foreground/70 hover:bg-muted"
          aria-label="Mês anterior"
        >
          ←
        </button>
        <p className="font-serif-display text-base capitalize text-foreground">
          {format(visibleMonth, "MMMM yyyy", { locale: ptBR })}
        </p>
        <button
          type="button"
          onClick={() => setVisibleMonth((m) => addMonths(m, 1))}
          className="rounded-full px-2 py-1 text-sm text-foreground/70 hover:bg-muted"
          aria-label="Próximo mês"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const iso = format(day, "yyyy-MM-dd");
          const past = isBefore(day, today);
          const status = statusByDate.get(iso) ?? (past ? "unavailable" : "available");
          const isSelected = selectedDate === iso;
          const disabled = past || status !== "available";

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(iso)}
              className={`aspect-square rounded-lg text-sm transition-colors ${
                past
                  ? "cursor-not-allowed text-foreground/30"
                  : STATUS_STYLES[status]
              } ${isSelected ? "ring-2 ring-accent ring-offset-1" : ""}`}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-green-200" /> Disponível
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-200" /> Reservado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-200" /> Indisponível
        </span>
      </div>
    </div>
  );
}
