import { PhotoPlaceholder } from "@/components/experience/photo-placeholder";
import type { MemoryLayoutProps } from "@/types/memory";

export function ThreePhotoJournalLayout({ memory, photos }: MemoryLayoutProps) {
  const trio = photos.slice(0, 3);

  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <p className="text-xs tracking-[0.18em] text-muted-ours">THREE PHOTO JOURNAL</p>
        <h2 className="mt-2 font-serif text-3xl text-ink">{memory.title}</h2>
        <p className="mt-2 text-muted-ours">{memory.oneLine}</p>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        {trio.map((photo) => (
          <PhotoPlaceholder
            key={photo.id}
            photo={photo}
            imageUrl={photo.thumbnailUrl}
            className="aspect-[3/4]"
            showLabel
          />
        ))}
      </div>
      <p className="mx-auto max-w-2xl whitespace-pre-wrap leading-8 text-ink/90">
        {memory.diaryBody}
      </p>
    </div>
  );
}
