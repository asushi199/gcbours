import { PhotoLightbox } from "@/components/photo-viewer/lightbox";
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
  /** Open fullscreen original on click (default true when photoId present). */
  enableLightbox?: boolean;
};

export function PhotoPlaceholder({
  photo,
  className,
  showLabel = false,
  fill = false,
  imageUrl,
  enableLightbox = true,
}: PhotoPlaceholderProps) {
  const resolvedUrl = imageUrl ?? photo.thumbnailUrl;
  const photoId = photo.photoId ?? photo.id;

  const body = (
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
      style={resolvedUrl ? undefined : { backgroundImage: photo.gradient }}
    >
      {resolvedUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedUrl}
          alt={photo.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      {showLabel ? (
        <span className="absolute bottom-2 left-2 text-[10px] tracking-wide text-white/80">
          {photo.label}
        </span>
      ) : null}
    </div>
  );

  if (enableLightbox && photoId && photoId.length > 20) {
    return (
      <PhotoLightbox photoId={photoId} alt={photo.alt} thumbnailUrl={resolvedUrl}>
        {body}
      </PhotoLightbox>
    );
  }

  return body;
}
