import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatusTone = "emerald" | "amber" | "sky" | "rose" | "slate" | "violet" | "orange" | "blue";

const TONE_CLASSES: Record<StatusTone, string> = {
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  sky: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  rose: "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  slate: "border-border bg-muted/60 text-muted-foreground",
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-400",
  orange: "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400",
  blue: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400",
};

const DOT_CLASSES: Record<StatusTone, string> = {
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  rose: "bg-rose-500",
  slate: "bg-muted-foreground",
  violet: "bg-violet-500",
  orange: "bg-orange-500",
  blue: "bg-blue-500",
};

/** Central status -> tone map so every table, badge and chip in the app agrees on the same colors. */
const STATUS_TONE_MAP: Record<string, StatusTone> = {
  Active: "emerald",
  Approved: "emerald",
  Completed: "emerald",
  Present: "emerald",
  Open: "emerald",
  Hired: "emerald",
  Exceeds: "emerald",
  Exceptional: "emerald",
  Passed: "emerald",
  Enrolled: "sky",
  Remote: "sky",
  Screening: "sky",
  Scheduled: "sky",
  "In Progress": "sky",
  Interview: "violet",
  Assessment: "violet",
  Offer: "violet",
  Applied: "blue",
  Meets: "blue",
  Upcoming: "blue",
  Pending: "amber",
  "Pending Signature": "amber",
  "On Leave": "amber",
  Late: "amber",
  Probation: "amber",
  "At Risk": "amber",
  "On Hold": "amber",
  "Hiring Freeze": "orange",
  Restructuring: "orange",
  Overdue: "orange",
  Below: "orange",
  Rejected: "rose",
  Terminated: "rose",
  Absent: "rose",
  Expired: "rose",
  Failed: "rose",
  "Needs Improvement": "rose",
  Cancelled: "slate",
  Withdrawn: "slate",
  Closed: "slate",
  "Not Started": "slate",
  Archived: "slate",
};

export function toneForStatus(status: string): StatusTone {
  return STATUS_TONE_MAP[status] ?? "slate";
}

export function StatusBadge({
  status,
  tone,
  className,
  label,
}: {
  status: string;
  tone?: StatusTone;
  className?: string;
  label?: string;
}) {
  const resolvedTone = tone ?? toneForStatus(status);

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 border px-2 py-1 font-medium", TONE_CLASSES[resolvedTone], className)}
    >
      <span className={cn("size-1.5 rounded-full", DOT_CLASSES[resolvedTone])} />
      {label ?? status}
    </Badge>
  );
}
