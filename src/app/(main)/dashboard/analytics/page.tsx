import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  absenceDistribution,
  applicationsTrend,
  attendanceTrend,
  averageTenureYears,
  candidateSources,
  courseCompletionRates,
  dashboardKpis,
  departmentAttendanceRates,
  departmentDistribution,
  departmentPerformanceScores,
  headcountTrend,
  hiringFunnel,
  lateArrivalsTrend,
  performanceDistribution,
  recruiterPerformance,
  reviewCompletionTrend,
  timeToHireByDepartment,
  trainingCompletionTrend,
  turnoverByDepartment,
  turnoverTrend,
} from "@/lib/hr";

import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import {
  DepartmentDistributionChart,
  HeadcountChart,
  TrainingCompletionChart,
  TurnoverChart,
  AttendanceTrendChart as WorkforceAttendanceChart,
  PerformanceDistributionChart as WorkforcePerformanceChart,
} from "../_components/overview/trend-charts";
import {
  AbsenceDistributionChart,
  DepartmentAttendanceChart,
  LateArrivalsChart,
} from "../attendance/_components/attendance-charts";
import { DepartmentPerformanceChart, ReviewCompletionChart } from "../performance/_components/performance-charts";
import {
  ApplicationsTrendChart,
  CandidateSourcesChart,
  HiringFunnelChart,
  RecruitmentPerformanceChart,
  TimeToHireChart,
} from "../recruitment/_components/recruitment-charts";
import { CourseCompletionChart, TurnoverByDepartmentChart } from "./_components/analytics-extra-charts";

export default function Page() {
  const kpis = dashboardKpis();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Analytics"
        description="Deep-dive analytics across workforce, recruitment, attendance, performance, training and turnover."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Analytics" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Active Employees"
          value={kpis.totalEmployees.toLocaleString()}
          delta={{ value: "3.2%", direction: "up" }}
          hint="vs. 12 months ago"
        />
        <KpiCard
          label="Turnover Rate"
          value={`${kpis.turnoverRate}%`}
          delta={{ value: "0.4%", direction: "down", tone: "positive" }}
          hint="Trailing 12 months"
        />
        <KpiCard label="Average Tenure" value={`${averageTenureYears()} yrs`} />
        <KpiCard label="Attendance Rate" value={`${kpis.attendanceRate}%`} delta={{ value: "0.6%", direction: "up" }} />
      </div>

      <Tabs defaultValue="workforce" className="gap-4">
        <div className="scrollbar-none touch-pan-x overflow-x-auto">
          <TabsList className="w-max min-w-full justify-start">
            <TabsTrigger value="workforce">Workforce</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="turnover">Turnover</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="workforce" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <HeadcountChart data={headcountTrend()} />
          <DepartmentDistributionChart data={departmentDistribution()} />
        </TabsContent>

        <TabsContent value="recruitment" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <HiringFunnelChart data={hiringFunnel()} />
          <ApplicationsTrendChart data={applicationsTrend()} />
          <TimeToHireChart data={timeToHireByDepartment()} />
          <CandidateSourcesChart data={candidateSources()} />
          <div className="xl:col-span-2">
            <RecruitmentPerformanceChart data={recruiterPerformance()} />
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <WorkforceAttendanceChart data={attendanceTrend()} />
          <DepartmentAttendanceChart data={departmentAttendanceRates()} />
          <LateArrivalsChart data={lateArrivalsTrend()} />
          <AbsenceDistributionChart data={absenceDistribution()} />
        </TabsContent>

        <TabsContent value="performance" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <WorkforcePerformanceChart data={performanceDistribution()} />
          <ReviewCompletionChart data={reviewCompletionTrend()} />
          <div className="xl:col-span-2">
            <DepartmentPerformanceChart data={departmentPerformanceScores()} />
          </div>
        </TabsContent>

        <TabsContent value="training" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <TrainingCompletionChart data={trainingCompletionTrend()} />
          <CourseCompletionChart data={courseCompletionRates()} />
        </TabsContent>

        <TabsContent value="turnover" className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <TurnoverChart data={turnoverTrend()} />
          <TurnoverByDepartmentChart data={turnoverByDepartment()} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
