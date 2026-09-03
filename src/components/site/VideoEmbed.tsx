import { resolveVideoSource } from "@/lib/videoEmbed";

export function VideoEmbed({ url, className = "" }: { url: string; className?: string }) {
  const source = resolveVideoSource(url);

  if (source.kind === "youtube" || source.kind === "vimeo") {
    return (
      <div className={`aspect-video overflow-hidden rounded-xl bg-black ${className}`}>
        <iframe
          src={source.embedUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (source.kind === "file") {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        src={source.url}
        controls
        className={`aspect-video w-full rounded-xl bg-black object-cover ${className}`}
      />
    );
  }

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex aspect-video items-center justify-center rounded-xl bg-muted text-sm text-accent underline ${className}`}
    >
      Assistir vídeo
    </a>
  );
}
