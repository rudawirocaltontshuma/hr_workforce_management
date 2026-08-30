import {
  attendanceTrend,
  dashboardKpis,
  departmentDistribution,
  headcountTrend,
  hiringTrend,
  performanceDistribution,
  recentActivity,
  trainingCompletionTrend,
  turnoverTrend,
  upcomingEvents,
} from "@/lib/hr";

import { PageHeader } from "./_components/hr/page-header";
import { KpiGrid } from "./_components/overview/kpi-grid";
import { QuickActions } from "./_components/overview/quick-actions";
import { RecentActivity } from "./_components/overview/recent-activity";
import {
  AttendanceTrendChart,
  DepartmentDistributionChart,
  HeadcountChart,
  HiringChart,
  PerformanceDistributionChart,
  TrainingCompletionChart,
  TurnoverChart,
} from "./_components/overview/trend-charts";
import { UpcomingEvents } from "./_components/overview/upcoming-events";

export default function Page() {
  const kpis = dashboardKpis();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Executive Dashboard"
        description="A live snapshot of headcount, hiring, attendance and performance across Solstice Technologies."
      />

      <KpiGrid kpis={kpis} />

      <QuickActions />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <HeadcountChart data={headcountTrend()} />
        <HiringChart data={hiringTrend()} />
        <TurnoverChart data={turnoverTrend()} />
        <DepartmentDistributionChart data={departmentDistribution()} />
        <AttendanceTrendChart data={attendanceTrend()} />
        <PerformanceDistributionChart data={performanceDistribution()} />
      </div>

      <TrainingCompletionChart data={trainingCompletionTrend()} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentActivity items={recentActivity(8)} />
        <UpcomingEvents events={upcomingEvents()} />
      </div>
    </div>
  );
}
