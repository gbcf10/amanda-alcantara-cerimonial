"use client";

import { useMemo, useState, useTransition } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { clearAvailability, setAvailability } from "@/lib/actions/availability";

type Status = "available" | "unavailable" | "booked";

type AvailabilityRecord = {
  date: string; // yyyy-MM-dd
  status: Status;
  note: string | null;
};

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

const STATUS_DOT: Record<Status, string> = {
  available: "bg-green-400",
  unavailable: "bg-red-400",
  booked: "bg-amber-400",
};

const STATUS_LABEL: Record<Status, string> = {
  available: "Disponível",
  unavailable: "Indisponível",
  booked: "Reservado",
};

export function AdminAgendaCalendar({
  records,
}: {
  records: AvailabilityRecord[];
}) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  const recordByDate = useMemo(() => {
    const map = new Map<string, AvailabilityRecord>();
    for (const r of records) map.set(r.date, r);
    return map;
  }, [records]);

  const days = useMemo(() => {
    const start = startOfMonth(visibleMonth);
    const end = endOfMonth(visibleMonth);
    return eachDayOfInterval({ start, end });
  }, [visibleMonth]);

  const leadingBlanks = getDay(startOfMonth(visibleMonth));
  const selectedRecord = selected ? recordByDate.get(selected) : undefined;

  function handleSelect(iso: string) {
    setSelected(iso);
    setNote(recordByDate.get(iso)?.note ?? "");
  }

  function applyStatus(status: Status) {
    if (!selected) return;
    startTransition(() => {
      setAvailability(selected, status, note);
    });
  }

  function handleClear() {
    if (!selected) return;
    startTransition(() => {
      clearAvailability(selected);
    });
    setNote("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setVisibleMonth((m) => subMonths(m, 1))}
            className="rounded-full px-2 py-1 text-sm text-foreground/70 hover:bg-muted"
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
            const record = recordByDate.get(iso);
            const isSelected = selected === iso;

            return (
              <button
                key={iso}
                type="button"
                onClick={() => handleSelect(iso)}
                className={`relative aspect-square rounded-lg text-sm transition-colors hover:bg-muted ${
                  isSelected ? "ring-2 ring-accent ring-offset-1" : ""
                }`}
              >
                {format(day, "d")}
                {record && (
                  <span
                    className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${STATUS_DOT[record.status]}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        {selected ? (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Data selecionada
              </p>
              <p className="font-serif-display text-lg text-foreground">
                {format(new Date(`${selected}T00:00:00`), "d 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
              {selectedRecord && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Status atual: {STATUS_LABEL[selectedRecord.status]}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {(Object.keys(STATUS_LABEL) as Status[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={isPending}
                  onClick={() => applyStatus(status)}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[status]}`} />
                  Marcar como {STATUS_LABEL[status].toLowerCase()}
                </button>
              ))}
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Observação (opcional)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="input resize-none"
                placeholder="Ex: reservado para casamento Ana & João"
              />
            </label>

            {selectedRecord && (
              <button
                type="button"
                disabled={isPending}
                onClick={handleClear}
                className="text-xs text-red-600 hover:underline disabled:opacity-50"
              >
                Remover marcação (voltar a disponível)
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Selecione uma data no calendário para editar a disponibilidade.
          </p>
        )}
      </div>
    </div>
  );
}
