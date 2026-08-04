import { NextResponse } from "next/server";
import { z } from "zod";
import { createDraftEventsFromPhotos } from "@/features/uploads/create-draft-events";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  photoIds: z.array(z.string().uuid()).min(1).max(100),
});

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { ok: false, message: "Supabase is not configured." },
        { status: 503 },
      );
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
      return NextResponse.json(
        { ok: false, message: "Invalid photoIds payload." },
        { status: 400 },
      );
    }

    const events = await createDraftEventsFromPhotos({
      ownerId: user.id,
      photoIds: parsed.data.photoIds,
    });

    return NextResponse.json({ ok: true, events });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Grouping failed.",
      },
      { status: 500 },
    );
  }
}
