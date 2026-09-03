import type { Metadata } from "next";
import { addMonths, format, startOfDay } from "date-fns";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuoteForm } from "@/components/site/QuoteForm";
import { getAvailabilityForRange } from "@/lib/data";
import type { AvailabilityDay } from "@/components/site/AvailabilityCalendar";

export const metadata: Metadata = {
  title: "Solicitar orçamento | Amanda Alcântara Cerimonial",
};

export default async function OrcamentoPage() {
  const start = startOfDay(new Date());
  const end = addMonths(start, 6);
  const availabilityDates = await getAvailabilityForRange(start, end);

  const availability: AvailabilityDay[] = availabilityDates.map((a) => ({
    date: format(a.date, "yyyy-MM-dd"),
    status: a.status as AvailabilityDay["status"],
  }));

  return (
    <Container className="flex flex-col gap-12 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Orçamento"
        title="Vamos planejar o seu evento"
        subtitle="Preencha os dados abaixo e consulte as datas disponíveis na agenda. Retornaremos em breve com uma proposta personalizada."
      />
      <QuoteForm availability={availability} />
    </Container>
  );
}
