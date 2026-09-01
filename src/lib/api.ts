import { NextResponse } from "next/server";
import { getCurrentUser, type SessionPayload } from "@/lib/session";

/**
 * Small helpers for route handlers (shared). Each returns either the session
 * or a ready-to-return error Response, so handlers can do:
 *
 *   const auth = await requireUser();
 *   if (auth instanceof NextResponse) return auth;
 *   // ...auth.userId is available
 */

export async function requireUser(): Promise<SessionPayload | NextResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return user;
}

export async function requireAdmin(): Promise<SessionPayload | NextResponse> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return user;
}
