import { prisma } from "@/lib/prisma";
import { deleteQuoteRequest } from "@/lib/actions/quotes";
import { QuoteStatusSelect } from "@/components/admin/QuoteStatusSelect";
import { DeleteButton } from "@/components/ui/DeleteButton";

export default async function AdminOrcamentosPage() {
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-2xl text-foreground">
          Pedidos de orçamento
        </h1>
        <p className="text-sm text-muted-foreground">
          {quotes.length} pedido(s) recebido(s) pelo site.
        </p>
      </div>

      {quotes.length === 0 ? (
        <p className="text-muted-foreground">Nenhum pedido recebido ainda.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{quote.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {quote.email} · {quote.phone}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <QuoteStatusSelect id={quote.id} status={quote.status} />
                  <form action={deleteQuoteRequest.bind(null, quote.id)}>
                    <DeleteButton confirmText="Excluir este pedido de orçamento?" />
                  </form>
                </div>
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <Detail label="Tipo de evento" value={quote.eventType} />
                <Detail
                  label="Data do evento"
                  value={
                    quote.eventDate
                      ? new Date(quote.eventDate).toLocaleDateString("pt-BR")
                      : "Não informado"
                  }
                />
                <Detail label="Local" value={quote.location || "Não informado"} />
                <Detail
                  label="Convidados"
                  value={quote.guestCount || "Não informado"}
                />
                <Detail
                  label="Orçamento"
                  value={quote.budgetRange || "Não informado"}
                />
                <Detail
                  label="Recebido em"
                  value={new Date(quote.createdAt).toLocaleString("pt-BR")}
                />
              </dl>

              {quote.message && (
                <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm text-foreground/90">
                  {quote.message}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
