import { candidates, departmentById, employeeById, positions } from "@/lib/hr";

import { PageHeader } from "../_components/hr/page-header";
import { type PositionRow, PositionsTable } from "./_components/positions-table";

export default function Page() {
  const rows: PositionRow[] = positions.map((position) => ({
    id: position.id,
    title: position.title,
    departmentName: departmentById.get(position.departmentId)?.name ?? "Unassigned",
    location: position.location,
    hiringManagerName: employeeById.get(position.hiringManagerId)?.name ?? "Unassigned",
    openings: position.openings,
    candidateCount: candidates.filter((c) => c.positionId === position.id).length,
    postedDate: position.postedDate,
    status: position.status,
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Job Positions"
        description="Every open, on-hold and closed requisition across the company."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Job Positions" }]}
      />
      <PositionsTable rows={rows} statuses={["Open", "On Hold", "Closed"]} />
    </div>
  );
}
