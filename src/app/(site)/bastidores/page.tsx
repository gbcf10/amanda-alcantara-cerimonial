import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaImage } from "@/components/site/MediaImage";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { getPublishedBackstage } from "@/lib/data";

export const metadata: Metadata = {
  title: "Bastidores | Amanda Alcântara Cerimonial",
};

export default async function BastidoresPage() {
  const items = await getPublishedBackstage();

  return (
    <Container className="flex flex-col gap-14 py-20 sm:py-28">
      <SectionHeading
        eyebrow="Bastidores"
        title="O que acontece por trás de cada evento"
        subtitle="Registros dos momentos que ninguém vê — a preparação, a equipe em ação, o cuidado com cada detalhe."
      />

      {items.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Em breve, novos bastidores por aqui.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <figure
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3"
            >
              {item.type === "video" ? (
                <VideoEmbed url={item.url} />
              ) : (
                <MediaImage
                  src={item.url}
                  alt={item.caption ?? "Bastidor"}
                  className="aspect-video w-full rounded-xl object-cover"
                />
              )}
              {item.caption && (
                <figcaption className="px-1 text-sm text-muted-foreground">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </Container>
  );
}
