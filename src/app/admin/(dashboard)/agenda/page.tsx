import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { AdminAgendaCalendar } from "@/components/admin/AdminAgendaCalendar";

export default async function AdminAgendaPage() {
  const records = await prisma.availabilityDate.findMany();

  const formatted = records.map((r) => ({
    date: format(r.date, "yyyy-MM-dd"),
    status: r.status as "available" | "unavailable" | "booked",
    note: r.note,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-serif-display text-2xl text-foreground">Agenda</h1>
        <p className="text-sm text-muted-foreground">
          Marque as datas indisponíveis ou já reservadas. O calendário no site
          mostra automaticamente o que estiver aqui.
        </p>
      </div>
      <AdminAgendaCalendar records={formatted} />
    </div>
  );
}
