"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/** Student login page — [Part A] */
export default function LoginPage() {
  // useSearchParams (below) needs a Suspense boundary for static prerender.
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const studentId = String(form.get("studentId") ?? "").trim();
    const password = String(form.get("password") ?? "");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", studentId, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Sign in failed.");
        setLoading(false);
        return;
      }

      const next = searchParams.get("next");
      const fallback = data.role === "admin" ? "/admin" : "/dashboard";
      router.push(next && next.startsWith("/") ? next : fallback);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="mb-1 text-lg font-semibold text-slate-900">Sign in</h2>
      <p className="mb-5 text-sm text-slate-500">
        Enter your student ID and password.
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          id="studentId"
          name="studentId"
          label="Student ID"
          placeholder="e.g. S1000"
          autoComplete="username"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        No account?{" "}
        <Link href="/register" className="text-brand-600 hover:underline">
          Register
        </Link>
      </p>
    </Card>
  );
}
