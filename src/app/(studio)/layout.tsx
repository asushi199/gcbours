import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { StudioNav } from "@/components/studio/studio-nav";

export default function StudioGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <StudioNav />
      {!supabaseReady ? (
        <div className="border-b border-line bg-paper px-4 py-2 text-center text-xs text-muted-ours">
          Supabase 未配置：Studio UI 可预览，但登录保护与数据库尚未生效。见{" "}
          <Link href="/studio/settings" className="underline underline-offset-2">
            设置
          </Link>
          。
        </div>
      ) : null}
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
