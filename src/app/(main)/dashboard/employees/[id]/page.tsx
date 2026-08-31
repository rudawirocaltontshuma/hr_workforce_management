import { notFound } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { departmentById, getEmployee } from "@/lib/hr";

import { PageHeader } from "../../_components/hr/page-header";
import { ProfileHeader } from "./_components/profile-header";
import { TabAttendanceLeave } from "./_components/tab-attendance-leave";
import { TabCompensationBenefits } from "./_components/tab-compensation-benefits";
import { TabOverview } from "./_components/tab-overview";
import { TabPerformanceGoals } from "./_components/tab-performance-goals";
import { TabPersonalEmployment } from "./_components/tab-personal-employment";
import { TabTrainingDocuments } from "./_components/tab-training-documents";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const employee = getEmployee(id);

  if (!employee) {
    notFound();
  }

  const department = departmentById.get(employee.departmentId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Employees", href: "/dashboard/employees" },
          { label: employee.name },
        ]}
      />
      <ProfileHeader employee={employee} department={department} />

      <Tabs defaultValue="overview" className="gap-4">
        <div className="scrollbar-none touch-pan-x overflow-x-auto overscroll-x-contain border-b">
          <TabsList
            className="w-max min-w-full justify-start gap-4 *:data-[slot=tabs-trigger]:flex-none"
            variant="line"
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personal">Personal & Employment</TabsTrigger>
            <TabsTrigger value="attendance">Attendance & Leave</TabsTrigger>
            <TabsTrigger value="performance">Performance & Goals</TabsTrigger>
            <TabsTrigger value="training">Training & Documents</TabsTrigger>
            <TabsTrigger value="compensation">Compensation & Benefits</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <TabOverview employee={employee} department={department} />
        </TabsContent>
        <TabsContent value="personal">
          <TabPersonalEmployment employee={employee} />
        </TabsContent>
        <TabsContent value="attendance">
          <TabAttendanceLeave employee={employee} />
        </TabsContent>
        <TabsContent value="performance">
          <TabPerformanceGoals employee={employee} />
        </TabsContent>
        <TabsContent value="training">
          <TabTrainingDocuments employee={employee} />
        </TabsContent>
        <TabsContent value="compensation">
          <TabCompensationBenefits employee={employee} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
