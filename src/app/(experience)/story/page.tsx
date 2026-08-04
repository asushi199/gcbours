import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { getStoryChapters } from "@/features/memories/published";

export default async function StoryPage() {
  const chapters = await getStoryChapters();

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
      <FadeIn>
        <p className="text-xs tracking-[0.25em] text-gold uppercase">Chapters</p>
        <h1 className="mt-3 font-serif text-4xl text-ink">我们的故事</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-muted-ours">
          按章节慢慢读。每一章都是一种相处的样子。
        </p>
      </FadeIn>

      {chapters.length === 0 ? (
        <p className="mt-12 text-sm text-muted-ours">还没有已发布的回忆。去 Studio 发布第一篇吧。</p>
      ) : (
        <ol className="mt-12 space-y-8">
          {chapters.map((chapter, index) => (
            <FadeIn key={chapter.id} delay={0.05 * index}>
              <li className="group grid gap-4 border-t border-line pt-6 sm:grid-cols-[140px_1fr] sm:items-center">
                <div
                  className="aspect-[4/3] overflow-hidden rounded-xl bg-cover bg-center sm:aspect-square"
                  style={
                    chapter.coverUrl
                      ? { backgroundImage: `url(${chapter.coverUrl})` }
                      : { backgroundImage: chapter.coverGradient }
                  }
                  aria-hidden
                />
                <div>
                  <p className="text-xs tracking-[0.25em] text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-1 font-serif text-2xl text-ink md:text-3xl">{chapter.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted-ours">{chapter.oneLine}</p>
                  <p className="mt-3 text-xs text-muted-ours">
                    {chapter.count} 篇回忆
                    {chapter.dateRange ? ` · ${chapter.dateRange}` : ""}
                  </p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>
      )}

      <FadeIn delay={0.2} className="mt-12">
        <Link
          href="/timeline"
          className="text-sm text-accent-ours underline-offset-4 hover:underline"
        >
          前往时间线 →
        </Link>
      </FadeIn>
    </section>
  );
}
