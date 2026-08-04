import { NextResponse } from "next/server";
import { unpublishMemoryEvent } from "@/features/memories/publish-memory";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: false, message: "Supabase not configured" }, { status: 503 });
    }

    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const result = await unpublishMemoryEvent({ ownerId: user.id, memoryId: id });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Unpublish failed" },
      { status: 400 },
    );
  }
}
