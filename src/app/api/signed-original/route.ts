import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchDriveFile } from "@/lib/google-drive/gas-client";
import {
  PARTNER_COOKIE_NAME,
  verifyPartnerSessionToken,
} from "@/lib/security/partner-session";
import { createServiceClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ ok: false, message: "Supabase not configured" }, { status: 503 });
    }

    const url = new URL(request.url);
    const photoId = url.searchParams.get("photoId");
    if (!photoId) {
      return NextResponse.json({ ok: false, message: "photoId required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const partnerToken = cookieStore.get(PARTNER_COOKIE_NAME)?.value;
    const partnerOk = partnerToken
      ? (await verifyPartnerSessionToken(partnerToken)).ok
      : false;

    const supabaseUser = await createClient();
    const {
      data: { user },
    } = await supabaseUser.auth.getUser();

    if (!partnerOk && !user) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const admin = createServiceClient();
    const { data: photo, error } = await admin
      .from("photos")
      .select("id, drive_file_id, mime_type, owner_id")
      .eq("id", photoId)
      .maybeSingle();

    if (error || !photo?.drive_file_id) {
      return NextResponse.json({ ok: false, message: "Not found" }, { status: 404 });
    }

    if (partnerOk) {
      const { data: links } = await admin
        .from("event_photos")
        .select("event_id")
        .eq("photo_id", photoId);

      const eventIds = (links ?? []).map((link) => link.event_id);
      if (eventIds.length === 0) {
        return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
      }

      const { data: publishedEvents } = await admin
        .from("memory_events")
        .select("id")
        .in("id", eventIds)
        .eq("status", "published")
        .limit(1);

      if (!publishedEvents?.length) {
        return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
      }
    } else if (user) {
      if (photo.owner_id !== user.id) {
        return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
      }
    }

    const file = await fetchDriveFile(photo.drive_file_id);
    if (!file.ok || !file.base64) {
      return NextResponse.json(
        { ok: false, message: file.message ?? "Drive fetch failed" },
        { status: 502 },
      );
    }

    const bytes = Buffer.from(file.base64, "base64");
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": file.mimeType || photo.mime_type || "application/octet-stream",
        "Cache-Control": "private, max-age=300",
        "Content-Length": String(bytes.length),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Proxy failed" },
      { status: 500 },
    );
  }
}
