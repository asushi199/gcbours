import { NextResponse } from "next/server";
import { uploadPhotoForOwner } from "@/features/uploads/upload-photo";
import { isDriveConfigured } from "@/lib/google-drive/gas-client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { ok: false, message: "Supabase is not configured." },
        { status: 503 },
      );
    }
    if (!isDriveConfigured()) {
      return NextResponse.json(
        { ok: false, message: "GAS Drive gateway is not configured." },
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

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, message: "Missing file field." },
        { status: 400 },
      );
    }

    const photo = await uploadPhotoForOwner({ ownerId: user.id, file });
    return NextResponse.json({ ok: true, photo });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Upload failed.",
      },
      { status: 500 },
    );
  }
}
