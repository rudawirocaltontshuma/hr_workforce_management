import Link from "next/link";

import { CalendarCheck, ClipboardPlus, FileBarChart, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ACTIONS = [
  { label: "Add Employee", href: "/dashboard/employees", icon: UserPlus },
  { label: "Post a Job", href: "/dashboard/positions", icon: ClipboardPlus },
  { label: "Review Leave Requests", href: "/dashboard/leave", icon: CalendarCheck },
  { label: "Open Reports", href: "/dashboard/reports", icon: FileBarChart },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Quick Actions</CardTitle>
        <CardDescription>Jump straight into the most common tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ACTIONS.map((action) => (
          <Button key={action.label} variant="outline" asChild className="h-auto flex-col gap-2 py-4">
            <Link href={action.href}>
              <action.icon className="size-4" />
              <span className="text-xs leading-tight">{action.label}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
