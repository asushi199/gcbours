import { cn } from "@/lib/utils";
import type { EventPhoto } from "@/types/memory";

type PhotoPlaceholderProps = {
  photo: EventPhoto;
  className?: string;
  showLabel?: boolean;
  /** Skip orientation aspect ratio (for full-bleed fills). */
  fill?: boolean;
  /** Optional real thumbnail URL (Phase 4+). */
  imageUrl?: string | null;
};

export function PhotoPlaceholder({
  photo,
  className,
  showLabel = false,
  fill = false,
  imageUrl,
}: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={photo.alt}
      className={cn(
        "relative overflow-hidden rounded-md bg-line bg-cover bg-center",
        !fill && photo.orientation === "portrait" && "aspect-[3/4]",
        !fill && photo.orientation === "landscape" && "aspect-[4/3]",
        !fill && photo.orientation === "square" && "aspect-square",
        fill && "h-full w-full",
        className,
      )}
      style={
        imageUrl
          ? undefined
          : { backgroundImage: photo.gradient }
      }
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={photo.alt} className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      {showLabel ? (
        <span className="absolute bottom-2 left-2 text-[10px] tracking-wide text-white/80">
          {photo.label}
        </span>
      ) : null}
    </div>
  );
}
