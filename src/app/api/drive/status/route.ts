import { NextResponse } from "next/server";
import { getDriveConnectionStatus } from "@/lib/google-drive/gas-client";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function GET() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }
  }

  const status = await getDriveConnectionStatus();
  return NextResponse.json({ ok: true, status });
}
