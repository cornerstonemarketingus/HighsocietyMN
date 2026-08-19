import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import {
  AGE_GATE_COOKIE_NAME,
  AGE_GATE_COOKIE_VALUE,
  isAgeGateProtectedPath,
} from "@/lib/age-gate";

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;

  const ageVerified = req.cookies.get(AGE_GATE_COOKIE_NAME)?.value === AGE_GATE_COOKIE_VALUE;
  const ageProtectedApi =
    pathname === "/api/spin" ||
    pathname === "/api/points" ||
    pathname === "/api/minigame" ||
    pathname === "/api/chat";

  if ((isAgeGateProtectedPath(pathname) || ageProtectedApi) && !ageVerified) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Age verification required" }, { status: 403 });
    }

    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("ageGate", "1");
    url.searchParams.set("returnTo", `${pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(url);
  }

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    if (!req.auth?.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (req.auth.user.role !== "ADMIN" && req.auth.user.role !== "STAFF") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protected user routes
  if (pathname.startsWith("/checkout") || pathname.startsWith("/orders")) {
    if (!req.auth?.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/products/:path*",
    "/drops/:path*",
    "/spin/:path*",
    "/blog/:path*",
    "/forum/:path*",
    "/cart/:path*",
    "/api/spin",
    "/api/points",
    "/api/minigame",
    "/api/chat",
  ],
};
