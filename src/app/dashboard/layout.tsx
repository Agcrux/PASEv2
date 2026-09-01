import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { AppShell } from "@/components/app-shell";
import { NavItem } from "@/components/side-nav";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/db";
import { notifications } from "@/db/schema";

const studentNav: NavItem[] = [
  { label: "Home", href: "/dashboard" },
  { label: "Calendar", href: "/dashboard/calendar" },
  { label: "To-dos", href: "/dashboard/todos" },
  { label: "Events", href: "/dashboard/events" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Notifications", href: "/dashboard/notifications" },
];

/** Student app shell — [Part B], guarded by Part A's session. */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const unread = await db
    .select({ id: notifications.id })
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, user.userId),
        eq(notifications.read, false),
      ),
    );

  return (
    <AppShell
      navTitle="Student"
      navItems={studentNav}
      userLabel={user.studentId}
      showNotifications
      unreadCount={unread.length}
    >
      {children}
    </AppShell>
  );
}
