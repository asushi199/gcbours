import { NextResponse } from "next/server";
import { z } from "zod";
import { mergeMemoryEvents } from "@/features/memories/merge-split";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  targetId: z.string().uuid(),
  sourceId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: false, message: "Supabase not configured" }, { status: 503 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const json: unknown = await request.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
    }

    const result = await mergeMemoryEvents({
      ownerId: user.id,
      targetId: parsed.data.targetId,
      sourceId: parsed.data.sourceId,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Merge failed" },
      { status: 500 },
    );
  }
}
