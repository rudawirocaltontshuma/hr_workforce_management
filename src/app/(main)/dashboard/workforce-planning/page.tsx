import { Banknote, TrendingUp, UserPlus, Users } from "lucide-react";

import {
  currentHeadcount,
  forecasts,
  headcountForecastSeries,
  hiringForecastByQuarter,
  plannedHeadcount,
  workforceCostForecast,
} from "@/lib/hr";
import { formatCurrency } from "@/lib/utils";

import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import { ForecastTable } from "./_components/forecast-table";
import {
  DepartmentGrowthChart,
  HeadcountForecastChart,
  HiringPlanChart,
  WorkforceCostChart,
} from "./_components/planning-charts";

export default function Page() {
  const costSeries = workforceCostForecast();
  const projectedCost = costSeries[costSeries.length - 1]?.cost ?? 0;
  const totalPlannedHires = Math.max(0, plannedHeadcount - currentHeadcount);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Workforce Planning"
        description="Headcount forecasts, hiring plans and workforce cost projections for the year ahead."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Workforce Planning" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Current Headcount" value={currentHeadcount.toLocaleString()} icon={Users} />
        <KpiCard
          label="Planned Headcount"
          value={plannedHeadcount.toLocaleString()}
          icon={TrendingUp}
          hint="End of next fiscal year"
        />
        <KpiCard label="Planned New Hires" value={totalPlannedHires.toLocaleString()} icon={UserPlus} />
        <KpiCard
          label="Projected Payroll"
          value={formatCurrency(projectedCost, { noDecimals: true })}
          icon={Banknote}
          hint="By Q4 FY27"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <HeadcountForecastChart data={headcountForecastSeries()} />
        <HiringPlanChart data={hiringForecastByQuarter()} />
        <WorkforceCostChart data={costSeries} />
      </div>

      <DepartmentGrowthChart data={forecasts} />

      <ForecastTable forecasts={forecasts} />
    </div>
  );
}
