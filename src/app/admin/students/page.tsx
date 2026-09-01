import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/empty-state";

/** Admin student list/search — [Part A] */
export default function AdminStudentsPage() {
  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Browse, search, and manage student accounts."
      />
      <EmptyState
        part="A"
        description="A searchable table of students showing ID, name, and expected graduation year, with a way to view an individual student's readiness data."
        todos={[
          "Fetch students from `users` where role = 'student'",
          "Add search/filter by student ID or grad year",
          "Row action → view a student's todos/events/progress",
        ]}
      />
    </div>
  );
}
