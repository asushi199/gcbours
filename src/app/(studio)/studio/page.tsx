import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { mockDrafts, mockMemories, mockStats } from "@/config/mock-data";
import { cn } from "@/lib/utils";

export default function StudioPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-12">
      <FadeIn className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-gold uppercase">Studio</p>
          <h1 className="mt-2 font-serif text-3xl text-ink">管理后台</h1>
          <p className="mt-2 text-sm text-muted-ours">上传、整理、发布。AI 只生成草稿。</p>
        </div>
        <Link href="/studio/upload" className={cn(buttonVariants({ size: "lg" }))}>
          快速上传
        </Link>
      </FadeIn>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="总照片数" value={mockStats.photoCount} />
        <Stat label="已发布回忆" value={mockStats.memoryCount} />
        <Stat label="草稿" value={mockStats.draftCount} />
        <Stat label="待确认日期" value={mockStats.pendingDateCount} />
      </dl>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-serif text-xl text-ink">最近上传 / 草稿</h2>
          <ul className="mt-4 space-y-3">
            {mockDrafts.map((draft) => (
              <li key={draft.id}>
                <Link
                  href={`/studio/memories/${draft.id}/edit`}
                  className="block rounded-2xl border border-line bg-paper px-4 py-3 transition-colors hover:border-ink/20"
                >
                  <p className="font-medium text-ink">{draft.title}</p>
                  <p className="mt-1 text-xs text-muted-ours">
                    {draft.eventDate} · {draft.photoCount} 张 · {draft.updatedAt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-ink">已发布预览</h2>
          <ul className="mt-4 space-y-3">
            {mockMemories.slice(0, 3).map((memory) => (
              <li key={memory.id}>
                <Link
                  href={`/memory/${memory.slug}`}
                  className="block rounded-2xl border border-line bg-paper px-4 py-3 transition-colors hover:border-ink/20"
                >
                  <p className="font-medium text-ink">{memory.title}</p>
                  <p className="mt-1 text-xs text-muted-ours">
                    {memory.eventDate} · {memory.templateId}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <dt className="text-xs text-muted-ours">{label}</dt>
      <dd className="mt-1 font-serif text-3xl text-ink">{value}</dd>
    </div>
  );
}
