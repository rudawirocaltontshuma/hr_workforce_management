import { AlertTriangle, CheckCircle2, Target, TrendingUp } from "lucide-react";

import { departments, type GoalStatus, goals } from "@/lib/hr";

import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import { GoalsStatusChart } from "./_components/goals-status-chart";
import { GoalsTable } from "./_components/goals-table";

const STATUS_ORDER: GoalStatus[] = ["Not Started", "In Progress", "At Risk", "Completed"];

export default function Page() {
  const total = goals.length;
  const completed = goals.filter((g) => g.status === "Completed").length;
  const atRisk = goals.filter((g) => g.status === "At Risk").length;
  const avgProgress = total > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / total) : 0;

  const statusData = STATUS_ORDER.map((status) => ({ status, count: goals.filter((g) => g.status === status).length }));

  const filters = {
    departments: departments.map((d) => d.name).sort(),
    priorities: ["Low", "Medium", "High"],
    statuses: STATUS_ORDER,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Goals"
        description="Track individual and team goals from kickoff to completion."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Goals" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Goals" value={total.toLocaleString()} icon={Target} />
        <KpiCard label="Completed" value={completed.toLocaleString()} icon={CheckCircle2} />
        <KpiCard label="At Risk" value={atRisk.toLocaleString()} icon={AlertTriangle} />
        <KpiCard label="Avg. Progress" value={`${avgProgress}%`} icon={TrendingUp} />
      </div>

      <GoalsStatusChart data={statusData} />

      <GoalsTable goals={goals} filters={filters} />
    </div>
  );
}
