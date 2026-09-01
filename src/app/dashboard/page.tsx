import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/empty-state";

/** Student dashboard home — [Part B] */
export default function DashboardHomePage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your college readiness at a glance."
      />
      <EmptyState
        part="B"
        description="Summary widgets: days until graduation, open to-dos, next events, and unread notifications."
        todos={[
          "Read current user via getCurrentUser()",
          "Show daysUntilGraduation(user.gradYear)",
          "Surface top 3 upcoming events and open to-dos",
        ]}
      />
    </div>
  );
}
