import { notFound } from "next/navigation";

import { Briefcase, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { candidates, departmentById, employeeById, getPosition, STAGE_ORDER } from "@/lib/hr";

import { formatDate } from "../../_components/hr/format";
import { KpiCard } from "../../_components/hr/kpi-card";
import { PageHeader } from "../../_components/hr/page-header";
import { PersonCell } from "../../_components/hr/person-cell";
import { StatusBadge } from "../../_components/hr/status-badge";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const position = getPosition(id);

  if (!position) {
    notFound();
  }

  const department = departmentById.get(position.departmentId);
  const hiringManager = employeeById.get(position.hiringManagerId);
  const positionCandidates = candidates.filter((c) => c.positionId === position.id);
  const funnel = STAGE_ORDER.filter((s) => s !== "Rejected").map((stage) => ({
    stage,
    count: positionCandidates.filter((c) => c.stage === stage).length,
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Job Positions", href: "/dashboard/positions" },
          { label: position.title },
        ]}
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-heading font-semibold text-xl tracking-tight sm:text-2xl">{position.title}</h1>
          <StatusBadge status={position.status} />
        </div>
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
          <span className="flex items-center gap-1.5">
            <Briefcase className="size-4" /> {department?.name}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" /> {position.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-4" /> {position.openings} opening{position.openings === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Candidates" value={positionCandidates.length.toLocaleString()} />
        <KpiCard label="Openings" value={position.openings.toLocaleString()} />
        <KpiCard label="Posted" value={formatDate(position.postedDate)} />
        <KpiCard
          label="Salary Range"
          value={`$${(position.salaryMin / 1000).toFixed(0)}k–$${(position.salaryMax / 1000).toFixed(0)}k`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{position.description}</p>
              <div>
                <div className="mb-1.5 font-medium text-sm">Responsibilities</div>
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground text-sm">
                  {position.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-1.5 font-medium text-sm">Requirements</div>
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground text-sm">
                  {position.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Candidates for this Position</CardTitle>
            </CardHeader>
            <CardContent>
              {positionCandidates.length === 0 ? (
                <p className="py-6 text-center text-muted-foreground text-sm">No candidates have applied yet.</p>
              ) : (
                <ul className="space-y-3">
                  {positionCandidates.map((candidate) => (
                    <li key={candidate.id} className="flex items-center justify-between gap-3">
                      <a href={`/dashboard/candidates/${candidate.id}`} className="min-w-0 flex-1">
                        <PersonCell
                          id={candidate.id}
                          name={candidate.name}
                          initials={candidate.initials}
                          subtitle={candidate.currentTitle}
                        />
                      </a>
                      <StatusBadge status={candidate.stage} />
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
              <CardTitle className="text-sm">Recruitment Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {funnel.map((row) => (
                  <li key={row.stage} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{row.stage}</span>
                    <Badge variant="outline" className="rounded-sm tabular-nums">
                      {row.count}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Hiring Manager</CardTitle>
            </CardHeader>
            <CardContent>
              {hiringManager ? (
                <a href={`/dashboard/employees/${hiringManager.id}`}>
                  <PersonCell
                    id={hiringManager.id}
                    name={hiringManager.name}
                    initials={hiringManager.initials}
                    subtitle={hiringManager.jobTitle}
                  />
                </a>
              ) : (
                <p className="text-muted-foreground text-sm">Unassigned</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
