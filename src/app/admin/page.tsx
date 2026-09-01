import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/empty-state";

/** Admin overview — [Part A] */
export default function AdminOverviewPage() {
  return (
    <div>
      <PageHeader
        title="Admin Overview"
        subtitle="School-wide readiness at a glance."
      />
      <EmptyState
        part="A"
        description="Summary widgets for admins: total students, upcoming school-wide events, and aggregate readiness stats."
        todos={[
          "Query counts from `users` and `events`",
          "Add a 'Create school-wide event' action (feeds Part B calendar/notifications)",
          "Link out to the Students page",
        ]}
      />
    </div>
  );
}
