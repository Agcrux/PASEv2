import Link from "next/link";
import { and, asc, eq, gte, sql } from "drizzle-orm";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { db } from "@/db";
import { users, events } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { CreateEventForm } from "./create-event-form";

/** Admin overview — [Part A] */
export default async function AdminOverviewPage() {
  const now = new Date();

  const [{ count: studentCount }] = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(users)
    .where(eq(users.role, "student"));

  const upcomingSchoolWide = await db
    .select()
    .from(events)
    .where(and(eq(events.isSchoolWide, true), gte(events.startsAt, now)))
    .orderBy(asc(events.startsAt))
    .limit(5);

  const stats = [
    { label: "Total students", value: studentCount },
    { label: "Upcoming school-wide events", value: upcomingSchoolWide.length },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Overview"
        subtitle="School-wide readiness at a glance."
      />

      <div className="grid grid-cols-2 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="text-3xl font-semibold text-slate-900">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CreateEventForm />

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              Upcoming school-wide events
            </h2>
            <Link
              href="/admin/students"
              className="text-sm text-brand-600 hover:underline"
            >
              View students
            </Link>
          </div>
          {upcomingSchoolWide.length === 0 ? (
            <p className="text-sm text-slate-500">
              None scheduled yet. Create one on the left.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcomingSchoolWide.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between py-2.5 text-sm"
                >
                  <span className="text-slate-700">{e.title}</span>
                  <span className="text-xs text-slate-400">
                    {formatDate(e.startsAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
