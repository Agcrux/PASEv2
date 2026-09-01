import Link from "next/link";
import { and, asc, eq, gte, or } from "drizzle-orm";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/db";
import { todos, events, notifications, users } from "@/db/schema";
import { daysUntilGraduation, formatDate } from "@/lib/utils";

/** Student dashboard home — [Part B] */
export default async function DashboardHomePage() {
  const user = (await getCurrentUser())!; // layout guarantees a session
  const now = new Date();

  const [me] = await db
    .select({ gradYear: users.gradYear })
    .from(users)
    .where(eq(users.id, user.userId))
    .limit(1);

  const openTodos = await db
    .select()
    .from(todos)
    .where(and(eq(todos.userId, user.userId), eq(todos.completed, false)))
    .orderBy(asc(todos.dueDate), asc(todos.createdAt));

  const upcomingEvents = await db
    .select()
    .from(events)
    .where(
      and(
        or(eq(events.userId, user.userId), eq(events.isSchoolWide, true)),
        gte(events.startsAt, now),
      ),
    )
    .orderBy(asc(events.startsAt))
    .limit(3);

  const unread = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(and(eq(notifications.userId, user.userId), eq(notifications.read, false)));

  const daysRemaining =
    me?.gradYear != null ? daysUntilGraduation(me.gradYear) : null;

  const stats = [
    {
      label: "Days to graduation",
      value: daysRemaining != null ? daysRemaining.toLocaleString() : "—",
      href: "/dashboard/analytics",
    },
    { label: "Open to-dos", value: openTodos.length, href: "/dashboard/todos" },
    {
      label: "Upcoming events",
      value: upcomingEvents.length,
      href: "/dashboard/calendar",
    },
    {
      label: "Unread alerts",
      value: unread.length,
      href: "/dashboard/notifications",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your college readiness at a glance."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-shadow hover:shadow-md">
              <div className="text-3xl font-semibold text-slate-900">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-slate-500">{s.label}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Open to-dos</h2>
            <Link
              href="/dashboard/todos"
              className="text-sm text-brand-600 hover:underline"
            >
              View all
            </Link>
          </div>
          {openTodos.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nothing open — you&apos;re all caught up. 🎉
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {openTodos.slice(0, 5).map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between py-2.5 text-sm"
                >
                  <span className="text-slate-700">{t.title}</span>
                  {t.dueDate && (
                    <span className="text-xs text-slate-400">
                      {formatDate(t.dueDate)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Next events</h2>
            <Link
              href="/dashboard/calendar"
              className="text-sm text-brand-600 hover:underline"
            >
              Calendar
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming events.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="py-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">{e.title}</span>
                    <span className="text-xs text-slate-400">
                      {formatDate(e.startsAt)}
                    </span>
                  </div>
                  {e.isSchoolWide && (
                    <span className="mt-1 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                      School-wide
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
