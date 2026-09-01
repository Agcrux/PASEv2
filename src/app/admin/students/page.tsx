"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";

type StudentRow = {
  id: number;
  studentId: string;
  fullName: string | null;
  gradYear: number | null;
  createdAt: string;
  openTodos: number;
  totalTodos: number;
};

/** Admin student list/search — [Part A] */
export default function AdminStudentsPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Debounced search against /api/students.
  useEffect(() => {
    const handle = setTimeout(() => {
      setLoading(true);
      fetch(`/api/students?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => {
          setRows(d.students ?? []);
          setLoading(false);
        });
    }, 250);
    return () => clearTimeout(handle);
  }, [q]);

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Browse, search, and manage student accounts."
      />

      <div className="mb-4 max-w-sm">
        <Input
          placeholder="Search by student ID or name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <Card className="overflow-hidden p-0">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Student ID</th>
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Grad year</th>
              <th className="px-5 py-3 font-semibold">Tasks</th>
              <th className="px-5 py-3 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                  No students found.
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">
                    {s.studentId}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {s.fullName ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {s.gradYear ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    <span className="font-medium text-slate-800">
                      {s.openTodos}
                    </span>{" "}
                    open / {s.totalTodos} total
                  </td>
                  <td className="px-5 py-3 text-slate-400">
                    {formatDate(s.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
