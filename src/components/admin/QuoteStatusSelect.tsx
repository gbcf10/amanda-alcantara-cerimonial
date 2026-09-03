"use client";

import { useTransition } from "react";
import { updateQuoteStatus } from "@/lib/actions/quotes";

const STATUS_OPTIONS = [
  { value: "novo", label: "Novo" },
  { value: "contatado", label: "Contatado" },
  { value: "fechado", label: "Fechado" },
  { value: "recusado", label: "Recusado" },
];

export function QuoteStatusSelect({ id, status }: { id: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => {
          updateQuoteStatus(id, next);
        });
      }}
      className="input py-1.5 text-xs"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
