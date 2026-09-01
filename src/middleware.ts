import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Route protection — [Part A]
 *
 * Runs on the Edge, so it uses `jose` (not bcrypt) to verify the session JWT.
 *  - Unauthenticated users hitting /dashboard or /admin are sent to /login.
 *  - Non-admins hitting /admin are sent to /dashboard.
 *
 * Keep COOKIE_NAME / secret in sync with src/lib/session.ts.
 */
const COOKIE_NAME = "crt_session";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "dev-insecure-secret-change-me",
);

type Payload = { userId: number; studentId: string; role: "student" | "admin" };

async function readSession(request: NextRequest): Promise<Payload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as Payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSession(request);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    // Preserve where they were headed so we can bounce back after login.
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && session.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
