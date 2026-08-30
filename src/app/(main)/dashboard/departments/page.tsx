import {
  departmentAveragePerformance,
  departmentHeadcount,
  departmentManagerName,
  departments,
  openPositions,
} from "@/lib/hr";

import { PageHeader } from "../_components/hr/page-header";
import { type DepartmentRow, DepartmentsTable } from "./_components/departments-table";

export default function Page() {
  const rows: DepartmentRow[] = departments.map((department) => ({
    id: department.id,
    name: department.name,
    code: department.code,
    managerName: departmentManagerName(department.id),
    headcount: departmentHeadcount(department.id),
    openPositions: openPositions
      .filter((position) => position.departmentId === department.id)
      .reduce((s, p) => s + p.openings, 0),
    budget: department.budget,
    performance: departmentAveragePerformance(department.id),
    status: department.status,
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Departments"
        description="Headcount, budget and performance across every department."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Departments" }]}
      />
      <DepartmentsTable rows={rows} />
    </div>
  );
}
