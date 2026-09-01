"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Admin action — create a school-wide event. This is the one cross-part
 * touchpoint: it inserts into `events` with isSchoolWide = true and fans out a
 * notification to every student (handled server-side in /api/events).
 */
export function CreateEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<
    { type: "ok" | "error"; text: string } | null
  >(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!title.trim() || !startsAt) return;
    setSaving(true);

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        startsAt,
        description: description || null,
        schoolWide: true,
      }),
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMessage({ type: "error", text: data.error ?? "Could not create event." });
      return;
    }

    setTitle("");
    setStartsAt("");
    setDescription("");
    setMessage({
      type: "ok",
      text: "School-wide event created and students notified.",
    });
    router.refresh();
  }

  return (
    <Card>
      <h2 className="mb-1 font-semibold text-slate-900">
        Create a school-wide event
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        Every student sees this on their calendar and gets a notification.
      </p>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <Input
          label="Title"
          placeholder="e.g. FAFSA deadline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="datetime-local"
          label="Date & time"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
        />
        <Input
          label="Notes (optional)"
          placeholder="Details students should know"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {message && (
          <p
            className={
              message.type === "ok"
                ? "rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                : "rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
            }
          >
            {message.text}
          </p>
        )}
        <div>
          <Button type="submit" disabled={saving || !title.trim() || !startsAt}>
            {saving ? "Creating…" : "Create event"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
