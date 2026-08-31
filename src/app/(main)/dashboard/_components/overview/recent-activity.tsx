import Link from "next/link";

import { Briefcase, CalendarClock, FileText, GraduationCap, type LucideIcon, TrendingUp, UserPlus } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem } from "@/lib/hr";

import { timeAgo } from "../hr/format";

const ICONS: Record<ActivityItem["type"], LucideIcon> = {
  hire: UserPlus,
  leave: CalendarClock,
  review: TrendingUp,
  position: Briefcase,
  document: FileText,
  training: GraduationCap,
  promotion: TrendingUp,
};

const HREF: Record<ActivityItem["type"], string> = {
  hire: "/dashboard/employees",
  leave: "/dashboard/leave",
  review: "/dashboard/performance",
  position: "/dashboard/positions",
  document: "/dashboard/documents",
  training: "/dashboard/training",
  promotion: "/dashboard/employees",
};

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm">Recent Activity</CardTitle>
        <CardDescription>What changed across the organization recently</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground text-sm">No recent activity.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => {
              const Icon = ICONS[item.type];
              return (
                <li key={item.id}>
                  <Link href={HREF[item.type]} className="group flex items-start gap-3">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <Icon className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-snug group-hover:underline">{item.message}</span>
                      <span className="text-muted-foreground text-xs">{timeAgo(item.timestamp)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
