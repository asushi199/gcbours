import { PhotoPlaceholder } from "@/components/experience/photo-placeholder";
import type { MemoryLayoutProps } from "@/types/memory";

export function SplitStoryLayout({ memory, photos }: MemoryLayoutProps) {
  const left = photos.slice(0, 2);
  const rightPhoto = photos[2];

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="space-y-4">
        {left.map((photo) => (
          <PhotoPlaceholder
            key={photo.id}
            photo={photo}
            imageUrl={photo.thumbnailUrl}
            showLabel
          />
        ))}
      </div>
      <div className="lg:sticky lg:top-8">
        <p className="text-xs tracking-[0.18em] text-muted-ours">SPLIT STORY</p>
        <h2 className="mt-2 font-serif text-3xl text-ink">{memory.title}</h2>
        <p className="mt-3 text-muted-ours">{memory.oneLine}</p>
        <p className="mt-6 whitespace-pre-wrap leading-8 text-ink/90">{memory.diaryBody}</p>
        {rightPhoto ? (
          <div className="mt-8 max-w-xs">
            <PhotoPlaceholder
              photo={rightPhoto}
              imageUrl={rightPhoto.thumbnailUrl}
              showLabel
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
