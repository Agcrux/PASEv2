import { NotificationBell } from "@/components/notification-bell";

interface TopBarProps {
  /** Shown on the right, e.g. the student's name or ID. */
  userLabel?: string;
  /** Whether to show the notification bell (student app only). */
  showNotifications?: boolean;
  unreadCount?: number;
}

export function TopBar({
  userLabel,
  showNotifications = false,
  unreadCount = 0,
}: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="font-semibold text-slate-900">College Readiness Tracker</div>
      <div className="flex items-center gap-3">
        {showNotifications && <NotificationBell count={unreadCount} />}
        {userLabel && (
          <span className="text-sm text-slate-600">{userLabel}</span>
        )}
        {/* TODO(Part A): add sign-out button wired to session.destroySession */}
      </div>
    </header>
  );
}
