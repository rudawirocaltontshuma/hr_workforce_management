import { departments, employees } from "@/lib/hr";

import { PageHeader } from "../_components/hr/page-header";
import { EmployeesDirectory } from "./_components/employees-directory";

export default function Page() {
  const filters = {
    departments: departments.map((department) => department.name).sort(),
    statuses: ["Active", "On Leave", "Probation", "Terminated"],
    locations: [...new Set(employees.map((employee) => employee.location))].sort(),
    employmentTypes: ["Full-time", "Part-time", "Contract", "Intern"],
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Employees"
        description="Browse, search and manage every employee record across Solstice Technologies."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Employees" }]}
      />
      <EmployeesDirectory employees={employees} filters={filters} />
    </div>
  );
}
