import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PartnerCard } from "@/components/site/PartnerCard";
import { getPublishedPartners } from "@/lib/data";

export const metadata: Metadata = {
  title: "Parcerias | Amanda Alcântara Cerimonial",
};

export default async function ParceriasPage() {
  const partners = await getPublishedPartners();

  const categories = Array.from(
    new Set(partners.map((p) => p.category).filter((c): c is string => !!c))
  );

  return (
    <Container className="flex flex-col gap-14 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Parcerias"
        title="Fornecedores de confiança"
        subtitle="Uma rede selecionada de profissionais que trabalham lado a lado para o seu evento ser perfeito."
      />

      {partners.length === 0 && (
        <p className="text-center text-muted-foreground">
          Em breve, novas parcerias por aqui.
        </p>
      )}

      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category} className="flex flex-col gap-6">
            <h3 className="font-serif-display text-xl text-foreground">
              {category}
            </h3>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {partners
                .filter((p) => p.category === category)
                .map((partner) => (
                  <PartnerCard key={partner.id} partner={partner} />
                ))}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      )}
    </Container>
  );
}
