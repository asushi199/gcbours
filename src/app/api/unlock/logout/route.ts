import { NextResponse } from "next/server";
import { PARTNER_COOKIE_NAME, partnerCookieOptions } from "@/lib/security/partner-session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(PARTNER_COOKIE_NAME, "", {
    ...partnerCookieOptions(0),
    maxAge: 0,
  });
  return response;
}
