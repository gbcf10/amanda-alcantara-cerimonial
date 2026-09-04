"use client";

import { useActionState, useState, type ReactNode } from "react";
import { submitQuoteRequest, type QuoteFormState } from "@/lib/actions/quotes";
import { Button } from "@/components/ui/Button";
import {
  AvailabilityCalendar,
  type AvailabilityDay,
} from "@/components/site/AvailabilityCalendar";

const EVENT_TYPES = [
  "Casamento",
  "Debutante (15 anos)",
  "Batizado",
  "Aniversário",
  "Evento corporativo",
  "Outro",
];

const initialState: QuoteFormState = {};

export function QuoteForm({ availability }: { availability: AvailabilityDay[] }) {
  const [state, formAction, isPending] = useActionState(
    submitQuoteRequest,
    initialState
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="font-serif-display text-2xl text-foreground">
          Recebemos seu pedido! 🤍
        </p>
        <p className="mt-3 text-muted-foreground">
          Obrigada por compartilhar os detalhes do seu evento. Em breve
          entraremos em contato para conversar sobre o seu grande dia.
        </p>
      </div>
    );
  }

  const fieldError = (name: string) => state.fieldErrors?.[name];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
      <form action={formAction} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nome completo" name="name" error={fieldError("name")}>
            <input
              name="name"
              type="text"
              required
              className="input"
              placeholder="Seu nome"
            />
          </Field>
          <Field label="E-mail" name="email" error={fieldError("email")}>
            <input
              name="email"
              type="email"
              required
              className="input"
              placeholder="voce@email.com"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Telefone / WhatsApp" name="phone" error={fieldError("phone")}>
            <input
              name="phone"
              type="tel"
              required
              className="input"
              placeholder="(00) 00000-0000"
            />
          </Field>
          <Field label="Tipo de evento" name="eventType" error={fieldError("eventType")}>
            <select name="eventType" required className="input" defaultValue="">
              <option value="" disabled>
                Selecione
              </option>
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Data do evento" name="eventDate" error={fieldError("eventDate")}>
            <input
              name="eventDate"
              type="date"
              className="input"
              value={selectedDate ?? ""}
              onChange={(e) => setSelectedDate(e.target.value || null)}
            />
          </Field>
          <Field label="Local do evento" name="location" error={fieldError("location")}>
            <input
              name="location"
              type="text"
              className="input"
              placeholder="Cidade / espaço"
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Número de convidados" name="guestCount" error={fieldError("guestCount")}>
            <input
              name="guestCount"
              type="text"
              className="input"
              placeholder="Ex: 120"
            />
          </Field>
          <Field label="Nome do noivo(a)" name="partnerName" error={fieldError("partnerName")}>
            <input
              name="partnerName"
              type="text"
              className="input"
              placeholder="Nome do(a) parceiro(a)"
            />
          </Field>
        </div>

        <Field label="Conte um pouco sobre o seu evento" name="message" error={fieldError("message")}>
          <textarea
            name="message"
            rows={4}
            className="input resize-none"
            placeholder="Estilo do evento, ideias, dúvidas..."
          />
        </Field>

        {state.error && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}

        <Button type="submit" disabled={isPending} className="mt-2 w-full sm:w-auto">
          {isPending ? "Enviando..." : "Solicitar orçamento"}
        </Button>
      </form>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">
          Consulte as datas disponíveis
        </p>
        <AvailabilityCalendar
          availability={availability}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={name} className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
