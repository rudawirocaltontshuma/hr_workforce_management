import { candidates, departments, positions, STAGE_ORDER } from "@/lib/hr";

import { PageHeader } from "../_components/hr/page-header";
import { CandidatesView } from "./_components/candidates-view";

export default function Page() {
  const filters = {
    positions: [...new Set(positions.map((position) => position.title))].sort(),
    departments: departments.map((department) => department.name).sort(),
    stages: STAGE_ORDER,
    statuses: ["Active", "Hired", "Rejected", "Withdrawn"],
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Candidates"
        description="Every applicant in the pipeline, from first application through offer."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Candidates" }]}
      />
      <CandidatesView candidates={candidates} filters={filters} />
    </div>
  );
}
