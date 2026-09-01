import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/empty-state";

/** Calendar — [Part B] */
export default function CalendarPage() {
  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle="Your events and school-wide dates."
      />
      <EmptyState
        part="B"
        description="A month-grid calendar rendering the student's personal events plus school-wide events created by admins (Part A)."
        todos={[
          "Build the month grid (or add a calendar lib)",
          "Fetch `events` where userId = me OR isSchoolWide = true",
          "Click a day to add a personal event",
        ]}
      />
    </div>
  );
}
