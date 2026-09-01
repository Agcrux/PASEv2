"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";

type EventItem = {
  id: number;
  title: string;
  startsAt: string;
  isSchoolWide: boolean;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Calendar — [Part B] */
export default function CalendarPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []));
  }, []);

  // Group events by YYYY-MM-DD (local) for quick day lookups.
  const byDay = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const e of events) {
      const key = dayKey(new Date(e.startsAt));
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = dayKey(new Date());

  // Build a 6-row grid of cells (leading blanks + days).
  const cells: Array<{ day: number; key: string } | null> = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, key: dayKey(new Date(year, month, d)) });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedEvents = selected ? byDay.get(selected) ?? [] : [];

  return (
    <div>
      <PageHeader title="Calendar" subtitle="Your events and school-wide dates." />

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {cursor.toLocaleDateString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
            >
              ← Prev
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                const d = new Date();
                setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
              }}
            >
              Today
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
            >
              Next →
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px border-b border-slate-100 pb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
          {WEEKDAYS.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell) return <div key={i} className="min-h-20" />;
            const dayEvents = byDay.get(cell.key) ?? [];
            const isToday = cell.key === todayKey;
            const isSelected = cell.key === selected;
            return (
              <button
                key={i}
                onClick={() => setSelected(cell.key)}
                className={cn(
                  "min-h-20 rounded-md border p-1.5 text-left align-top transition-colors",
                  isSelected
                    ? "border-brand-400 bg-brand-50"
                    : "border-slate-100 hover:bg-slate-50",
                )}
              >
                <div
                  className={cn(
                    "mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                    isToday
                      ? "bg-brand-600 font-semibold text-white"
                      : "text-slate-600",
                  )}
                >
                  {cell.day}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div
                      key={e.id}
                      className={cn(
                        "truncate rounded px-1 py-0.5 text-[11px]",
                        e.isSchoolWide
                          ? "bg-brand-100 text-brand-700"
                          : "bg-emerald-100 text-emerald-700",
                      )}
                      title={e.title}
                    >
                      {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="px-1 text-[11px] text-slate-400">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {selected && (
        <Card className="mt-6">
          <h3 className="mb-3 font-semibold text-slate-900">
            {formatDate(new Date(selected + "T00:00:00"))}
          </h3>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-slate-500">No events on this day.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {selectedEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="text-slate-700">{e.title}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium",
                      e.isSchoolWide
                        ? "bg-brand-50 text-brand-700"
                        : "bg-emerald-50 text-emerald-700",
                    )}
                  >
                    {e.isSchoolWide ? "School-wide" : "Personal"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}
