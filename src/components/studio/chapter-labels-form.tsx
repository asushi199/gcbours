"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { CHAPTER_IDS, type ChapterId } from "@/config/chapters";
import { cn } from "@/lib/utils";

type ChapterLabelsFormProps = {
  initialLabels: Record<ChapterId, string>;
};

export function ChapterLabelsForm({ initialLabels }: ChapterLabelsFormProps) {
  const [labels, setLabels] = useState(initialLabels);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/settings/chapter-labels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labels }),
      });
      const json = (await response.json()) as {
        ok?: boolean;
        message?: string;
        labels?: Record<ChapterId, string>;
      };
      if (!response.ok || !json.ok) {
        setError(json.message ?? "保存失败");
        return;
      }
      if (json.labels) setLabels(json.labels);
      setMessage("章节名称已更新。刷新「我们的故事」页即可看到。");
    } catch {
      setError("网络错误");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className="mt-10 rounded-2xl border border-line bg-paper px-5 py-6"
    >
      <h2 className="font-serif text-xl text-ink">故事章节名称</h2>
      <p className="mt-2 text-sm text-muted-ours">
        这里改的是「我们的故事」页上的章节标题。每篇回忆归属哪个章节，在编辑器里选。
      </p>
      <div className="mt-4 space-y-3">
        {CHAPTER_IDS.map((id) => (
          <div key={id}>
            <label className="block text-[11px] text-muted-ours" htmlFor={`chapter-label-${id}`}>
              {id}
            </label>
            <input
              id={`chapter-label-${id}`}
              value={labels[id]}
              maxLength={40}
              onChange={(event) =>
                setLabels((prev) => ({ ...prev, [id]: event.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>
      {error ? <p className="mt-2 text-xs text-accent-ours">{error}</p> : null}
      {message ? <p className="mt-2 text-xs text-muted-ours">{message}</p> : null}
      <button type="submit" disabled={busy} className={cn(buttonVariants({ size: "sm" }), "mt-4")}>
        {busy ? "保存中…" : "保存章节名称"}
      </button>
    </form>
  );
}
