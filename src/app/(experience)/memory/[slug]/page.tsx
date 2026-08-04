import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeIn } from "@/components/motion/fade-in";
import { MemoryLayoutRenderer } from "@/features/templates/registry";
import { formatDisplayDate, getMemoryBySlug, mockMemories } from "@/config/mock-data";

type MemoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MemoryPage({ params }: MemoryPageProps) {
  const { slug } = await params;
  const memory = getMemoryBySlug(slug);

  if (!memory) {
    notFound();
  }

  const date = formatDisplayDate(memory.eventDate);
  const index = mockMemories.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? mockMemories[index - 1] : null;
  const next = index < mockMemories.length - 1 ? mockMemories[index + 1] : null;

  return (
    <article className="mx-auto w-full max-w-5xl px-6 py-12 md:py-16">
      <FadeIn>
        <p className="text-xs tracking-[0.2em] text-muted-ours">
          {date.year}.{date.short}
          {memory.placeName ? ` · ${memory.placeName}` : ""}
        </p>
        {memory.subtitle ? (
          <p className="mt-3 text-sm text-muted-ours">{memory.subtitle}</p>
        ) : null}
      </FadeIn>

      <FadeIn delay={0.08} className="mt-8">
        <MemoryLayoutRenderer memory={memory} photos={memory.photos} mode="published" />
      </FadeIn>

      {memory.tags && memory.tags.length > 0 ? (
        <ul className="mt-10 flex flex-wrap gap-2">
          {memory.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-3 py-1 text-xs text-muted-ours"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <nav className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:justify-between" aria-label="相邻回忆">
        {prev ? (
          <Link href={`/memory/${prev.slug}`} className="text-sm text-muted-ours hover:text-ink">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/memory/${next.slug}`} className="text-sm text-muted-ours hover:text-ink sm:text-right">
            {next.title} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
