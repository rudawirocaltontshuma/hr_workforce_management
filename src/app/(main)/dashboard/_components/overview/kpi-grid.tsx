import {
  Briefcase,
  CalendarClock,
  ClipboardCheck,
  GraduationCap,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import type { dashboardKpis } from "@/lib/hr";

import { KpiCard } from "../hr/kpi-card";

export function KpiGrid({ kpis }: { kpis: ReturnType<typeof dashboardKpis> }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Total Employees"
        value={kpis.totalEmployees.toLocaleString()}
        icon={Users}
        hint="Active headcount"
      />
      <KpiCard
        label="New Employees"
        value={kpis.newEmployees.toLocaleString()}
        icon={UserPlus}
        hint="Started in the last 90 days"
      />
      <KpiCard
        label="Open Positions"
        value={kpis.openPositions.toLocaleString()}
        icon={Briefcase}
        hint="Across all departments"
      />
      <KpiCard
        label="Employees on Leave"
        value={kpis.employeesOnLeave.toLocaleString()}
        icon={CalendarClock}
        hint="Approved leave today"
      />
      <KpiCard
        label="Attendance Rate"
        value={`${kpis.attendanceRate}%`}
        icon={ClipboardCheck}
        delta={{ value: "0.6%", direction: "up" }}
        hint="Latest working day"
      />
      <KpiCard
        label="Turnover Rate"
        value={`${kpis.turnoverRate}%`}
        icon={TrendingDown}
        delta={{ value: "0.3%", direction: "down", tone: "positive" }}
        hint="Trailing 12 months"
      />
      <KpiCard
        label="Performance Completion"
        value={`${kpis.performanceCompletion}%`}
        icon={TrendingUp}
        hint="Current review cycle"
      />
      <KpiCard
        label="Training Completion"
        value={`${kpis.trainingCompletion}%`}
        icon={GraduationCap}
        hint="All active enrollments"
      />
    </div>
  );
}
