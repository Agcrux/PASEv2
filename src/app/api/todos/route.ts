import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { requireUser } from "@/lib/api";

/**
 * To-dos — [Part B]
 *   GET                                 -> current user's todos
 *   POST   { title, dueDate? }          -> create
 *   PATCH  { id, completed }            -> toggle complete
 *   DELETE ?id=<id>                     -> delete
 */

export async function GET() {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const rows = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, auth.userId))
    .orderBy(asc(todos.completed), asc(todos.dueDate), asc(todos.createdAt));

  return NextResponse.json({ todos: rows });
}

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  const dueDate = body.dueDate ? new Date(body.dueDate) : null;
  if (dueDate && Number.isNaN(dueDate.getTime())) {
    return NextResponse.json({ error: "Invalid due date." }, { status: 400 });
  }

  const [created] = await db
    .insert(todos)
    .values({ userId: auth.userId, title, dueDate })
    .returning();

  return NextResponse.json({ todo: created }, { status: 201 });
}

export async function PATCH(request: Request) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const id = Number(body.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const [updated] = await db
    .update(todos)
    .set({ completed: Boolean(body.completed) })
    .where(and(eq(todos.id, id), eq(todos.userId, auth.userId)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ todo: updated });
}

export async function DELETE(request: Request) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const [deleted] = await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, auth.userId)))
    .returning({ id: todos.id });

  if (!deleted) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
