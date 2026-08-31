"use client";

import * as React from "react";

import { CheckCircle2, Circle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { departmentById, employeeById, type OnboardingCategory, type OnboardingRecord } from "@/lib/hr";
import { cn } from "@/lib/utils";

import { getAvatarTone } from "../../_components/hr/avatar-tone";
import { demoActionToast } from "../../_components/hr/demo-toast";
import { formatDate } from "../../_components/hr/format";

const CATEGORY_ORDER: OnboardingCategory[] = [
  "Employment Documents",
  "Access Setup",
  "Equipment",
  "Company Policies",
  "Orientation",
  "Team Introduction",
  "Training",
  "Benefits",
];

function progressOf(record: OnboardingRecord) {
  const completed = record.tasks.filter((task) => task.completed).length;
  return Math.round((completed / record.tasks.length) * 100);
}

export function OnboardingBoard({ records }: { records: OnboardingRecord[] }) {
  const [state, setState] = React.useState(records);
  const [selectedId, setSelectedId] = React.useState(records[0]?.employeeId ?? null);

  const selected = state.find((record) => record.employeeId === selectedId) ?? state[0];

  function toggleTask(employeeId: string, taskId: string) {
    setState((current) =>
      current.map((record) =>
        record.employeeId === employeeId
          ? {
              ...record,
              tasks: record.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
            }
          : record,
      ),
    );
  }

  if (state.length === 0 || !selected) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[22rem_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-sm">New Hires ({state.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {state.map((record) => {
            const employee = employeeById.get(record.employeeId);
            if (!employee) return null;
            const progress = progressOf(record);
            const isActive = record.employeeId === selected.employeeId;

            return (
              <button
                type="button"
                key={record.employeeId}
                onClick={() => setSelectedId(record.employeeId)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-muted/60",
                  isActive && "bg-muted",
                )}
              >
                <Avatar size="sm" className={getAvatarTone(employee.id)}>
                  <AvatarFallback>{employee.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-sm">{employee.name}</div>
                  <div className="truncate text-muted-foreground text-xs">{employee.jobTitle}</div>
                </div>
                <div className="w-16 shrink-0 text-right">
                  <span className="text-muted-foreground text-xs tabular-nums">{progress}%</span>
                  <Progress value={progress} className="mt-1 h-1" />
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        {(() => {
          const employee = employeeById.get(selected.employeeId);
          const buddy = selected.buddyId ? employeeById.get(selected.buddyId) : undefined;
          const department = employee ? departmentById.get(employee.departmentId) : undefined;
          const progress = progressOf(selected);

          if (!employee) return null;

          return (
            <>
              <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                <div className="flex items-center gap-3">
                  <Avatar size="lg" className={getAvatarTone(employee.id)}>
                    <AvatarFallback>{employee.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{employee.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {employee.jobTitle} · {department?.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Started {formatDate(selected.startDate)}
                      {buddy ? ` · Onboarding buddy: ${buddy.name}` : ""}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-heading text-2xl tracking-tight">{progress}%</div>
                  <div className="text-muted-foreground text-xs">complete</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <Progress value={progress} />
                {CATEGORY_ORDER.map((category) => {
                  const tasks = selected.tasks.filter((task) => task.category === category);
                  if (tasks.length === 0) return null;

                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{category}</h3>
                        <Badge variant="outline" className="rounded-sm text-xs">
                          {tasks.filter((t) => t.completed).length}/{tasks.length}
                        </Badge>
                      </div>
                      <ul className="space-y-1.5">
                        {tasks.map((task) => (
                          <li key={task.id} className="flex items-center gap-2.5 rounded-md border px-3 py-2">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() => {
                                toggleTask(selected.employeeId, task.id);
                                demoActionToast(
                                  task.completed
                                    ? `Marked "${task.label}" incomplete`
                                    : `Marked "${task.label}" complete`,
                                );
                              }}
                            />
                            <span
                              className={cn("flex-1 text-sm", task.completed && "text-muted-foreground line-through")}
                            >
                              {task.label}
                            </span>
                            {task.completed ? (
                              <CheckCircle2 className="size-4 text-emerald-500" />
                            ) : (
                              <Circle className="size-4 text-muted-foreground" />
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </CardContent>
            </>
          );
        })()}
      </Card>
    </div>
  );
}
