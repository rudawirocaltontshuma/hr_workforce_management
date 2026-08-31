import { CalendarClock, Clock, LogIn, UserX, Wifi } from "lucide-react";

import {
  absenceDistribution,
  attendanceKpis,
  attendanceRecords,
  attendanceTrend,
  departmentAttendanceRates,
  departments,
  lateArrivalsTrend,
} from "@/lib/hr";

import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import {
  AbsenceDistributionChart,
  AttendanceTrendChart,
  DepartmentAttendanceChart,
  LateArrivalsChart,
} from "./_components/attendance-charts";
import { AttendanceTable } from "./_components/attendance-table";

export default function Page() {
  const kpis = attendanceKpis();
  const filters = {
    departments: departments.map((d) => d.name).sort(),
    statuses: ["Present", "Absent", "Late", "Remote", "On Leave"],
    dates: [...new Set(attendanceRecords.map((r) => r.date))].sort().reverse(),
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Attendance"
        description="Daily presence, remote work and absence trends across the company."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Attendance" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Present" value={kpis.Present.toLocaleString()} icon={LogIn} />
        <KpiCard label="Absent" value={kpis.Absent.toLocaleString()} icon={UserX} />
        <KpiCard label="Late" value={kpis.Late.toLocaleString()} icon={Clock} />
        <KpiCard label="Remote" value={kpis.Remote.toLocaleString()} icon={Wifi} />
        <KpiCard label="On Leave" value={kpis["On Leave"].toLocaleString()} icon={CalendarClock} />
        <KpiCard label="Attendance Rate" value={`${kpis.attendanceRate}%`} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <AttendanceTrendChart data={attendanceTrend()} />
        <DepartmentAttendanceChart data={departmentAttendanceRates()} />
        <LateArrivalsChart data={lateArrivalsTrend()} />
        <AbsenceDistributionChart data={absenceDistribution()} />
      </div>

      <AttendanceTable records={attendanceRecords} filters={filters} />
    </div>
  );
}
