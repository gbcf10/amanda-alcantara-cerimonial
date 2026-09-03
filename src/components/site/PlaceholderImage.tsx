export function PlaceholderImage({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-muted to-border ${className}`}
    >
      <span className="font-serif-display text-lg text-accent/60">
        {label ?? "Amanda Cerimonial"}
      </span>
    </div>
  );
}
