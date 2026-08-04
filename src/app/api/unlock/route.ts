import { NextResponse } from "next/server";

/** Phase 0 stub — real unlock lands in Phase 6. */
export async function POST() {
  return NextResponse.json(
    { ok: false, message: "Unlock API not implemented in Phase 0." },
    { status: 501 },
  );
}
