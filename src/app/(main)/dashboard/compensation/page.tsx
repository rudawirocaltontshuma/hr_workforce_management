import { Banknote, TrendingUp, Users, Wallet } from "lucide-react";

import {
  activeEmployees,
  compensationDistribution,
  departmentCompensationSummary,
  salaryBands,
  totalPayroll,
} from "@/lib/hr";
import { formatCurrency } from "@/lib/utils";

import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import {
  CompensationDistributionChart,
  DepartmentCompensationChart,
  PerformanceComparisonChart,
} from "./_components/compensation-charts";
import { SalaryBandsTable } from "./_components/salary-bands-table";

export default function Page() {
  const totalComp = totalPayroll();
  const avgComp = activeEmployees.length > 0 ? Math.round(totalComp / activeEmployees.length) : 0;
  const summary = departmentCompensationSummary();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Compensation"
        description="Salary bands, department spend and compensation trends. Figures are illustrative demo data."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Compensation" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Payroll"
          value={formatCurrency(totalComp, { noDecimals: true })}
          icon={Wallet}
          hint="Annualized, active employees"
        />
        <KpiCard label="Average Compensation" value={formatCurrency(avgComp, { noDecimals: true })} icon={Banknote} />
        <KpiCard label="Employees" value={activeEmployees.length.toLocaleString()} icon={Users} />
        <KpiCard label="Salary Bands Tracked" value={salaryBands.length.toLocaleString()} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <DepartmentCompensationChart data={summary} />
        <CompensationDistributionChart data={compensationDistribution()} />
      </div>

      <PerformanceComparisonChart data={summary} />

      <SalaryBandsTable bands={salaryBands} />
    </div>
  );
}
