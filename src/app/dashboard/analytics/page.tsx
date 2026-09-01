import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/empty-state";

/** Analytics — [Part B] */
export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Your readiness progress over time."
      />
      <EmptyState
        part="B"
        description="Charts summarizing readiness: tasks completed vs. open, upcoming deadlines, and days remaining until graduation."
        todos={[
          "Aggregate `todos` (completed vs. open) for the current user",
          "Count upcoming deadlines from `events`/`todos`",
          "Render charts (e.g. Recharts) — add the dependency in Part B",
        ]}
      />
    </div>
  );
}
