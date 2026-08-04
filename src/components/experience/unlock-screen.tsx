"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { mockRelationship } from "@/config/mock-data";
import { cn } from "@/lib/utils";

export function UnlockScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.trim().length < 4) {
      setStatus("error");
      return;
    }
    setStatus("success");
    window.setTimeout(() => {
      router.push("/");
    }, 1200);
  }

  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col items-center justify-center overflow-hidden bg-night px-6 py-16 text-center text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.35) 3px)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,161,91,0.12),transparent_55%)]" />

      {status === "success" ? (
        <FadeIn className="relative z-10 space-y-4">
          <p className="text-xs tracking-[0.3em] text-gold uppercase">Identity confirmed</p>
          <h1 className="font-serif text-3xl md:text-4xl">
            Welcome back, {mockRelationship.partnerName}
          </h1>
        </FadeIn>
      ) : (
        <FadeIn className="relative z-10 w-full max-w-md">
          <p className="text-xs tracking-[0.3em] text-gold uppercase">
            Personal memory archive
          </p>
          <h1 className="mt-6 font-serif text-3xl leading-tight md:text-4xl">
            Identity verification required
          </h1>
          <p className="mt-4 text-sm leading-7 text-paper/65">
            This archive belongs to us.
            <br />
            Enter the date only we remember.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-10 w-full max-w-xs">
            <label className="block text-left text-[11px] tracking-[0.2em] text-paper/50" htmlFor="unlock-code">
              MMDD
            </label>
            <input
              id="unlock-code"
              name="unlock-code"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setStatus("idle");
              }}
              placeholder="••••"
              className="mt-2 w-full border-b border-gold/40 bg-transparent py-3 text-center text-2xl tracking-[0.5em] text-paper outline-none placeholder:text-paper/25 focus-visible:border-gold"
              aria-invalid={status === "error"}
              aria-describedby={status === "error" ? "unlock-error" : undefined}
            />
            {status === "error" ? (
              <p id="unlock-error" className="mt-3 text-xs text-accent-ours">
                请输入至少 4 位专属日期（Phase 1 Mock，任意 4 位可进入）
              </p>
            ) : (
              <p className="mt-3 text-xs text-paper/35">Phase 1 Mock · 尚未校验真实密码</p>
            )}
            <button
              type="submit"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "mt-8 w-full border border-gold/30 bg-transparent text-paper hover:bg-paper/10",
              )}
            >
              ENTER
            </button>
          </form>

          <Link
            href="/"
            className="mt-8 inline-block text-xs tracking-wide text-paper/40 underline-offset-4 hover:text-paper/70 hover:underline"
          >
            跳过（开发预览）
          </Link>
        </FadeIn>
      )}
    </section>
  );
}
