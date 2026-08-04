import { NextResponse } from "next/server";
import { z } from "zod";
import { CHAPTER_IDS, resolveChapterLabels, type ChapterId } from "@/config/chapters";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  labels: z.record(z.string(), z.string().max(40)),
});

export async function GET() {
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

    const { data } = await supabase
      .from("relationship_settings")
      .select("chapter_labels")
      .eq("owner_id", user.id)
      .maybeSingle();

    const labels = resolveChapterLabels(
      (data?.chapter_labels as Partial<Record<ChapterId, string>> | null) ?? null,
    );
    return NextResponse.json({ ok: true, labels });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Load failed" },
      { status: 500 },
    );
  }
}

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

    const custom: Partial<Record<ChapterId, string>> = {};
    for (const id of CHAPTER_IDS) {
      const value = parsed.data.labels[id]?.trim();
      if (value) custom[id] = value.slice(0, 40);
    }
    const labels = resolveChapterLabels(custom);

    const { data: existing } = await supabase
      .from("relationship_settings")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from("relationship_settings")
        .update({ chapter_labels: labels })
        .eq("id", existing.id)
        .eq("owner_id", user.id);
      if (error) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
      }
    } else {
      const { error } = await supabase.from("relationship_settings").insert({
        owner_id: user.id,
        relationship_title: "OURS",
        partner_name: "她",
        owner_name: "我",
        chapter_labels: labels,
      });
      if (error) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, labels });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Save failed" },
      { status: 500 },
    );
  }
}
