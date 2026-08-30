"use client";

import Link from "next/link";

import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { recentActivity } from "@/lib/hr";

import { timeAgo } from "../hr/format";

const ACTIVITY_HREF: Record<string, string> = {
  hire: "/dashboard/employees",
  leave: "/dashboard/leave",
  review: "/dashboard/performance",
  position: "/dashboard/positions",
  document: "/dashboard/documents",
  training: "/dashboard/training",
  promotion: "/dashboard/employees",
};

export function NotificationsMenu() {
  const notifications = recentActivity(6);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Notifications" className="relative">
          <Bell />
          {notifications.length > 0 ? (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full px-1 text-[10px]">
              {notifications.length}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="px-2 py-6 text-center text-muted-foreground text-sm">You&apos;re all caught up.</div>
        ) : (
          notifications.map((item) => (
            <DropdownMenuItem key={item.id} asChild className="flex-col items-start gap-0.5 whitespace-normal">
              <Link href={ACTIVITY_HREF[item.type] ?? "/dashboard"}>
                <span className="text-foreground text-sm leading-snug">{item.message}</span>
                <span className="text-muted-foreground text-xs">{timeAgo(item.timestamp)}</span>
              </Link>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center text-sm">
          <Link href="/dashboard">View all activity</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
