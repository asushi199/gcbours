import { PhotoPlaceholder } from "@/components/experience/photo-placeholder";
import type { MemoryLayoutProps } from "@/types/memory";

export function FullBleedQuoteLayout({ memory, photos }: MemoryLayoutProps) {
  const hero = photos[0];

  return (
    <div className="overflow-hidden rounded-2xl">
      <div className="relative min-h-[420px] md:min-h-[520px]">
        {hero ? (
          <PhotoPlaceholder
            photo={hero}
            imageUrl={hero.thumbnailUrl}
            fill
            className="absolute inset-0 rounded-none"
          />
        ) : (
          <div className="absolute inset-0 bg-night" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-transparent" />
        <div className="relative z-10 flex min-h-[420px] flex-col justify-end px-6 py-10 md:min-h-[520px] md:px-12">
          <p className="text-xs tracking-[0.25em] text-gold uppercase">Full Bleed</p>
          <blockquote className="mt-4 max-w-xl font-serif text-3xl leading-snug text-paper md:text-4xl">
            &ldquo;{memory.oneLine}&rdquo;
          </blockquote>
          <h2 className="mt-6 text-sm tracking-wide text-paper/70">{memory.title}</h2>
        </div>
      </div>
      <div className="bg-paper px-6 py-10 md:px-12">
        <p className="mx-auto max-w-2xl whitespace-pre-wrap leading-8 text-ink/90">{memory.diaryBody}</p>
      </div>
    </div>
  );
}
