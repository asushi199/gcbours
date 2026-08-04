import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  PARTNER_COOKIE_NAME,
  verifyPartnerSessionToken,
} from "@/lib/security/partner-session";

function isExperiencePath(pathname: string) {
  if (pathname === "/unlock") return false;
  const prefixes = ["/", "/story", "/timeline", "/letter", "/memory", "/today"];
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let userId: string | null = null;

  if (url && anonKey) {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  }

  const pathname = request.nextUrl.pathname;
  const isStudioRoute = pathname.startsWith("/studio");
  const isLogin = pathname.startsWith("/auth/login");
  const isAuthRoute =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/callback");

  if (isStudioRoute && !userId) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/auth/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLogin && userId) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/studio";
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute) {
    return supabaseResponse;
  }

  if (isExperiencePath(pathname)) {
    const partnerToken = request.cookies.get(PARTNER_COOKIE_NAME)?.value;
    const partnerOk = partnerToken
      ? (await verifyPartnerSessionToken(partnerToken)).ok
      : false;
    if (!partnerOk && !userId) {
      const unlockUrl = request.nextUrl.clone();
      unlockUrl.pathname = "/unlock";
      unlockUrl.search = "";
      const redirect = NextResponse.redirect(unlockUrl);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirect.cookies.set(cookie.name, cookie.value);
      });
      return redirect;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/studio/:path*",
    "/auth/login",
    "/auth/callback",
    "/",
    "/story",
    "/story/:path*",
    "/timeline",
    "/timeline/:path*",
    "/letter",
    "/letter/:path*",
    "/memory",
    "/memory/:path*",
    "/today",
    "/today/:path*",
    "/unlock",
  ],
};
