import { MediaImage } from "@/components/site/MediaImage";

type Partner = {
  id: string;
  name: string;
  category?: string | null;
  logoUrl?: string | null;
  website?: string | null;
};

export function PartnerCard({ partner }: { partner: Partner }) {
  const content = (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-md">
      <MediaImage
        src={partner.logoUrl}
        alt={partner.name}
        className="h-16 w-16 rounded-full object-cover"
        placeholderLabel={partner.name.charAt(0)}
      />
      <p className="text-sm font-medium text-foreground">{partner.name}</p>
      {partner.category && (
        <p className="text-xs text-muted-foreground">{partner.category}</p>
      )}
    </div>
  );

  if (partner.website) {
    return (
      <a href={partner.website} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}
