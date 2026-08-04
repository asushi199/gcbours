"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PhotoPlaceholder } from "@/components/experience/photo-placeholder";
import { FadeIn } from "@/components/motion/fade-in";
import { formatDisplayDate, mockMemories } from "@/config/mock-data";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "全部" },
  { id: "旅行", label: "旅行" },
  { id: "日常", label: "日常" },
  { id: "庆祝", label: "庆祝" },
  { id: "食物", label: "食物" },
  { id: "地点", label: "地点" },
] as const;

export default function TimelinePage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");

  const memories = useMemo(() => {
    if (filter === "all") return mockMemories;
    return mockMemories.filter((memory) => memory.tags?.includes(filter));
  }, [filter]);

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-12 md:py-16">
      <FadeIn>
        <p className="text-xs tracking-[0.25em] text-gold uppercase">Timeline</p>
        <h1 className="mt-3 font-serif text-4xl text-ink">时间线</h1>
        <p className="mt-3 text-sm text-muted-ours">按日期慢慢往回翻。</p>
      </FadeIn>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="筛选">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors",
              filter === item.id
                ? "border-ink bg-ink text-paper"
                : "border-line bg-paper text-muted-ours hover:border-ink/30",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <ul className="mt-10 space-y-10">
        {memories.map((memory, index) => {
          const date = formatDisplayDate(memory.eventDate);
          const cover = memory.photos[0];

          return (
            <FadeIn key={memory.id} delay={0.04 * index}>
              <li className="grid gap-5 border-t border-line pt-8 md:grid-cols-[88px_1fr]">
                <div className="md:sticky md:top-20">
                  <p className="font-serif text-3xl text-ink">{date.short}</p>
                  <p className="text-xs text-muted-ours">{date.year}</p>
                </div>
                <Link
                  href={`/memory/${memory.slug}`}
                  className="group grid gap-4 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[1.2fr_1fr] sm:items-center"
                >
                  {cover ? (
                    <PhotoPlaceholder
                      photo={cover}
                      className="rounded-xl transition-transform duration-200 group-hover:scale-[1.01]"
                    />
                  ) : null}
                  <div>
                    <p className="text-xs text-muted-ours">
                      {memory.placeName ?? "地点未记录"}
                    </p>
                    <h2 className="mt-1 font-serif text-2xl text-ink group-hover:text-accent-ours md:text-3xl">
                      {memory.title}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-muted-ours">{memory.oneLine}</p>
                  </div>
                </Link>
              </li>
            </FadeIn>
          );
        })}
      </ul>

      {memories.length === 0 ? (
        <p className="mt-12 text-sm text-muted-ours">这个分类下暂时没有回忆。</p>
      ) : null}
    </section>
  );
}
