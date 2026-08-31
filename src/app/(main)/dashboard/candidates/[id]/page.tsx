import { notFound } from "next/navigation";

import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { employeeById, getCandidate, positionById } from "@/lib/hr";

import { formatDate } from "../../_components/hr/format";
import { PageHeader } from "../../_components/hr/page-header";
import { CandidateHeader } from "./_components/candidate-header";

const OUTCOME_ICON = { Passed: CheckCircle2, Failed: XCircle, Scheduled: Clock, Pending: Circle };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidate = getCandidate(id);

  if (!candidate) {
    notFound();
  }

  const position = positionById.get(candidate.positionId);
  const recruiter = employeeById.get(candidate.recruiterId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Candidates", href: "/dashboard/candidates" },
          { label: candidate.name },
        ]}
      />
      <CandidateHeader candidate={candidate} positionTitle={position?.title ?? "—"} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Resume Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{candidate.resumeSummary}</p>
              <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                <div>
                  <div className="text-muted-foreground text-xs">Experience</div>
                  <div>{candidate.experienceYears} years</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Education</div>
                  <div>{candidate.education}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Location</div>
                  <div>{candidate.location}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs">Expected salary</div>
                  <div>${candidate.expectedSalary.toLocaleString()}</div>
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-muted-foreground text-xs">Skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="rounded-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Interview Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {candidate.interviewTimeline.map((event) => {
                  const Icon = OUTCOME_ICON[event.outcome];
                  return (
                    <li key={`${event.stage}-${event.date}-${event.interviewer}`} className="flex items-start gap-3">
                      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium text-sm">{event.stage}</span>
                          <span className="text-muted-foreground text-xs">{formatDate(event.date)}</span>
                        </div>
                        <p className="text-muted-foreground text-sm">{event.notes}</p>
                        <p className="text-muted-foreground text-xs">Interviewer: {event.interviewer}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recruitment Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applied</span>
                <span>{formatDate(candidate.appliedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span>{candidate.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recruiter</span>
                <span>{recruiter?.name ?? "Unassigned"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current company</span>
                <span>{candidate.currentCompany}</span>
              </div>
            </CardContent>
          </Card>

          {position ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Position Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="font-medium">{position.title}</div>
                <p className="text-muted-foreground">{position.location}</p>
                <p className="text-muted-foreground">
                  ${position.salaryMin.toLocaleString()} – ${position.salaryMax.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
