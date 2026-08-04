"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

export type GalleryPhoto = {
  photoId: string;
  alt: string;
  thumbnailUrl?: string | null;
};

type GalleryContextValue = {
  items: GalleryPhoto[];
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function MemoryPhotoGalleryProvider({
  photos,
  children,
}: {
  photos: Array<{
    id: string;
    photoId?: string;
    alt: string;
    thumbnailUrl?: string | null;
  }>;
  children: ReactNode;
}) {
  const items = useMemo(
    () =>
      photos
        .map((photo) => ({
          photoId: photo.photoId ?? photo.id,
          alt: photo.alt,
          thumbnailUrl: photo.thumbnailUrl ?? null,
        }))
        .filter((photo) => photo.photoId.length > 20),
    [photos],
  );

  return <GalleryContext.Provider value={{ items }}>{children}</GalleryContext.Provider>;
}

export function useMemoryPhotoGallery() {
  return useContext(GalleryContext);
}
