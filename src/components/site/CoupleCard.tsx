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
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <MediaImage
          src={couple.coverUrl}
          alt={couple.names}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          placeholderLabel={couple.names}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-foreground shadow transition-colors group-hover:bg-accent group-hover:text-white">
          Ver história
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414-1.414L13.586 10H4a1 1 0 1 1 0-2h9.586l-3.293-3.293a1 1 0 0 1 0-1.414Z" clipRule="evenodd" />
          </svg>
        </span>
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
