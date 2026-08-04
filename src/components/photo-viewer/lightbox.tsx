"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PhotoLightboxProps = {
  photoId: string;
  alt: string;
  thumbnailUrl?: string | null;
  className?: string;
  children?: React.ReactNode;
};

export function PhotoLightbox({
  photoId,
  alt,
  thumbnailUrl,
  className,
  children,
}: PhotoLightboxProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={cn("block w-full cursor-zoom-in text-left", className)}
        onClick={() => setOpen(true)}
        aria-label={`查看原图：${alt}`}
      >
        {children}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-night/90 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/signed-original?photoId=${photoId}`}
              alt={alt}
              className="max-h-[85vh] w-auto max-w-full object-contain"
            />
            {thumbnailUrl ? (
              <p className="mt-2 text-center text-[11px] text-paper/50">全屏原图（鉴权加载）</p>
            ) : null}
            <button
              type="button"
              className={cn(buttonVariants({ size: "sm", variant: "outline" }), "mt-3 w-full")}
              onClick={() => setOpen(false)}
            >
              关闭
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
