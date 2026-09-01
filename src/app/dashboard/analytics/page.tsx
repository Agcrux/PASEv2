"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

type Analytics = {
  tasks: {
    total: number;
    completed: number;
    open: number;
    overdue: number;
    completionRate: number;
  };
  upcomingEvents: number;
  daysRemaining: number | null;
  gradYear: number | null;
  deadlinesByWeek: { label: string; count: number }[];
};

/** Analytics — [Part B] */
export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div>
        <PageHeader
          title="Analytics"
          subtitle="Your readiness progress over time."
        />
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Days to graduation",
      value: data.daysRemaining != null ? data.daysRemaining.toLocaleString() : "—",
      sub: data.gradYear ? `Class of ${data.gradYear}` : "Set your grad year",
    },
    {
      label: "Task completion",
      value: `${data.tasks.completionRate}%`,
      sub: `${data.tasks.completed} of ${data.tasks.total} done`,
    },
    {
      label: "Open tasks",
      value: data.tasks.open,
      sub: data.tasks.overdue > 0 ? `${data.tasks.overdue} overdue` : "None overdue",
    },
    {
      label: "Upcoming events",
      value: data.upcomingEvents,
      sub: "Personal + school-wide",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Your readiness progress over time."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="text-3xl font-semibold text-slate-900">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{s.label}</div>
            <div className="mt-2 text-xs text-slate-400">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold text-slate-900">Task breakdown</h2>
          <Donut
            completed={data.tasks.completed}
            open={data.tasks.open}
          />
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-slate-900">
            Upcoming deadlines
          </h2>
          <BarChart data={data.deadlinesByWeek} />
        </Card>
      </div>
    </div>
  );
}

function Donut({ completed, open }: { completed: number; open: number }) {
  const total = completed + open;
  const pct = total === 0 ? 0 : completed / total;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;

  return (
    <div className="flex items-center gap-6">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="16"
        />
        {total > 0 && (
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="#2563eb"
            strokeWidth="16"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={circumference / 4}
            strokeLinecap="round"
            transform="rotate(-90 75 75)"
          />
        )}
        <text
          x="75"
          y="75"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-900"
          fontSize="24"
          fontWeight="600"
        >
          {total === 0 ? "—" : `${Math.round(pct * 100)}%`}
        </text>
      </svg>
      <div className="space-y-2 text-sm">
        <LegendRow color="#2563eb" label="Completed" value={completed} />
        <LegendRow color="#e2e8f0" label="Open" value={open} />
        {total === 0 && (
          <p className="text-xs text-slate-400">Add some to-dos to see progress.</p>
        )}
      </div>
    </div>
  );
}

function LegendRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-3 w-3 rounded-sm"
        style={{ backgroundColor: color }}
      />
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function BarChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const hasAny = data.some((d) => d.count > 0);

  return (
    <div>
      <div className="flex h-40 items-end gap-3">
        {data.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t bg-brand-500"
                style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }}
                title={`${d.count} due`}
              />
            </div>
            <span className="text-xs font-medium text-slate-700">{d.count}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {data.map((d) => (
          <div
            key={d.label}
            className="flex-1 text-center text-[11px] text-slate-400"
          >
            {d.label}
          </div>
        ))}
      </div>
      {!hasAny && (
        <p className="mt-3 text-xs text-slate-400">
          No deadlines in the next 6 weeks.
        </p>
      )}
    </div>
  );
}
