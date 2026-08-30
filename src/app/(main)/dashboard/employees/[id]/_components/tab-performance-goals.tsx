import { Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type Employee, goalsForEmployee, reviewsForEmployee } from "@/lib/hr";

import { EmptyState } from "../../../_components/hr/empty-state";
import { formatDate } from "../../../_components/hr/format";
import { StatusBadge } from "../../../_components/hr/status-badge";

export function TabPerformanceGoals({ employee }: { employee: Employee }) {
  const reviews = reviewsForEmployee(employee.id).sort((a, b) => (a.reviewDate < b.reviewDate ? 1 : -1));
  const latest = reviews.find((review) => review.status === "Completed");
  const goals = goalsForEmployee(employee.id);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Performance Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground text-sm">No review cycles yet — recently hired.</p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((review) => (
                  <li key={review.id} className="flex items-center justify-between gap-3 text-sm">
                    <div>
                      <div className="font-medium">{review.period}</div>
                      <div className="text-muted-foreground text-xs">{formatDate(review.reviewDate)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.status === "Completed" ? <span className="tabular-nums">{review.score}/100</span> : null}
                      <StatusBadge status={review.status} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {latest ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Latest Review Summary · {latest.period}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">{latest.summary}</p>
              <div>
                <div className="mb-1.5 text-muted-foreground text-xs">Strengths</div>
                <div className="flex flex-wrap gap-1.5">
                  {latest.strengths.map((strength) => (
                    <Badge key={strength} variant="outline" className="rounded-sm">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-muted-foreground text-xs">Growth areas</div>
                <div className="flex flex-wrap gap-1.5">
                  {latest.growthAreas.map((area) => (
                    <Badge key={area} variant="outline" className="rounded-sm">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <EmptyState
              icon={Target}
              title="No goals assigned"
              description="No active goals are tracked for this employee yet."
            />
          ) : (
            <ul className="space-y-4">
              {goals.map((goal) => (
                <li key={goal.id} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate font-medium text-sm">{goal.title}</span>
                    <StatusBadge status={goal.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={goal.progress} className="h-1.5" />
                    <span className="w-9 shrink-0 text-right text-muted-foreground text-xs tabular-nums">
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Due {formatDate(goal.dueDate)} · {goal.priority} priority
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
