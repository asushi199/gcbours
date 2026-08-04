import { NextResponse } from "next/server";

/** Phase 0 stub — signed image proxy lands in Phase 6. */
export async function GET() {
  return NextResponse.json(
    { ok: false, message: "Signed image API not implemented in Phase 0." },
    { status: 501 },
  );
}
