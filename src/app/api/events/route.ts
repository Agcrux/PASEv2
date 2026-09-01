import { NextResponse } from "next/server";
import { and, asc, eq, or } from "drizzle-orm";
import { db } from "@/db";
import { events, notifications, users } from "@/db/schema";
import { requireUser } from "@/lib/api";
import { formatDate } from "@/lib/utils";

/**
 * Events — [Part B], with the one Part A touchpoint: admins create school-wide
 * events (isSchoolWide = true) which fan out a notification to every student.
 *
 *   GET                                              -> personal + school-wide
 *   POST   { title, description?, startsAt, endsAt?, schoolWide? } -> create
 *   DELETE ?id=<id>                                  -> delete (own personal only)
 */

export async function GET() {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const rows = await db
    .select()
    .from(events)
    .where(or(eq(events.userId, auth.userId), eq(events.isSchoolWide, true)))
    .orderBy(asc(events.startsAt));

  return NextResponse.json({ events: rows });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  const description = body.description ? String(body.description).trim() : null;
  const startsAt = body.startsAt ? new Date(body.startsAt) : null;
  const endsAt = body.endsAt ? new Date(body.endsAt) : null;
  const schoolWide = Boolean(body.schoolWide);

  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!startsAt || Number.isNaN(startsAt.getTime())) {
    return NextResponse.json({ error: "A valid start date is required." }, { status: 400 });
  }
  if (endsAt && Number.isNaN(endsAt.getTime())) {
    return NextResponse.json({ error: "Invalid end date." }, { status: 400 });
  }

  // Only admins may create school-wide events.
  if (schoolWide && auth.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [created] = await db
    .insert(events)
    .values({
      userId: schoolWide ? null : auth.userId,
      title,
      description,
      startsAt,
      endsAt,
      isSchoolWide: schoolWide,
      createdBy: auth.userId,
    })
    .returning();

  // Fan out a notification to all students for a new school-wide event.
  if (schoolWide) {
    const students = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "student"));

    if (students.length > 0) {
      await db.insert(notifications).values(
        students.map((s) => ({
          userId: s.id,
          message: `New school-wide event: ${title} on ${formatDate(startsAt)}.`,
        })),
      );
    }
  }

  return NextResponse.json({ event: created }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  // Admins may delete any event they created (incl. school-wide); students may
  // only delete their own personal events.
  const ownership =
    auth.role === "admin"
      ? or(eq(events.userId, auth.userId), eq(events.createdBy, auth.userId))
      : and(eq(events.userId, auth.userId), eq(events.isSchoolWide, false));

  const [deleted] = await db
    .delete(events)
    .where(and(eq(events.id, id), ownership))
    .returning({ id: events.id });

  if (!deleted) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
