import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { UnlockPasswordForm } from "@/components/studio/unlock-password-form";
import { buttonVariants } from "@/components/ui/button";
import { mockRelationship } from "@/config/mock-data";
import { getDriveConnectionStatus, isDriveConfigured } from "@/lib/google-drive/gas-client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export default async function StudioSettingsPage() {
  const driveStatus = await getDriveConnectionStatus();
  const supabaseReady = isSupabaseConfigured();

  let passwordSet = false;
  if (supabaseReady) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("relationship_settings")
          .select("access_hash")
          .eq("owner_id", user.id)
          .maybeSingle();
        passwordSet = Boolean(data?.access_hash);
      }
    } catch {
      passwordSet = false;
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12">
      <FadeIn>
        <p className="text-xs tracking-[0.2em] text-gold uppercase">Settings</p>
        <h1 className="mt-2 font-serif text-3xl text-ink">设置</h1>
        <p className="mt-2 text-sm text-muted-ours">
          在这里配置对方解锁密码。Drive 通过 Google Apps Script 网关接入。
        </p>
      </FadeIn>

      <dl className="mt-10 space-y-4">
        <Row label="关系标题" value={mockRelationship.relationshipTitle} />
        <Row
          label="称呼（Mock）"
          value={`${mockRelationship.ownerName} / ${mockRelationship.partnerName}`}
        />
        <Row label="默认日记语气" value="温柔日记" />
        <Row
          label="Supabase"
          value={supabaseReady ? "已配置环境变量" : "未配置（本地可用 Mock UI）"}
        />
        <Row label="原图存储" value="Google Drive via GAS" />
        <Row label="缩略图存储" value="Supabase 私有桶 memory-thumbnails" />
      </dl>

      {supabaseReady ? <UnlockPasswordForm initiallySet={passwordSet} /> : null}

      <div className="mt-10 rounded-2xl border border-line bg-paper px-5 py-6">
        <h2 className="font-serif text-xl text-ink">Google Drive（GAS 网关）</h2>
        <p className="mt-2 text-sm text-muted-ours">{driveStatus.message}</p>
        <ul className="mt-4 space-y-1 text-xs text-muted-ours">
          <li>Web App URL：{driveStatus.gasUrlConfigured ? "已配置" : "缺失"}</li>
          <li>共享密钥：{driveStatus.sharedSecretConfigured ? "已配置" : "缺失"}</li>
          <li>根文件夹 ID：{driveStatus.rootFolderConfigured ? "已配置" : "可选/缺失"}</li>
          <li>连通性：{driveStatus.reachable ? "可达" : "未连通"}</li>
        </ul>

        <div className="mt-5 flex flex-wrap gap-3">
          {isDriveConfigured() ? (
            <a href="/api/drive/status" className={cn(buttonVariants({ variant: "outline" }))}>
              查看 JSON 状态
            </a>
          ) : (
            <button
              type="button"
              disabled
              className={cn(buttonVariants({ variant: "outline" }), "opacity-60")}
            >
              先配置 GAS_WEB_APP_URL / GAS_SHARED_SECRET
            </button>
          )}
          <Link href="/auth/login" className={cn(buttonVariants({ variant: "outline" }))}>
            管理员登录页
          </Link>
        </div>

        <p className="mt-4 text-xs leading-6 text-muted-ours">
          部署步骤见 <code className="rounded bg-background px-1">docs/phase-2-setup.md</code>
          ，脚本模板在 <code className="rounded bg-background px-1">gas/OursDriveGateway.gs</code>
          。
        </p>
      </div>

      <form action="/auth/logout" method="post" className="mt-8">
        <button type="submit" className={cn(buttonVariants({ variant: "outline" }))}>
          退出登录
        </button>
      </form>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line py-3">
      <dt className="text-sm text-muted-ours">{label}</dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}
