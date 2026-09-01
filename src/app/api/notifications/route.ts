import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireUser } from "@/lib/api";

/**
 * Notifications — [Part B]
 *   GET                        -> current user's notifications, newest first
 *   PATCH { id } | { all }     -> mark one / all as read
 */

export async function GET() {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, auth.userId))
    .orderBy(desc(notifications.createdAt));

  const unread = rows.filter((n) => !n.read).length;
  return NextResponse.json({ notifications: rows, unread });
}

export async function PATCH(request: Request) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));

  if (body.all === true) {
    await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, auth.userId));
    return NextResponse.json({ ok: true });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const [updated] = await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, auth.userId)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ notification: updated });
}
