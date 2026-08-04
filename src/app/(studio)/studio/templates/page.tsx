import { FadeIn } from "@/components/motion/fade-in";
import { PhotoPlaceholder } from "@/components/experience/photo-placeholder";
import { mockMemories } from "@/config/mock-data";
import { memoryTemplates, MemoryLayoutRenderer } from "@/features/templates/registry";

export default function StudioTemplatesPage() {
  const sample = mockMemories[0];

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-12">
      <FadeIn>
        <p className="text-xs tracking-[0.2em] text-gold uppercase">Templates</p>
        <h1 className="mt-2 font-serif text-3xl text-ink">版式模板</h1>
        <p className="mt-2 text-sm text-muted-ours">
          AI 只能推荐这些预设，不能自由生成 HTML/CSS。
        </p>
      </FadeIn>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {memoryTemplates.map((template) => (
          <li key={template.id} className="rounded-2xl border border-line bg-paper p-4">
            <div className="grid grid-cols-3 gap-1">
              {sample.photos.slice(0, 3).map((photo) => (
                <PhotoPlaceholder key={`${template.id}-${photo.id}`} photo={photo} className="aspect-square rounded-sm" />
              ))}
            </div>
            <h2 className="mt-4 font-serif text-xl text-ink">{template.name}</h2>
            <p className="mt-1 text-xs text-muted-ours">{template.description}</p>
            <p className="mt-2 text-[10px] tracking-wide text-muted-ours uppercase">
              {template.id} · {template.minPhotos}–{template.maxPhotos} photos
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-14 rounded-2xl border border-line bg-background p-6">
        <h2 className="font-serif text-2xl text-ink">预览 · {sample.title}</h2>
        <div className="mt-6">
          <MemoryLayoutRenderer memory={sample} photos={sample.photos} mode="preview" />
        </div>
      </div>
    </section>
  );
}
