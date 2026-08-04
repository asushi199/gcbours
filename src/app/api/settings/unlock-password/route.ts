import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/security/password-hash";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const BodySchema = z.object({
  password: z.string().min(4).max(64),
  confirmPassword: z.string().min(4).max(64),
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
      return NextResponse.json({ ok: false, message: "密码至少 4 位。" }, { status: 400 });
    }
    if (parsed.data.password !== parsed.data.confirmPassword) {
      return NextResponse.json({ ok: false, message: "两次输入不一致。" }, { status: 400 });
    }

    const accessHash = await hashPassword(parsed.data.password);

    const { data: existing } = await supabase
      .from("relationship_settings")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase
        .from("relationship_settings")
        .update({ access_hash: accessHash })
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
        access_hash: accessHash,
      });
      if (error) {
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, passwordSet: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Save failed" },
      { status: 500 },
    );
  }
}

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
      .select("access_hash, partner_name, unlock_title, unlock_hint")
      .eq("owner_id", user.id)
      .maybeSingle();

    return NextResponse.json({
      ok: true,
      passwordSet: Boolean(data?.access_hash),
      partnerName: data?.partner_name ?? null,
      unlockTitle: data?.unlock_title ?? null,
      unlockHint: data?.unlock_hint ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Load failed" },
      { status: 500 },
    );
  }
}
