import { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { NavItem } from "@/components/side-nav";

const studentNav: NavItem[] = [
  { label: "Home", href: "/dashboard" },
  { label: "Calendar", href: "/dashboard/calendar" },
  { label: "To-dos", href: "/dashboard/todos" },
  { label: "Events", href: "/dashboard/events" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Notifications", href: "/dashboard/notifications" },
];

/**
 * Student app shell — [Part B]
 *
 * TODO(Part A provides): guard — redirect to /login if not authed.
 * TODO(Part B): pass real unread notification count to the bell.
 */
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppShell
      navTitle="Student"
      navItems={studentNav}
      userLabel="Student"
      showNotifications
      unreadCount={0}
    >
      {children}
    </AppShell>
  );
}
