import { notFound } from "next/navigation";

import { Briefcase, DollarSign, TrendingUp, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  departmentAveragePerformance,
  departmentById,
  departmentEmployees,
  employeeById,
  positions,
  recentActivity,
} from "@/lib/hr";
import { formatCurrency } from "@/lib/utils";

import { getAvatarTone } from "../../_components/hr/avatar-tone";
import { demoActionToast } from "../../_components/hr/demo-toast";
import { timeAgo } from "../../_components/hr/format";
import { KpiCard } from "../../_components/hr/kpi-card";
import { PageHeader } from "../../_components/hr/page-header";
import { StatusBadge } from "../../_components/hr/status-badge";
import { EmployeesDirectory } from "../../employees/_components/employees-directory";
import { DepartmentCharts } from "./_components/department-charts";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const department = departmentById.get(id);

  if (!department) {
    notFound();
  }

  const employees = departmentEmployees(department.id);
  const activeEmployees = employees.filter((e) => e.status !== "Terminated");
  const manager = department.managerId ? employeeById.get(department.managerId) : undefined;
  const deptPositions = positions.filter((position) => position.departmentId === department.id);
  const openCount = deptPositions.filter((p) => p.status === "Open").reduce((sum, p) => sum + p.openings, 0);
  const performance = departmentAveragePerformance(department.id);
  const activity = recentActivity(40).filter(
    (item) => item.employeeId && employeeById.get(item.employeeId)?.departmentId === department.id,
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Departments", href: "/dashboard/departments" },
          { label: department.name },
        ]}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading font-semibold text-xl tracking-tight sm:text-2xl">{department.name}</h1>
            <Badge variant="outline" className="rounded-sm font-mono">
              {department.code}
            </Badge>
            <StatusBadge status={department.status} />
          </div>
          <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">{department.description}</p>
          {manager ? (
            <div className="flex items-center gap-2 pt-1 text-sm">
              <Avatar size="sm" className={getAvatarTone(manager.id)}>
                <AvatarFallback>{manager.initials}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">Led by</span>
              <span className="font-medium">{manager.name}</span>
            </div>
          ) : null}
        </div>
        <Button
          variant="outline"
          onClick={() => demoActionToast("Editing department", `Changes to ${department.name} are not persisted.`)}
        >
          Edit department
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Employees"
          value={activeEmployees.length.toLocaleString()}
          icon={Users}
          hint={`Founded ${department.foundedYear}`}
        />
        <KpiCard
          label="Open Positions"
          value={openCount.toLocaleString()}
          icon={Briefcase}
          hint={`${deptPositions.length} total requisitions`}
        />
        <KpiCard
          label="Annual Budget"
          value={formatCurrency(department.budget, { noDecimals: true })}
          icon={DollarSign}
        />
        <KpiCard label="Avg. Performance" value={`${performance}/100`} icon={TrendingUp} />
      </div>

      <DepartmentCharts employees={activeEmployees} />

      <EmployeesDirectory
        employees={employees}
        filters={{
          departments: [department.name],
          statuses: ["Active", "On Leave", "Probation", "Terminated"],
          locations: [...new Set(employees.map((e) => e.location))].sort(),
          employmentTypes: ["Full-time", "Part-time", "Contract", "Intern"],
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Department Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground text-sm">No recent activity for this department.</p>
          ) : (
            <ul className="space-y-3">
              {activity.slice(0, 8).map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span>{item.message}</span>
                  <span className="shrink-0 text-muted-foreground text-xs">{timeAgo(item.timestamp)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
