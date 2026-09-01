import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/empty-state";

/** Notifications — [Part B] */
export default function NotificationsPage() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Deadlines and announcements."
      />
      <EmptyState
        part="B"
        description="A list of notifications (upcoming deadlines, new admin announcements) with read/unread state and an unread badge in the top bar."
        todos={[
          "Fetch `notifications` where userId = me, newest first",
          "Mark read on view → PATCH /api/notifications",
          "Feed unread count to the TopBar notification bell",
        ]}
      />
    </div>
  );
}
