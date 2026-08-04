import { NextResponse } from "next/server";
import { z } from "zod";
import { restoreDiaryVersion } from "@/features/diary-generation/analyze-memory";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  versionId: z.string().uuid(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
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

    const json: unknown = await request.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: "Invalid payload" }, { status: 400 });
    }

    await restoreDiaryVersion({
      ownerId: user.id,
      memoryId: id,
      versionId: parsed.data.versionId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Restore failed" },
      { status: 500 },
    );
  }
}
