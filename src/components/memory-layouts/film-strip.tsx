import { PhotoPlaceholder } from "@/components/experience/photo-placeholder";
import type { MemoryLayoutProps } from "@/types/memory";

export function FilmStripLayout({ memory, photos }: MemoryLayoutProps) {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs tracking-[0.18em] text-muted-ours">FILM STRIP</p>
        <h2 className="mt-2 font-serif text-3xl text-ink">{memory.title}</h2>
        <p className="mt-2 text-muted-ours">{memory.oneLine}</p>
      </header>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        {photos.map((photo, index) => (
          <div key={photo.id} className="w-48 shrink-0 md:w-56">
            <div className="rounded-md bg-night p-2">
              <PhotoPlaceholder
                photo={photo}
                imageUrl={photo.thumbnailUrl}
                className="rounded-sm"
              />
              <p className="mt-2 text-center text-[10px] tracking-widest text-paper/50">
                {String(index + 1).padStart(2, "0")}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="max-w-2xl whitespace-pre-wrap leading-8 text-ink/90">{memory.diaryBody}</p>
    </div>
  );
}
