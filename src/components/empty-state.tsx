import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  /** Which workstream owns this screen — shown as a badge. */
  part: "A" | "B" | "Shared";
  /** What this screen will eventually do. */
  description: string;
  /** Optional bulleted list of concrete TODOs for the owner. */
  todos?: string[];
}

const partColors: Record<EmptyStateProps["part"], string> = {
  A: "bg-violet-100 text-violet-700",
  B: "bg-emerald-100 text-emerald-700",
  Shared: "bg-slate-200 text-slate-700",
};

/**
 * Placeholder shown inside every scaffolded page. Replacing this with the real
 * UI is the frontend work for each Part.
 */
export function EmptyState({ part, description, todos }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${partColors[part]}`}
        >
          {part === "Shared" ? "Shared" : `Part ${part}`}
        </span>
        <span className="text-xs uppercase tracking-wide text-slate-400">
          Placeholder
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600">{description}</p>
      {todos && todos.length > 0 && (
        <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-slate-500">
          {todos.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}
