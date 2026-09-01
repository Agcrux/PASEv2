import { ReactNode } from "react";

/** Centered card shell for auth screens (Part A). */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            College Readiness Tracker
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
