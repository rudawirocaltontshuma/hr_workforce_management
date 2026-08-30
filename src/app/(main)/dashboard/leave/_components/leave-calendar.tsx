"use client";

import * as React from "react";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { employeeById, type LeaveRequest } from "@/lib/hr";
import { cn } from "@/lib/utils";

import { PersonCell } from "../../_components/hr/person-cell";
import { StatusBadge } from "../../_components/hr/status-badge";

const TYPE_DOT: Record<string, string> = {
  Annual: "bg-sky-500",
  Sick: "bg-rose-500",
  Personal: "bg-violet-500",
  Parental: "bg-emerald-500",
  Unpaid: "bg-muted-foreground",
};

export function LeaveCalendar({ requests, initialMonth }: { requests: LeaveRequest[]; initialMonth: Date }) {
  const [month, setMonth] = React.useState(initialMonth);
  const [selectedDate, setSelectedDate] = React.useState(initialMonth);

  const approved = requests.filter((request) => request.status === "Approved");

  const gridStart = startOfWeek(startOfMonth(month));
  const gridEnd = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function requestsOnDay(day: Date) {
    return approved.filter(
      (request) => day >= new Date(request.startDate) && day <= new Date(`${request.endDate}T23:59:59`),
    );
  }

  const selectedRequests = requestsOnDay(selectedDate);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_20rem]">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">{format(month, "MMMM yyyy")}</CardTitle>
          <div className="flex gap-1">
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => setMonth((m) => subMonths(m, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft />
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => setMonth((m) => addMonths(m, 1))}
              aria-label="Next month"
            >
              <ChevronRight />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center text-muted-foreground text-xs">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayRequests = requestsOnDay(day);
              const isCurrentMonth = isSameMonth(day, month);
              const isSelected = isSameDay(day, selectedDate);

              return (
                <button
                  type="button"
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "flex min-h-16 flex-col items-start gap-1 rounded-md border p-1.5 text-left transition-colors hover:bg-muted/60",
                    !isCurrentMonth && "opacity-40",
                    isSelected && "border-primary ring-1 ring-primary",
                  )}
                >
                  <span className="text-xs">{format(day, "d")}</span>
                  <div className="flex flex-wrap gap-0.5">
                    {dayRequests.slice(0, 4).map((request) => (
                      <span key={request.id} className={cn("size-1.5 rounded-full", TYPE_DOT[request.type])} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{format(selectedDate, "EEEE, MMM d")}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedRequests.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground text-sm">No one is on leave this day.</p>
          ) : (
            <ul className="space-y-3">
              {selectedRequests.map((request) => {
                const employee = employeeById.get(request.employeeId);
                if (!employee) return null;
                return (
                  <li key={request.id} className="flex items-center justify-between gap-3">
                    <PersonCell
                      id={employee.id}
                      name={employee.name}
                      initials={employee.initials}
                      subtitle={request.type}
                      size="sm"
                    />
                    <StatusBadge status={request.type} tone="slate" />
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
