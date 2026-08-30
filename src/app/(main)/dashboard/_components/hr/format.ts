import { NOW } from "@/lib/hr";

export function formatDate(dateStr: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString(
    "en-US",
    opts ?? { month: "short", day: "numeric", year: "numeric" },
  );
}

export function formatShortDate(dateStr: string): string {
  return formatDate(dateStr, { month: "short", day: "numeric" });
}

/** Relative-time label computed against the fixed demo "now" so server and client always agree. */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMinutes = Math.round((NOW.getTime() - date.getTime()) / 60000);
  if (diffMinutes < 60) return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.round(diffMonths / 12)}y ago`;
}

export function countdownLabel(dateStr: string): string {
  const diffDays = Math.round((new Date(dateStr).getTime() - NOW.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `In ${diffDays} days`;
  return formatShortDate(dateStr);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
