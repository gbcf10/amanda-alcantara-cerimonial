import { MediaImage } from "@/components/site/MediaImage";

type GalleryImage = {
  id: string;
  url: string;
  caption?: string | null;
  category?: string | null;
};

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Em breve, novas fotos por aqui.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {images.map((image) => (
        <figure
          key={image.id}
          className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-muted"
        >
          <MediaImage
            src={image.url}
            alt={image.caption ?? "Foto do portfólio"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {image.caption && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
