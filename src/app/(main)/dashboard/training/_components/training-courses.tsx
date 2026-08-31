"use client";

import * as React from "react";

import { Clock, GraduationCap, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { type Course, courseStats, employeeById, trainingRecords } from "@/lib/hr";

import { PersonCell } from "../../_components/hr/person-cell";
import { StatusBadge } from "../../_components/hr/status-badge";

export function TrainingCourses({ courses }: { courses: Course[] }) {
  const [selected, setSelected] = React.useState<Course | null>(null);
  const selectedStats = selected ? courseStats(selected.id) : null;
  const selectedRecords = selected ? trainingRecords.filter((record) => record.courseId === selected.id) : [];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => {
          const stats = courseStats(course.id);
          return (
            <Card
              key={course.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelected(course)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="rounded-sm">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="rounded-sm">
                    {course.level}
                  </Badge>
                </div>
                <CardTitle className="text-base leading-snug">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" /> {course.durationHours}h · {course.format}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" /> {stats.enrolled} enrolled
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Completion</span>
                    <span className="tabular-nums">{stats.completionRate}%</span>
                  </div>
                  <Progress value={stats.completionRate} className="h-1.5" />
                </div>
              </CardContent>
              <CardFooter className="justify-between text-muted-foreground text-xs">
                <span>Instructor: {course.instructor}</span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="size-3.5" /> {stats.certificates}
                </span>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {selected && selectedStats ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-lg border p-3">
                  <div className="font-heading text-xl">{selectedStats.enrolled}</div>
                  <div className="text-muted-foreground text-xs">Enrolled</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="font-heading text-xl">{selectedStats.completionRate}%</div>
                  <div className="text-muted-foreground text-xs">Completed</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="font-heading text-xl">{selectedStats.certificates}</div>
                  <div className="text-muted-foreground text-xs">Certificates</div>
                </div>
              </div>
              <div>
                <div className="mb-2 font-medium text-sm">Enrolled Employees</div>
                <ul className="max-h-64 space-y-2 overflow-y-auto">
                  {selectedRecords.map((record) => {
                    const employee = employeeById.get(record.employeeId);
                    if (!employee) return null;
                    return (
                      <li key={record.id} className="flex items-center justify-between gap-3">
                        <PersonCell
                          id={employee.id}
                          name={employee.name}
                          initials={employee.initials}
                          subtitle={employee.jobTitle}
                          size="sm"
                        />
                        <StatusBadge status={record.status} />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
