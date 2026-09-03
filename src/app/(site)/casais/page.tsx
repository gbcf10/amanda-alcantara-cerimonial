import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CoupleCard } from "@/components/site/CoupleCard";
import { getPublishedCouples } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book de Casais | Amanda Alcântara Cerimonial",
};

export default async function CasaisPage() {
  const couples = await getPublishedCouples();

  return (
    <Container className="flex flex-col gap-14 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Book de Casais"
        title="Histórias reais de amor que ajudamos a celebrar"
        subtitle="Conheça um pouco de cada casal, com fotos, vídeos e a história por trás do grande dia."
      />

      {couples.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Em breve, novos casais por aqui.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {couples.map((couple) => (
            <CoupleCard key={couple.id} couple={couple} />
          ))}
        </div>
      )}
    </Container>
  );
}
