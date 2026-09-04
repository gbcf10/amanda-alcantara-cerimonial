import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { getPublishedGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Portfólio | Amanda Alcântara Cerimonial",
};

export default async function PortfolioPage() {
  const gallery = await getPublishedGallery();

  const categories = Array.from(
    new Set(gallery.map((g) => g.category).filter((c): c is string => !!c))
  );

  return (
    <Container className="flex flex-col gap-20 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Portfólio"
        title="Casamentos que tivemos prazer de conduzir"
        subtitle="Cada casal, cada história, cada detalhe pensado com afeto. Uma vitrine dos momentos que ajudamos a construir."
      />

      {categories.length > 0 ? (
        categories.map((category) => (
          <section key={category} className="flex flex-col gap-8">
            <h3 className="font-serif-display text-2xl text-foreground sm:text-3xl">
              {category}
            </h3>
            <GalleryGrid images={gallery.filter((g) => g.category === category)} />
          </section>
        ))
      ) : (
        <GalleryGrid images={gallery} />
      )}
    </Container>
  );
}
