import { CalendarClock, CheckCircle2, Clock, Users } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { employeesOnLeaveToday, leaveRequests, NOW } from "@/lib/hr";

import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import { LeaveBalancesTable } from "./_components/leave-balances-table";
import { LeaveCalendar } from "./_components/leave-calendar";
import { LeaveRequestsPanel } from "./_components/leave-requests-panel";

export default function Page() {
  const pending = leaveRequests.filter((r) => r.status === "Pending").length;
  const approved = leaveRequests.filter((r) => r.status === "Approved").length;
  const avgDays =
    leaveRequests.length > 0
      ? Math.round((leaveRequests.reduce((s, r) => s + r.days, 0) / leaveRequests.length) * 10) / 10
      : 0;

  const filters = {
    types: ["Annual", "Sick", "Personal", "Parental", "Unpaid"],
    statuses: ["Pending", "Approved", "Rejected", "Cancelled"],
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Leave Management"
        description="Review requests, track balances and see who's out on the team calendar."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Leave Management" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Pending Requests" value={pending.toLocaleString()} icon={Clock} />
        <KpiCard label="Approved Requests" value={approved.toLocaleString()} icon={CheckCircle2} />
        <KpiCard label="On Leave Today" value={employeesOnLeaveToday.length.toLocaleString()} icon={Users} />
        <KpiCard label="Avg. Request Length" value={`${avgDays} days`} icon={CalendarClock} />
      </div>

      <Tabs defaultValue="requests" className="gap-4">
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
        </TabsList>
        <TabsContent value="requests">
          <LeaveRequestsPanel requests={leaveRequests} filters={filters} />
        </TabsContent>
        <TabsContent value="calendar">
          <LeaveCalendar requests={leaveRequests} initialMonth={NOW} />
        </TabsContent>
        <TabsContent value="balances">
          <LeaveBalancesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
