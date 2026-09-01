"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type EventItem = {
  id: number;
  userId: number | null;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string | null;
  isSchoolWide: boolean;
};

/** Events — [Part B] */
export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/events");
    const data = await res.json();
    setEvents(data.events ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addEvent(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !startsAt) return;
    setSaving(true);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, startsAt, description: description || null }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not add event.");
      return;
    }
    setTitle("");
    setStartsAt("");
    setDescription("");
    load();
  }

  async function remove(id: number) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    await fetch(`/api/events?id=${id}`, { method: "DELETE" });
  }

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.startsAt).getTime() >= now);
  const past = events.filter((e) => new Date(e.startsAt).getTime() < now);

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Add personal events and see school-wide dates."
      />

      <Card className="mb-6">
        <form onSubmit={addEvent} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                label="Event title"
                placeholder="e.g. Campus tour at State U"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="sm:w-56">
              <Input
                type="datetime-local"
                label="Starts"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            </div>
          </div>
          <Input
            label="Notes (optional)"
            placeholder="Details, location, links…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <div>
            <Button type="submit" disabled={saving || !title.trim() || !startsAt}>
              {saving ? "Adding…" : "Add event"}
            </Button>
          </div>
        </form>
      </Card>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="space-y-6">
          <EventSection
            heading={`Upcoming (${upcoming.length})`}
            events={upcoming}
            onDelete={remove}
            emptyText="No upcoming events yet."
          />
          {past.length > 0 && (
            <EventSection
              heading={`Past (${past.length})`}
              events={past}
              onDelete={remove}
              muted
            />
          )}
        </div>
      )}
    </div>
  );
}

function EventSection({
  heading,
  events,
  onDelete,
  emptyText,
  muted,
}: {
  heading: string;
  events: EventItem[];
  onDelete: (id: number) => void;
  emptyText?: string;
  muted?: boolean;
}) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
        {heading}
      </h2>
      {events.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">{emptyText}</p>
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100 p-0">
          {events.map((e) => (
            <div key={e.id} className="flex items-start gap-3 px-5 py-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      muted
                        ? "text-sm text-slate-400"
                        : "text-sm font-medium text-slate-800"
                    }
                  >
                    {e.title}
                  </span>
                  {e.isSchoolWide && (
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                      School-wide
                    </span>
                  )}
                </div>
                {e.description && (
                  <p className="mt-0.5 text-xs text-slate-500">{e.description}</p>
                )}
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatDate(e.startsAt)}
                </p>
              </div>
              {!e.isSchoolWide && (
                <button
                  onClick={() => onDelete(e.id)}
                  className="text-xs text-slate-400 hover:text-red-600"
                  aria-label="Delete event"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </Card>
      )}
    </section>
  );
}
