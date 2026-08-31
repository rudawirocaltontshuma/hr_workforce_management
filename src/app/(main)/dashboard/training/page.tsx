import { Award, BookOpen, Clock, GraduationCap, Users } from "lucide-react";

import { courses, trainingKpis } from "@/lib/hr";

import { KpiCard } from "../_components/hr/kpi-card";
import { PageHeader } from "../_components/hr/page-header";
import { TrainingCourses } from "./_components/training-courses";

export default function Page() {
  const kpis = trainingKpis();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Training"
        description="Learning and development courses, enrollments and completion across the company."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Training" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Courses" value={kpis.courseCount.toLocaleString()} icon={BookOpen} />
        <KpiCard label="Employees Enrolled" value={kpis.employeesEnrolled.toLocaleString()} icon={Users} />
        <KpiCard label="Completion Rate" value={`${kpis.completionRate}%`} icon={GraduationCap} />
        <KpiCard label="Training Hours" value={kpis.totalHours.toLocaleString()} icon={Clock} />
        <KpiCard label="Certificates Issued" value={kpis.certificates.toLocaleString()} icon={Award} />
      </div>

      <TrainingCourses courses={courses} />
    </div>
  );
}
