import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { MediaImage } from "@/components/site/MediaImage";
import { VideoEmbed } from "@/components/site/VideoEmbed";
import { getCoupleBySlug } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const couple = await getCoupleBySlug(slug);
  return { title: couple ? `${couple.names} | Histórias reais` : "Histórias reais" };
}

export default async function CoupleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const couple = await getCoupleBySlug(slug);
  if (!couple) notFound();

  const photos = couple.media.filter((m) => m.type === "photo");
  const videos = couple.media.filter((m) => m.type === "video");

  return (
    <>
      <div className="aspect-[16/7] w-full overflow-hidden bg-muted">
        <MediaImage
          src={couple.coverUrl}
          alt={couple.names}
          className="h-full w-full object-cover"
          placeholderLabel={couple.names}
        />
      </div>

      <Container className="flex flex-col gap-12 py-16 sm:py-20">
        <div className="flex flex-col gap-3 text-center">
          <h1 className="font-serif-display text-4xl text-foreground">
            {couple.names}
          </h1>
          {couple.weddingDate && (
            <p className="text-muted-foreground">
              {new Date(couple.weddingDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {couple.story && (
          <p className="mx-auto max-w-2xl whitespace-pre-line text-center text-foreground/90 leading-relaxed">
            {couple.story}
          </p>
        )}

        {videos.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="font-serif-display text-xl text-foreground">Vídeos</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {videos.map((video) => (
                <div key={video.id} className="flex flex-col gap-2">
                  <VideoEmbed url={video.url} />
                  {video.caption && (
                    <p className="text-sm text-muted-foreground">{video.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {photos.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="font-serif-display text-xl text-foreground">Fotos</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.map((photo) => (
                <figure
                  key={photo.id}
                  className="aspect-[3/4] overflow-hidden rounded-xl bg-muted"
                >
                  <MediaImage
                    src={photo.url}
                    alt={photo.caption ?? couple.names}
                    className="h-full w-full object-cover"
                  />
                </figure>
              ))}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
