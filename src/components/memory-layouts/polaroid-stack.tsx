import { PhotoPlaceholder } from "@/components/experience/photo-placeholder";
import type { MemoryLayoutProps } from "@/types/memory";

export function PolaroidStackLayout({ memory, photos }: MemoryLayoutProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="relative mx-auto h-[420px] w-full max-w-md">
        {photos.slice(0, 3).map((photo, index) => (
          <div
            key={photo.id}
            className="absolute w-[70%] rounded-sm bg-paper p-3 shadow-[0_12px_40px_rgba(32,28,26,0.12)]"
            style={{
              left: `${12 + index * 10}%`,
              top: `${8 + index * 14}%`,
              transform: `rotate(${index === 0 ? -6 : index === 1 ? 3 : 8}deg)`,
              zIndex: index + 1,
            }}
          >
            <PhotoPlaceholder
              photo={photo}
              imageUrl={photo.thumbnailUrl}
              className="rounded-sm"
            />
            <p className="mt-2 text-center font-serif text-sm text-ink/70">{photo.label}</p>
          </div>
        ))}
      </div>
      <div>
        <p className="text-xs tracking-[0.18em] text-muted-ours">POLAROID</p>
        <h2 className="mt-2 font-serif text-3xl text-ink">{memory.title}</h2>
        <p className="mt-3 rounded-lg border border-line bg-paper px-4 py-3 text-sm leading-7 text-ink shadow-sm">
          {memory.oneLine}
        </p>
        <p className="mt-6 whitespace-pre-wrap leading-8 text-ink/90">{memory.diaryBody}</p>
      </div>
    </div>
  );
}
