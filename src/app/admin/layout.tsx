import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { NavItem } from "@/components/side-nav";
import { getCurrentUser } from "@/lib/session";

const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin" },
  { label: "Students", href: "/admin/students" },
];

/** Admin portal shell — [Part A], guarded to admins only. */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return (
    <AppShell navTitle="Admin" navItems={adminNav} userLabel={user.studentId}>
      {children}
    </AppShell>
  );
}
