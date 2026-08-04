"use client";

import { useCallback, useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/components/photo-viewer/gallery-context";

type PhotoLightboxProps = {
  items: GalleryPhoto[];
  startIndex?: number;
  className?: string;
  children?: React.ReactNode;
};

export function PhotoLightbox({
  items,
  startIndex = 0,
  className,
  children,
}: PhotoLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(startIndex);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retryNonce, setRetryNonce] = useState(0);

  const safeItems = items.length > 0 ? items : [];
  const current = safeItems[Math.min(index, Math.max(safeItems.length - 1, 0))];
  const hasMany = safeItems.length > 1;

  function openViewer() {
    setIndex(startIndex);
    setStatus("loading");
    setRetryNonce(0);
    setOpen(true);
  }

  const go = useCallback(
    (delta: number) => {
      if (!hasMany) return;
      setIndex((prev) => (prev + delta + safeItems.length) % safeItems.length);
      setStatus("loading");
    },
    [hasMany, safeItems.length],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  // Touch swipe
  useEffect(() => {
    if (!open) return;
    let startX = 0;
    function onStart(event: TouchEvent) {
      startX = event.touches[0]?.clientX ?? 0;
    }
    function onEnd(event: TouchEvent) {
      const endX = event.changedTouches[0]?.clientX ?? 0;
      const delta = endX - startX;
      if (Math.abs(delta) < 50) return;
      if (delta < 0) go(1);
      else go(-1);
    }
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [open, go]);

  if (!current) {
    return <>{children}</>;
  }

  return (
    <>
      <button
        type="button"
        className={cn("block w-full cursor-zoom-in text-left", className)}
        onClick={openViewer}
        aria-label={`查看原图：${current.alt}`}
      >
        {children}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="全屏照片"
          className="fixed inset-0 z-50 flex flex-col bg-night/95"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-paper/70">
            <p className="truncate text-xs tracking-wide">
              {hasMany ? `${index + 1} / ${safeItems.length}` : "原图"}
            </p>
            <button
              type="button"
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "border-paper/30 bg-transparent text-paper hover:bg-paper/10",
              )}
              onClick={() => setOpen(false)}
            >
              关闭
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-3 pb-8 sm:px-10"
            onClick={() => setOpen(false)}
          >
            {hasMany ? (
              <button
                type="button"
                className="absolute left-2 z-10 rounded-full border border-paper/20 bg-night/50 px-3 py-2 text-paper sm:left-4"
                aria-label="上一张"
                onClick={(event) => {
                  event.stopPropagation();
                  go(-1);
                }}
              >
                ←
              </button>
            ) : null}

            <div
              className="relative flex max-h-[80vh] max-w-5xl flex-col items-center"
              onClick={(event) => event.stopPropagation()}
            >
              {status === "loading" ? (
                <p className="absolute text-sm text-paper/50">加载原图…</p>
              ) : null}
              {status === "error" ? (
                <div className="text-center">
                  <p className="text-sm text-paper/80">原图加载失败</p>
                  <button
                    type="button"
                    className="mt-3 text-xs text-gold underline"
                    onClick={() => {
                      setRetryNonce((value) => value + 1);
                      setStatus("loading");
                    }}
                  >
                    重试
                  </button>
                </div>
              ) : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`${current.photoId}-${retryNonce}`}
                src={`/api/signed-original?photoId=${current.photoId}`}
                alt={current.alt}
                className={cn(
                  "max-h-[80vh] w-auto max-w-full object-contain transition-opacity duration-300",
                  status === "ready" ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setStatus("ready")}
                onError={() => setStatus("error")}
              />
              <p className="mt-3 max-w-md truncate text-center text-[11px] text-paper/45">
                {current.alt}
              </p>
              {hasMany ? (
                <p className="mt-1 text-[11px] text-paper/35">左右滑动或用方向键切换</p>
              ) : null}
            </div>

            {hasMany ? (
              <button
                type="button"
                className="absolute right-2 z-10 rounded-full border border-paper/20 bg-night/50 px-3 py-2 text-paper sm:right-4"
                aria-label="下一张"
                onClick={(event) => {
                  event.stopPropagation();
                  go(1);
                }}
              >
                →
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
