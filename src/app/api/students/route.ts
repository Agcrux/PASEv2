import { NextResponse } from "next/server";
import { and, eq, ilike, or, sql, desc } from "drizzle-orm";
import { db } from "@/db";
import { users, todos } from "@/db/schema";
import { requireAdmin } from "@/lib/api";

/**
 * Admin student management — [Part A]
 *   GET /api/students?q=<search>   -> list students (admin-only), optional
 *   search on student ID or full name, with a quick task-count summary.
 */
export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const q = new URL(request.url).searchParams.get("q")?.trim();

  const filters = [eq(users.role, "student")];
  if (q) {
    const like = `%${q}%`;
    filters.push(or(ilike(users.studentId, like), ilike(users.fullName, like))!);
  }

  const rows = await db
    .select({
      id: users.id,
      studentId: users.studentId,
      fullName: users.fullName,
      gradYear: users.gradYear,
      createdAt: users.createdAt,
      openTodos: sql<number>`count(*) filter (where ${todos.completed} = false)`.mapWith(
        Number,
      ),
      totalTodos: sql<number>`count(${todos.id})`.mapWith(Number),
    })
    .from(users)
    .leftJoin(todos, eq(todos.userId, users.id))
    .where(and(...filters))
    .groupBy(users.id)
    .orderBy(desc(users.createdAt));

  return NextResponse.json({ students: rows });
}
