import { Target, TrendingUp, Users } from "lucide-react";

import {
  departmentPerformanceScores,
  departments,
  performanceDistribution,
  performanceKpis,
  performanceReviews,
  reviewCompletionTrend,
} from "@/lib/hr";

import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import {
  DepartmentPerformanceChart,
  PerformanceDistributionChart,
  ReviewCompletionChart,
} from "./_components/performance-charts";
import { ReviewsTable } from "./_components/reviews-table";

export default function Page() {
  const kpis = performanceKpis();
  const filters = {
    departments: departments.map((d) => d.name).sort(),
    periods: [...new Set(performanceReviews.map((r) => r.period))].sort(),
    statuses: ["Completed", "In Progress", "Not Started"],
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Performance"
        description="Review cycle completion, ratings and department performance trends."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Performance" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Review Completion"
          value={`${kpis.reviewCompletion}%`}
          icon={Users}
          hint={`${kpis.totalCycle} reviews this cycle`}
        />
        <KpiCard label="Average Performance" value={`${kpis.averagePerformance}/100`} icon={TrendingUp} />
        <KpiCard label="Goals Completed" value={kpis.goalsCompleted.toLocaleString()} icon={Target} />
        <KpiCard label="Employees Reviewed" value={kpis.employeesReviewed.toLocaleString()} icon={Users} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PerformanceDistributionChart data={performanceDistribution()} />
        <ReviewCompletionChart data={reviewCompletionTrend()} />
      </div>

      <DepartmentPerformanceChart data={departmentPerformanceScores()} />

      <ReviewsTable reviews={performanceReviews} filters={filters} />
    </div>
  );
}
