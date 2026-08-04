import { PhotoPlaceholder } from "@/components/experience/photo-placeholder";
import type { MemoryLayoutProps } from "@/types/memory";

export function EditorialHeroLayout({ memory, photos }: MemoryLayoutProps) {
  const cover = photos[0];
  const rest = photos.slice(1, 3);

  return (
    <div className="space-y-8">
      {cover ? (
        <PhotoPlaceholder
          photo={cover}
          imageUrl={cover.thumbnailUrl}
          className="w-full rounded-xl md:aspect-[16/9]"
          showLabel
        />
      ) : null}
      <div className="max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-muted-ours uppercase">Editorial</p>
        <h2 className="mt-2 font-serif text-3xl text-ink md:text-4xl">{memory.title}</h2>
        <p className="mt-3 text-lg text-muted-ours">{memory.oneLine}</p>
        <p className="mt-6 whitespace-pre-wrap leading-8 text-ink/90">{memory.diaryBody}</p>
      </div>
      {rest.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {rest.map((photo) => (
            <PhotoPlaceholder
              key={photo.id}
              photo={photo}
              imageUrl={photo.thumbnailUrl}
              showLabel
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
