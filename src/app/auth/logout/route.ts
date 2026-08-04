import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/auth/login`, { status: 303 });
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(`${origin}/auth/login`, { status: 303 });
}
