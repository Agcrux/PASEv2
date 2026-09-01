import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/empty-state";

/** To-do list — [Part B] */
export default function TodosPage() {
  return (
    <div>
      <PageHeader
        title="To-dos"
        subtitle="Track your readiness tasks."
      />
      <EmptyState
        part="B"
        description="A list of readiness tasks the student can add, complete, and delete, each with an optional due date."
        todos={[
          "Fetch `todos` where userId = me",
          "Add / toggle complete / delete (POST/PATCH/DELETE /api/todos)",
          "Sort by due date, show completed separately",
        ]}
      />
    </div>
  );
}
