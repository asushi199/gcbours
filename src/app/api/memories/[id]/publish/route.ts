import { NextResponse } from "next/server";
import {
  PublishMemorySchema,
  publishMemoryEvent,
} from "@/features/memories/publish-memory";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

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
    const parsed = PublishMemorySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid slug" },
        { status: 400 },
      );
    }

    const result = await publishMemoryEvent({
      ownerId: user.id,
      memoryId: id,
      slug: parsed.data.slug,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Publish failed" },
      { status: 400 },
    );
  }
}
