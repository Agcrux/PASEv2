import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/empty-state";

/** Events — [Part B] */
export default function EventsPage() {
  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Add personal events and see school-wide dates."
      />
      <EmptyState
        part="B"
        description="A form to add personal events plus a list of upcoming events (personal + school-wide from Part A)."
        todos={[
          "Add-event form → POST /api/events (isSchoolWide = false)",
          "List `events` where userId = me OR isSchoolWide = true",
          "Edit / delete personal events only",
        ]}
      />
    </div>
  );
}
