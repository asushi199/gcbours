import { NextResponse } from "next/server";

/** Prefer `/api/signed-original?photoId=` for Drive originals. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const photoId = url.searchParams.get("photoId");
  if (!photoId) {
    return NextResponse.json(
      { ok: false, message: "Use /api/signed-original?photoId=..." },
      { status: 400 },
    );
  }
  const target = new URL("/api/signed-original", url.origin);
  target.searchParams.set("photoId", photoId);
  if (url.searchParams.get("preview") === "1") {
    target.searchParams.set("preview", "1");
  }
  return NextResponse.redirect(target, 307);
}
