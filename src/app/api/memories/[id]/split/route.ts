import { NextResponse } from "next/server";
import { z } from "zod";
import { splitMemoryEvent } from "@/features/memories/merge-split";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  photoIdsForNewEvent: z.array(z.string().uuid()).min(1),
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

    const result = await splitMemoryEvent({
      ownerId: user.id,
      memoryId: id,
      photoIdsForNewEvent: parsed.data.photoIdsForNewEvent,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Split failed" },
      { status: 500 },
    );
  }
}
