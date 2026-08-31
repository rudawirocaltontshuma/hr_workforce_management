import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UpcomingEvent } from "@/lib/hr";

import { countdownLabel, formatShortDate } from "../hr/format";
import { StatusBadge } from "../hr/status-badge";

const CATEGORY_TONE: Record<UpcomingEvent["category"], "blue" | "emerald" | "violet" | "amber" | "slate" | "sky"> = {
  Onboarding: "emerald",
  Review: "violet",
  Training: "sky",
  Benefits: "amber",
  Holiday: "slate",
  Company: "blue",
};

export function UpcomingEvents({ events }: { events: UpcomingEvent[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Upcoming Events</CardTitle>
        <CardDescription>Company-wide dates on the calendar</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">Nothing scheduled.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium text-sm">{event.title}</div>
                  <div className="text-muted-foreground text-xs">{formatShortDate(event.date)}</div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={event.category} tone={CATEGORY_TONE[event.category]} />
                  <span className="text-muted-foreground text-xs">{countdownLabel(event.date)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
