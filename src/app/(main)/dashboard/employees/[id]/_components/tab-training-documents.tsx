import { FileText, GraduationCap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { courseById, documentsForEmployee, type Employee, trainingForEmployee } from "@/lib/hr";

import { EmptyState } from "../../../_components/hr/empty-state";
import { formatDate } from "../../../_components/hr/format";
import { StatusBadge } from "../../../_components/hr/status-badge";

export function TabTrainingDocuments({ employee }: { employee: Employee }) {
  const training = trainingForEmployee(employee.id);
  const documents = documentsForEmployee(employee.id);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Training & Development</CardTitle>
        </CardHeader>
        <CardContent>
          {training.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No training enrollments"
              description="This employee hasn't enrolled in any courses yet."
            />
          ) : (
            <ul className="space-y-4">
              {training.map((record) => {
                const course = courseById.get(record.courseId);
                return (
                  <li key={record.id} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-medium text-sm">{course?.title ?? "Course"}</span>
                      <StatusBadge status={record.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={record.progress} className="h-1.5" />
                      <span className="w-9 shrink-0 text-right text-muted-foreground text-xs tabular-nums">
                        {record.progress}%
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {record.certificateIssued ? "Certificate issued · " : ""}
                      Enrolled {formatDate(record.enrolledDate)}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents"
              description="No documents have been uploaded for this employee."
            />
          ) : (
            <ul className="space-y-3">
              {documents.map((document) => (
                <li key={document.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <FileText className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{document.title}</div>
                      <div className="text-muted-foreground text-xs">
                        {document.category} · {formatDate(document.uploadedDate)}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={document.status} />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
