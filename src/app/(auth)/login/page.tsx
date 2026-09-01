import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Student login page — [Part A]
 *
 * TODO(Part A):
 *  - Convert to a client component / server action that posts to /api/auth
 *  - Validate student ID + password, show error states
 *  - On success, createSession() and redirect by role
 */
export default function LoginPage() {
  return (
    <Card>
      <h2 className="mb-1 text-lg font-semibold text-slate-900">Sign in</h2>
      <p className="mb-5 text-sm text-slate-500">
        Enter your student ID and password.
      </p>

      {/* Static markup for now — wiring is Part A frontend work. */}
      <form className="flex flex-col gap-4">
        <Input id="studentId" label="Student ID" placeholder="e.g. S1000" />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
        />
        <Button type="submit" disabled>
          Sign in (TODO Part A)
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
