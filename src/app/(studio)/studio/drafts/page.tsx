import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { mockDrafts } from "@/config/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export default async function StudioDraftsPage() {
  let drafts: Array<{ id: string; title: string; eventDate: string; meta: string }> = mockDrafts.map(
    (draft) => ({
      id: draft.id,
      title: draft.title,
      eventDate: draft.eventDate,
      meta: `${draft.photoCount} 张 · ${draft.updatedAt}`,
    }),
  );

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("memory_events")
        .select("id, title, event_date, updated_at, event_photos(count)")
        .eq("owner_id", user.id)
        .eq("status", "draft")
        .order("updated_at", { ascending: false });

      drafts = (data ?? []).map((item) => {
        const countRelation = Array.isArray(item.event_photos)
          ? item.event_photos[0]
          : item.event_photos;
        const count =
          countRelation && typeof countRelation === "object" && "count" in countRelation
            ? Number(countRelation.count)
            : 0;
        return {
          id: item.id,
          title: item.title,
          eventDate: item.event_date,
          meta: `${count} 张 · 更新于 ${new Date(item.updated_at).toLocaleString("zh-CN")}`,
        };
      });
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12">
      <FadeIn>
        <p className="text-xs tracking-[0.2em] text-gold uppercase">Drafts</p>
        <h1 className="mt-2 font-serif text-3xl text-ink">草稿</h1>
        <p className="mt-2 text-sm text-muted-ours">未发布的回忆不会出现在前台。</p>
      </FadeIn>
      <ul className="mt-8 space-y-3">
        {drafts.map((draft) => (
          <li key={draft.id}>
            <Link
              href={`/studio/memories/${draft.id}/edit`}
              className="block rounded-2xl border border-line bg-paper px-4 py-4 hover:border-ink/20"
            >
              <p className="font-serif text-xl text-ink">{draft.title}</p>
              <p className="mt-1 text-xs text-muted-ours">
                {draft.eventDate} · {draft.meta}
              </p>
            </Link>
          </li>
        ))}
        {drafts.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-muted-ours">
            还没有草稿。去{" "}
            <Link href="/studio/upload" className="underline">
              上传
            </Link>{" "}
            一张照片开始。
          </li>
        ) : null}
      </ul>
    </section>
  );
}
