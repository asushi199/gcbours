"use client";

import { PhotoReveal } from "@/components/motion/photo-reveal";
import { useMemoryPhotoGallery } from "@/components/photo-viewer/gallery-context";
import { PhotoLightbox } from "@/components/photo-viewer/lightbox";
import { cn } from "@/lib/utils";
import type { EventPhoto } from "@/types/memory";

type PhotoPlaceholderProps = {
  photo: EventPhoto;
  className?: string;
  showLabel?: boolean;
  fill?: boolean;
  imageUrl?: string | null;
  enableLightbox?: boolean;
  reveal?: boolean;
};

export function PhotoPlaceholder({
  photo,
  className,
  showLabel = false,
  fill = false,
  imageUrl,
  enableLightbox = true,
  reveal = true,
}: PhotoPlaceholderProps) {
  const resolvedUrl = imageUrl ?? photo.thumbnailUrl;
  const photoId = photo.photoId ?? photo.id;
  const gallery = useMemoryPhotoGallery();

  const body = (
    <div
      role="img"
      aria-label={photo.alt}
      className={cn(
        "relative overflow-hidden rounded-md bg-line bg-cover bg-center shadow-[0_8px_24px_rgba(32,28,26,0.06)]",
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

  const revealed = reveal ? <PhotoReveal>{body}</PhotoReveal> : body;

  if (enableLightbox && photoId && photoId.length > 20) {
    const items =
      gallery?.items && gallery.items.length > 0
        ? gallery.items
        : [{ photoId, alt: photo.alt, thumbnailUrl: resolvedUrl }];
    const startIndex = Math.max(
      0,
      items.findIndex((item) => item.photoId === photoId),
    );

    return (
      <PhotoLightbox items={items} startIndex={startIndex === -1 ? 0 : startIndex}>
        {revealed}
      </PhotoLightbox>
    );
  }

  return revealed;
}
