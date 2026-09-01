import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route protection — [Part A]
 *
 * TODO(Part A): read the session cookie and:
 *  - redirect unauthenticated users away from /dashboard and /admin → /login
 *  - redirect non-admins away from /admin → /dashboard
 *
 * Kept as a pass-through for now so the scaffold runs. Note: jose-based
 * verification works in middleware (Edge), bcrypt does not — verify the JWT
 * here, do password work only in route handlers.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
