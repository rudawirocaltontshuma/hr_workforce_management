import Link from "next/link";

import { Briefcase, CalendarClock, FileText, GraduationCap, type LucideIcon, TrendingUp } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type Department,
  documentsForEmployee,
  type Employee,
  employeeById,
  getDirectReports,
  goalsForEmployee,
  leaveRequests,
  reviewsForEmployee,
  trainingForEmployee,
} from "@/lib/hr";

import { getAvatarTone } from "../../../_components/hr/avatar-tone";
import { timeAgo } from "../../../_components/hr/format";

interface TimelineEvent {
  id: string;
  icon: LucideIcon;
  message: string;
  date: string;
}

function buildTimeline(employee: Employee): TimelineEvent[] {
  const events: TimelineEvent[] = [
    { id: "join", icon: Briefcase, message: `Joined as ${employee.jobTitle}`, date: employee.startDate },
  ];

  for (const request of leaveRequests.filter((r) => r.employeeId === employee.id).slice(0, 3)) {
    events.push({
      id: `leave-${request.id}`,
      icon: CalendarClock,
      message: `${request.type} leave ${request.status.toLowerCase()} (${request.days} day${request.days === 1 ? "" : "s"})`,
      date: request.appliedDate,
    });
  }

  for (const review of reviewsForEmployee(employee.id).filter((r) => r.status === "Completed")) {
    events.push({
      id: `review-${review.id}`,
      icon: TrendingUp,
      message: `${review.period} performance review completed`,
      date: review.reviewDate,
    });
  }

  for (const record of trainingForEmployee(employee.id)) {
    if (!record.completedDate) continue;
    events.push({
      id: `training-${record.id}`,
      icon: GraduationCap,
      message: "Completed a training course",
      date: record.completedDate,
    });
  }

  for (const document of documentsForEmployee(employee.id).slice(0, 3)) {
    events.push({
      id: `doc-${document.id}`,
      icon: FileText,
      message: `${document.title} added to documents`,
      date: document.uploadedDate,
    });
  }

  return events.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8);
}

export function TabOverview({ employee, department }: { employee: Employee; department?: Department }) {
  const manager = employee.managerId ? employeeById.get(employee.managerId) : undefined;
  const reports = getDirectReports(employee.id);
  const goals = goalsForEmployee(employee.id);
  const goalsInProgress = goals.filter((g) => g.status === "In Progress" || g.status === "At Risk").length;
  const timeline = buildTimeline(employee);
  const tenureYears = ((Date.now() - new Date(employee.startDate).getTime()) / (365.25 * 86400000)).toFixed(1);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground text-xs">Performance</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl">{employee.performanceScore}</CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground text-xs">Attendance</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl">{employee.attendanceRate}%</CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground text-xs">Active Goals</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl">{goalsInProgress}</CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-muted-foreground text-xs">Tenure</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl">{tenureYears}y</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {timeline.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground text-sm">No activity yet.</p>
            ) : (
              <ul className="space-y-4">
                {timeline.map((event) => (
                  <li key={event.id} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <event.icon className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm leading-snug">{event.message}</span>
                      <span className="text-muted-foreground text-xs">{timeAgo(event.date)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Department</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="font-medium text-sm">{department?.name ?? "Unassigned"}</div>
            <p className="text-muted-foreground text-xs leading-relaxed">{department?.description}</p>
            <Link href={`/dashboard/departments/${department?.id}`} className="text-primary text-xs hover:underline">
              View department
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Manager</CardTitle>
          </CardHeader>
          <CardContent>
            {manager ? (
              <Link href={`/dashboard/employees/${manager.id}`} className="flex items-center gap-3">
                <Avatar size="sm" className={getAvatarTone(manager.id)}>
                  <AvatarFallback>{manager.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate font-medium text-sm">{manager.name}</div>
                  <div className="truncate text-muted-foreground text-xs">{manager.jobTitle}</div>
                </div>
              </Link>
            ) : (
              <p className="text-muted-foreground text-sm">No manager assigned.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Direct Reports ({reports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-muted-foreground text-sm">No direct reports.</p>
            ) : (
              <ul className="space-y-3">
                {reports.slice(0, 5).map((report) => (
                  <li key={report.id}>
                    <Link href={`/dashboard/employees/${report.id}`} className="flex items-center gap-3">
                      <Avatar size="sm" className={getAvatarTone(report.id)}>
                        <AvatarFallback>{report.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-sm">{report.name}</div>
                        <div className="truncate text-muted-foreground text-xs">{report.jobTitle}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
