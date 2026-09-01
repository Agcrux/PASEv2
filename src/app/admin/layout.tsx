import { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { NavItem } from "@/components/side-nav";

const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Students", href: "/admin/students" },
];

/**
 * Admin portal shell — [Part A]
 *
 * TODO(Part A): guard this layout — redirect to /login if not authed,
 * and to /dashboard if the user's role !== "admin" (use getCurrentUser()).
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell navTitle="Admin" navItems={adminNav} userLabel="Admin">
      {children}
    </AppShell>
  );
}
