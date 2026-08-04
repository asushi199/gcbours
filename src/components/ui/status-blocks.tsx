import Link from "next/link";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-line bg-paper/60 px-6 py-12 text-center",
        className,
      )}
    >
      <p className="font-serif text-xl text-ink">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-muted-ours">{description}</p>
      ) : null}
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-5 inline-block text-sm text-accent-ours underline-offset-4 hover:underline"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function LoadingState({ label = "加载中…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status">
      <div
        className="h-8 w-8 animate-pulse rounded-full border border-line bg-paper"
        aria-hidden
      />
      <p className="text-sm text-muted-ours">{label}</p>
    </div>
  );
}

export function ErrorState({
  title = "出了点问题",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-paper px-6 py-10 text-center">
      <p className="font-serif text-xl text-ink">{title}</p>
      {description ? <p className="mt-2 text-sm text-muted-ours">{description}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 text-sm text-accent-ours underline-offset-4 hover:underline"
        >
          重试
        </button>
      ) : null}
    </div>
  );
}
