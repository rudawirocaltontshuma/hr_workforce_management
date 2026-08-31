import {
  Banknote,
  Briefcase,
  CalendarClock,
  Clock,
  type LucideIcon,
  TrendingDown,
  TrendingUp,
  UserSearch,
  Users,
} from "lucide-react";

import {
  activeEmployees,
  attendanceKpis,
  benefitPlans,
  dashboardKpis,
  leaveRequests,
  performanceKpis,
  recruitmentKpis,
  totalPayroll,
  trainingKpis,
} from "@/lib/hr";
import { formatCurrency } from "@/lib/utils";

export interface ReportDefinition {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  lastGenerated: string;
  stats: { label: string; value: string }[];
}

export function buildReportCatalog(): ReportDefinition[] {
  const kpis = dashboardKpis();
  const recruitment = recruitmentKpis();
  const attendance = attendanceKpis();
  const performance = performanceKpis();
  const training = trainingKpis();
  const pendingLeave = leaveRequests.filter((r) => r.status === "Pending").length;

  return [
    {
      id: "headcount",
      title: "Headcount Report",
      description: "Active headcount, new hires and terminations across every department.",
      icon: Users,
      category: "Workforce",
      lastGenerated: "2026-08-24",
      stats: [
        { label: "Active Employees", value: kpis.totalEmployees.toLocaleString() },
        { label: "New Hires (90d)", value: kpis.newEmployees.toLocaleString() },
      ],
    },
    {
      id: "recruitment",
      title: "Recruitment Report",
      description: "Pipeline volume, hiring funnel conversion and time-to-hire by department.",
      icon: UserSearch,
      category: "Talent Acquisition",
      lastGenerated: "2026-08-22",
      stats: [
        { label: "Open Positions", value: recruitment.openPositions.toLocaleString() },
        { label: "Active Candidates", value: recruitment.activeCandidates.toLocaleString() },
      ],
    },
    {
      id: "attendance",
      title: "Attendance Report",
      description: "Presence, remote work and absence patterns across the organization.",
      icon: Clock,
      category: "Time & Attendance",
      lastGenerated: "2026-08-29",
      stats: [
        { label: "Attendance Rate", value: `${attendance.attendanceRate}%` },
        { label: "Late Arrivals", value: attendance.Late.toLocaleString() },
      ],
    },
    {
      id: "leave",
      title: "Leave Report",
      description: "Leave requests, balances and approvals by type and department.",
      icon: CalendarClock,
      category: "Time & Attendance",
      lastGenerated: "2026-08-27",
      stats: [
        { label: "Pending Requests", value: pendingLeave.toLocaleString() },
        { label: "Total Requests", value: leaveRequests.length.toLocaleString() },
      ],
    },
    {
      id: "performance",
      title: "Performance Report",
      description: "Review cycle completion, ratings distribution and goal attainment.",
      icon: TrendingUp,
      category: "Performance & Growth",
      lastGenerated: "2026-08-20",
      stats: [
        { label: "Review Completion", value: `${performance.reviewCompletion}%` },
        { label: "Avg. Performance", value: `${performance.averagePerformance}/100` },
      ],
    },
    {
      id: "training",
      title: "Training Report",
      description: "Course enrollment, completion rates and certificates issued.",
      icon: Briefcase,
      category: "Performance & Growth",
      lastGenerated: "2026-08-18",
      stats: [
        { label: "Completion Rate", value: `${training.completionRate}%` },
        { label: "Certificates Issued", value: training.certificates.toLocaleString() },
      ],
    },
    {
      id: "compensation",
      title: "Compensation Report",
      description: "Payroll totals, salary bands and department compensation spend.",
      icon: Banknote,
      category: "Compensation & Benefits",
      lastGenerated: "2026-08-15",
      stats: [
        { label: "Total Payroll", value: formatCurrency(totalPayroll(), { noDecimals: true }) },
        { label: "Employees", value: activeEmployees.length.toLocaleString() },
      ],
    },
    {
      id: "turnover",
      title: "Turnover Report",
      description: "Voluntary and involuntary departures, retention by department.",
      icon: TrendingDown,
      category: "Workforce",
      lastGenerated: "2026-08-12",
      stats: [
        { label: "Turnover Rate", value: `${kpis.turnoverRate}%` },
        { label: "Active Employees", value: kpis.totalEmployees.toLocaleString() },
      ],
    },
    {
      id: "benefits",
      title: "Benefits Report",
      description: "Enrollment and participation across every benefit plan.",
      icon: Users,
      category: "Compensation & Benefits",
      lastGenerated: "2026-08-10",
      stats: [
        { label: "Benefit Plans", value: benefitPlans.length.toLocaleString() },
        { label: "Total Enrollments", value: benefitPlans.reduce((s, p) => s + p.enrolledCount, 0).toLocaleString() },
      ],
    },
  ];
}
