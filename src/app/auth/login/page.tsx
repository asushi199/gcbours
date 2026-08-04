import { Suspense } from "react";
import { LoginForm } from "@/components/studio/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function AuthLoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div className="p-8 text-sm text-muted-ours">加载登录页…</div>}>
        <LoginForm supabaseReady={isSupabaseConfigured()} />
      </Suspense>
    </main>
  );
}
