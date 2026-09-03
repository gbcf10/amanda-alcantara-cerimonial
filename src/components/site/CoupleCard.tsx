import Link from "next/link";
import { MediaImage } from "@/components/site/MediaImage";

type Couple = {
  id: string;
  names: string;
  slug: string;
  coverUrl: string | null;
  weddingDate: Date | null;
};

export function CoupleCard({ couple }: { couple: Couple }) {
  return (
    <Link
      href={`/casais/${couple.slug}`}
      className="group flex flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="aspect-[4/5] overflow-hidden bg-muted">
        <MediaImage
          src={couple.coverUrl}
          alt={couple.names}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          placeholderLabel={couple.names}
        />
      </div>
      <div className="px-4 pb-4">
        <p className="font-serif-display text-lg text-foreground">{couple.names}</p>
        {couple.weddingDate && (
          <p className="text-sm text-muted-foreground">
            {new Date(couple.weddingDate).toLocaleDateString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>
    </Link>
  );
}
