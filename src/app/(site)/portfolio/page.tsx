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
    <Container className="flex flex-col gap-14 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Portfólio"
        title="Cerimônias que já tivemos o prazer de conduzir"
        subtitle="Cada evento é único — aqui vai um pouco do que já vivemos juntos."
      />

      {categories.length > 0 ? (
        categories.map((category) => (
          <div key={category} className="flex flex-col gap-6">
            <h3 className="font-serif-display text-xl text-foreground">
              {category}
            </h3>
            <GalleryGrid images={gallery.filter((g) => g.category === category)} />
          </div>
        ))
      ) : (
        <GalleryGrid images={gallery} />
      )}
    </Container>
  );
}
