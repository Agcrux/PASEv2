"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type Notification = {
  id: number;
  message: string;
  read: boolean;
  createdAt: string;
};

/** Notifications — [Part B] */
export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/notifications");
    const data = await res.json();
    setItems(data.notifications ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function markOne(id: number) {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh(); // update the top-bar unread badge
  }

  async function markAll() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    router.refresh();
  }

  const unread = items.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Notifications"
          subtitle="Deadlines and announcements."
        />
        {unread > 0 && (
          <Button variant="secondary" onClick={markAll}>
            Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : items.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">You have no notifications.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100 p-0">
          {items.map((n) => (
            <div
              key={n.id}
              className={
                n.read
                  ? "flex items-start gap-3 px-5 py-4"
                  : "flex items-start gap-3 bg-brand-50/40 px-5 py-4"
              }
            >
              <span
                className={
                  n.read
                    ? "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-transparent"
                    : "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500"
                }
                aria-hidden
              />
              <div className="flex-1">
                <p
                  className={
                    n.read
                      ? "text-sm text-slate-500"
                      : "text-sm font-medium text-slate-800"
                  }
                >
                  {n.message}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {formatDate(n.createdAt)}
                </p>
              </div>
              {!n.read && (
                <button
                  onClick={() => markOne(n.id)}
                  className="text-xs text-brand-600 hover:underline"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
