"use client";

import { FormEvent, useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  dueDate: string | null;
};

/** To-do list — [Part B] */
export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data.todos ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function addTodo(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dueDate: dueDate || null }),
    });
    setTitle("");
    setDueDate("");
    setSaving(false);
    load();
  }

  async function toggle(todo: Todo) {
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t)),
    );
    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: todo.id, completed: !todo.completed }),
    });
    load();
  }

  async function remove(id: number) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/todos?id=${id}`, { method: "DELETE" });
  }

  const open = todos.filter((t) => !t.completed);
  const done = todos.filter((t) => t.completed);
  const now = Date.now();

  return (
    <div>
      <PageHeader title="To-dos" subtitle="Track your readiness tasks." />

      <Card className="mb-6">
        <form
          onSubmit={addTodo}
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <Input
              label="New task"
              placeholder="e.g. Finish FAFSA application"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <Input
              type="date"
              label="Due date (optional)"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={saving || !title.trim()}>
            {saving ? "Adding…" : "Add task"}
          </Button>
        </form>
      </Card>

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
              Open ({open.length})
            </h2>
            {open.length === 0 ? (
              <Card>
                <p className="text-sm text-slate-500">
                  No open tasks. Add one above to get started.
                </p>
              </Card>
            ) : (
              <Card className="divide-y divide-slate-100 p-0">
                {open.map((t) => {
                  const overdue =
                    t.dueDate && new Date(t.dueDate).getTime() < now;
                  return (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 px-5 py-3"
                    >
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggle(t)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="flex-1 text-sm text-slate-800">
                        {t.title}
                      </span>
                      {t.dueDate && (
                        <span
                          className={
                            overdue
                              ? "text-xs font-medium text-red-600"
                              : "text-xs text-slate-400"
                          }
                        >
                          {overdue ? "Overdue · " : ""}
                          {formatDate(t.dueDate)}
                        </span>
                      )}
                      <button
                        onClick={() => remove(t.id)}
                        className="text-xs text-slate-400 hover:text-red-600"
                        aria-label="Delete task"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </Card>
            )}
          </section>

          {done.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Completed ({done.length})
              </h2>
              <Card className="divide-y divide-slate-100 p-0">
                {done.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggle(t)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="flex-1 text-sm text-slate-400 line-through">
                      {t.title}
                    </span>
                    <button
                      onClick={() => remove(t.id)}
                      className="text-xs text-slate-400 hover:text-red-600"
                      aria-label="Delete task"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </Card>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
