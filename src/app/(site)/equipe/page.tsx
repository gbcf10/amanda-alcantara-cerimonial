import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TeamCard } from "@/components/site/TeamCard";
import { getPublishedTeam } from "@/lib/data";

export const metadata: Metadata = {
  title: "Equipe | Amanda Alcântara Cerimonial",
};

export default async function EquipePage() {
  const team = await getPublishedTeam();

  return (
    <Container className="flex flex-col gap-14 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Equipe"
        title="Quem cuida de cada detalhe do seu evento"
        subtitle="Um time preparado para que tudo aconteça exatamente como planejado."
      />

      {team.length > 0 ? (
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          Em breve, apresentaremos a equipe por aqui.
        </p>
      )}
    </Container>
  );
}
