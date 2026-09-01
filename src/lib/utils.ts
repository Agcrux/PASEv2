/**
 * Small shared helpers used across both parts.
 */

/** Join classNames, dropping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Format a Date as e.g. "Sep 1, 2026". */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Whole days from now until a graduation year (uses June 1 of that year). */
export function daysUntilGraduation(gradYear: number): number {
  const target = new Date(gradYear, 5, 1); // June 1
  const diff = target.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
