import { ReactNode } from "react";
import { SideNav, NavItem } from "@/components/side-nav";
import { TopBar } from "@/components/top-bar";

interface AppShellProps {
  navTitle: string;
  navItems: NavItem[];
  children: ReactNode;
  userLabel?: string;
  showNotifications?: boolean;
  unreadCount?: number;
}

/**
 * App chrome shared by the student dashboard and admin portal:
 * sidebar + top bar + scrollable content area.
 */
export function AppShell({
  navTitle,
  navItems,
  children,
  userLabel,
  showNotifications,
  unreadCount,
}: AppShellProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <SideNav title={navTitle} items={navItems} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          userLabel={userLabel}
          showNotifications={showNotifications}
          unreadCount={unreadCount}
        />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
