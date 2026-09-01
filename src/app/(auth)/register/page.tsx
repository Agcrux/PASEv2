import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Student registration page — [Part A]
 *
 * TODO(Part A):
 *  - Post to /api/auth (register) with studentId, password, gradYear
 *  - hashPassword() on the server, insert into `users`
 *  - createSession() and redirect to /dashboard
 */
export default function RegisterPage() {
  return (
    <Card>
      <h2 className="mb-1 text-lg font-semibold text-slate-900">
        Create your account
      </h2>
      <p className="mb-5 text-sm text-slate-500">
        Register with your student ID.
      </p>

      <form className="flex flex-col gap-4">
        <Input id="studentId" label="Student ID" placeholder="e.g. S1000" />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
        />
        <Input
          id="gradYear"
          type="number"
          label="Expected graduation year"
          placeholder="e.g. 2027"
        />
        <Button type="submit" disabled>
          Create account (TODO Part A)
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
