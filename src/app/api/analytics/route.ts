import { NextResponse } from "next/server";
import { and, eq, gte, or } from "drizzle-orm";
import { db } from "@/db";
import { todos, events, users } from "@/db/schema";
import { requireUser } from "@/lib/api";
import { daysUntilGraduation } from "@/lib/utils";

/**
 * Analytics aggregates — [Part B]
 * Returns readiness stats for the current user: task completion, overdue count,
 * days remaining until graduation, and upcoming deadlines bucketed by week.
 */
export async function GET() {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  const now = new Date();

  const [me] = await db
    .select({ gradYear: users.gradYear })
    .from(users)
    .where(eq(users.id, auth.userId))
    .limit(1);

  const myTodos = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, auth.userId));

  const upcomingEvents = await db
    .select()
    .from(events)
    .where(
      and(
        or(eq(events.userId, auth.userId), eq(events.isSchoolWide, true)),
        gte(events.startsAt, now),
      ),
    );

  const completed = myTodos.filter((t) => t.completed).length;
  const open = myTodos.length - completed;
  const overdue = myTodos.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < now,
  ).length;
  const completionRate =
    myTodos.length === 0 ? 0 : Math.round((completed / myTodos.length) * 100);

  // Bucket upcoming deadlines (open todo due dates + event starts) into the
  // next 6 weeks for a bar chart.
  const WEEKS = 6;
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const buckets = Array.from({ length: WEEKS }, (_, i) => ({
    label: i === 0 ? "This week" : `Wk ${i + 1}`,
    count: 0,
  }));

  const addToBucket = (date: Date) => {
    const diff = date.getTime() - now.getTime();
    if (diff < 0) return;
    const week = Math.floor(diff / weekMs);
    if (week < WEEKS) buckets[week].count += 1;
  };

  for (const t of myTodos) {
    if (!t.completed && t.dueDate) addToBucket(new Date(t.dueDate));
  }
  for (const e of upcomingEvents) {
    addToBucket(new Date(e.startsAt));
  }

  return NextResponse.json({
    tasks: { total: myTodos.length, completed, open, overdue, completionRate },
    upcomingEvents: upcomingEvents.length,
    daysRemaining:
      me?.gradYear != null ? daysUntilGraduation(me.gradYear) : null,
    gradYear: me?.gradYear ?? null,
    deadlinesByWeek: buckets,
  });
}
