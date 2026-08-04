export type MemoryStatus = "draft" | "published" | "archived";

export type PhotoRole =
  | "cover"
  | "hero"
  | "detail"
  | "food"
  | "place"
  | "portrait"
  | "candid";

export type PhotoOrientation = "portrait" | "landscape" | "square";

export type MemoryEvent = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  oneLine: string;
  diaryBody: string;
  eventDate: string;
  placeName: string | null;
  templateId: string;
  status: MemoryStatus;
  mood?: string;
  tags?: string[];
  chapter?: string;
};

export type EventPhoto = {
  id: string;
  label: string;
  role: PhotoRole;
  orientation: PhotoOrientation;
  /** CSS gradient used as Phase 1 local placeholder */
  gradient: string;
  alt: string;
  thumbnailUrl?: string | null;
  /** DB photo id — enables fullscreen original proxy */
  photoId?: string;
};

export type MemoryLayoutProps = {
  memory: MemoryEvent;
  photos: EventPhoto[];
  mode: "preview" | "published";
};

export type MemoryTemplateDefinition = {
  id: string;
  name: string;
  description: string;
  minPhotos: number;
  maxPhotos: number;
  preferredOrientations: PhotoOrientation[];
  supportedMoods: string[];
};
