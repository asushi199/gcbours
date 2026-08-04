"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FadeIn } from "@/components/motion/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function LoginForm({ supabaseReady }: { supabaseReady: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/studio";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabaseReady) {
      setError("尚未配置 Supabase 环境变量。");
      return;
    }

    setPending(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setPending(false);
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
      setPending(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-md flex-col justify-center px-6 py-16">
      <FadeIn>
        <p className="text-xs tracking-[0.25em] text-gold uppercase">Studio Auth</p>
        <h1 className="mt-3 font-serif text-3xl text-ink">管理员登录</h1>
        <p className="mt-2 text-sm text-muted-ours">
          使用 Supabase Auth。女朋友前台走独立解锁流程，不经过此处。
        </p>
      </FadeIn>

      {!supabaseReady ? (
        <div className="mt-8 rounded-2xl border border-line bg-paper p-4 text-sm text-muted-ours">
          请先在 `.env.local` 填写 `NEXT_PUBLIC_SUPABASE_URL` 与
          `NEXT_PUBLIC_SUPABASE_ANON_KEY`，并在 Supabase 创建管理员账号。
        </div>
      ) : null}

      <FadeIn delay={0.08}>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs text-muted-ours" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs text-muted-ours" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          {error ? (
            <p className="text-sm text-accent-ours" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending || !supabaseReady}
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            {pending ? "登录中…" : "进入 Studio"}
          </button>
        </form>
      </FadeIn>

      <Link href="/" className="mt-8 text-sm text-muted-ours underline-offset-4 hover:underline">
        返回前台
      </Link>
    </section>
  );
}
