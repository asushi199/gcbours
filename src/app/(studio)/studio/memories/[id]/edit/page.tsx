import Link from "next/link";
import { notFound } from "next/navigation";
import { MemoryEditor } from "@/components/studio/memory-editor";
import { getEditorMemory } from "@/features/memories/get-editor-memory";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getMemoryById } from "@/config/mock-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StudioMemoryEditPage({ params }: PageProps) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    const mock = getMemoryById(id);
    return (
      <MemoryEditor
        initial={{
          memory: {
            ...mock,
            oneLine: mock.oneLine,
            diaryBody: mock.diaryBody,
            userNote: "",
            placeName: mock.placeName,
          },
          photos: mock.photos.map((photo, index) => ({
            ...photo,
            photoId: photo.id,
            thumbnailPath: null,
            thumbnailUrl: null,
            takenAt: null,
            role: index === 0 ? "cover" : photo.role,
          })),
          siblingDrafts: [],
          diaryVersions: [],
        }}
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const payload = await getEditorMemory(user.id, id);
  if (!payload) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="font-serif text-3xl text-ink">找不到这份草稿</h1>
        <p className="mt-3 text-sm text-muted-ours">
          可能尚未跑 migration、或 ID 不属于当前账号。
        </p>
        <Link href="/studio/drafts" className="mt-6 inline-block text-sm text-accent-ours underline">
          返回草稿列表
        </Link>
      </section>
    );
  }

  return <MemoryEditor initial={payload} />;
}
